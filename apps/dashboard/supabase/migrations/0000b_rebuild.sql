-- =============================================================================
-- STEP 2 of 2 — FULL REBUILD (run AFTER 0000a_cleanup.sql succeeded)
-- =============================================================================

set lock_timeout = '10s';

-- ------------------------------------------------------------- profiles ------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: read own"
  on public.profiles for select using (auth.uid() = id);

create policy "profiles: admins read all"
  on public.profiles for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles: self insert on signup"
  on public.profiles for insert with check (auth.uid() = id and role = 'client');

create policy "profiles: self update (name only)"
  on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'client');

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------- settings ------
create table public.settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'Elkahmed Business',
  contact_email text not null default 'hello@elkahmed.com',
  contact_phone text not null default '',
  address text not null default '',
  working_hours text not null default '',
  logo_url text,
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz
);

insert into public.settings (id) values (1) on conflict (id) do nothing;

alter table public.settings enable row level security;

create policy "settings: public read"
  on public.settings for select using (true);

create policy "settings: admins update"
  on public.settings for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------------- requests ------
create table public.requests (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text not null,
  company text,
  need text not null,
  message text not null,
  budget text,
  deadline date,
  status text not null default 'new' check (status in ('new','reviewing','accepted','rejected')),
  created_at timestamptz not null default now()
);

alter table public.requests enable row level security;

create policy "requests: anyone can submit"
  on public.requests for insert with check (status = 'new');

create policy "requests: admins manage"
  on public.requests for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------------- projects ------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client text not null default '',
  category text not null default 'Website',
  status text not null default 'Request Submitted',
  description text,
  images text[] not null default '{}',
  deadline date,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "projects: public read"
  on public.projects for select using (true);

create policy "projects: admins write"
  on public.projects for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------------- services ------
create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text not null default '',
  description text,
  image_url text,
  price numeric(12,2),
  discount_price numeric(12,2),
  currency text not null default 'MAD' check (currency in ('MAD','EUR','USD')),
  updated_at timestamptz
);

alter table public.services enable row level security;

create policy "services: public read"
  on public.services for select using (true);

create policy "services: admins write"
  on public.services for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- --------------------------------------------- messages + files --------------
create table public.messages (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  author_name text not null default 'Team',
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "messages: admins manage"
  on public.messages for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create table public.files (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  uploaded_by uuid references auth.users (id) on delete set null,
  file_url text not null,
  file_name text not null,
  file_type text,
  created_at timestamptz not null default now()
);

alter table public.files enable row level security;

create policy "files: admins manage"
  on public.files for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- --------------------------------------------------------- notifications -----
create table public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications: read own"
  on public.notifications for select using (user_id = auth.uid());

create policy "notifications: mark own read"
  on public.notifications for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications: admins insert"
  on public.notifications for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- --------------------------------------------------- notification triggers ---
create or replace function public.notify_admins(title text, body text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (user_id, title, body)
  select id, title, body from public.profiles where role = 'admin';
end;
$$;

create or replace function public.on_request_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.notify_admins(
    'New project request',
    (select name from public.requests where id = new.id) || ' requested a project.'
  );
  return new;
end;
$$;

create or replace function public.on_message_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.notify_admins('New message', left(new.body, 80));
  return new;
end;
$$;

create trigger requests_notify
  after insert on public.requests
  for each row execute function public.on_request_created();

create trigger messages_notify
  after insert on public.messages
  for each row execute function public.on_message_created();

-- --------------------------------------------------------------- realtime ----
alter publication supabase_realtime add table public.requests;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ---------------------------------------------------------------- storage ----
insert into storage.buckets (id, name, public)
values ('elkahmed-assets', 'elkahmed-assets', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('elkahmed-files', 'elkahmed-files', false)
on conflict (id) do nothing; -- private bucket: never flip to public

drop policy if exists "assets: public read" on storage.objects;
create policy "assets: public read"
  on storage.objects for select using (bucket_id = 'elkahmed-assets');

drop policy if exists "assets: admins write" on storage.objects;
create policy "assets: admins write"
  on storage.objects for all using (
    bucket_id = 'elkahmed-assets'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "files: admins all" on storage.objects;
create policy "files: admins all"
  on storage.objects for all using (
    bucket_id = 'elkahmed-files'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------- bootstrap admin (DEV) -----
insert into public.profiles (id, email, full_name, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', u.raw_user_meta_data ->> 'name'),
  'admin'
from auth.users u
on conflict (id) do update set role = 'admin';
