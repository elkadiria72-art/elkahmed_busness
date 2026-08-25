-- =============================================================================
-- Elkahmed Business — dashboard module schema, RLS and storage policies.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Idempotent: safe to re-run.
-- =============================================================================

-- ---------------------------------------------------------------- profiles ---
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles: read own" on public.profiles;
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles: admins read all" on public.profiles;
create policy "profiles: admins read all" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "profiles: self insert on signup" on public.profiles;
create policy "profiles: self insert on signup" on public.profiles
  for insert with check (auth.uid() = id and role = 'client');

drop policy if exists "profiles: self update (name only)" on public.profiles;
create policy "profiles: self update (name only)" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'client');

-- Auto-create a profile on signup (never admin by default).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', null), 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------- settings ---
create table if not exists public.settings (
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

drop policy if exists "settings: public read" on public.settings;
create policy "settings: public read" on public.settings
  for select using (true);

drop policy if exists "settings: admins update" on public.settings;
create policy "settings: admins update" on public.settings
  for update using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------- requests ---
create table if not exists public.requests (
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

drop policy if exists "requests: anyone can submit" on public.requests;
create policy "requests: anyone can submit" on public.requests
  for insert with check (status = 'new');

drop policy if exists "requests: admins manage" on public.requests;
create policy "requests: admins manage" on public.requests
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------- projects ---
create table if not exists public.projects (
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

drop policy if exists "projects: public read" on public.projects;
create policy "projects: public read" on public.projects
  for select using (true);

drop policy if exists "projects: admins write" on public.projects;
create policy "projects: admins write" on public.projects
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------- services ---
create table if not exists public.services (
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

drop policy if exists "services: public read" on public.services;
create policy "services: public read" on public.services
  for select using (true);

drop policy if exists "services: admins write" on public.services;
create policy "services: admins write" on public.services
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------- messages ---
create table if not exists public.messages (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  sender_id uuid references auth.users (id) on delete set null,
  author_name text not null default 'Team',
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

drop policy if exists "messages: admins manage" on public.messages;
create policy "messages: admins manage" on public.messages
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------------------- files ---
create table if not exists public.files (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects (id) on delete cascade,
  uploaded_by uuid references auth.users (id) on delete set null,
  file_url text not null,
  file_name text not null,
  file_type text,
  created_at timestamptz not null default now()
);

alter table public.files enable row level security;

drop policy if exists "files: admins manage" on public.files;
create policy "files: admins manage" on public.files
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ------------------------------------------------------------ notifications --
create table if not exists public.notifications (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

drop policy if exists "notifications: read own" on public.notifications;
create policy "notifications: read own" on public.notifications
  for select using (user_id = auth.uid());

drop policy if exists "notifications: mark own read" on public.notifications;
create policy "notifications: mark own read" on public.notifications
  for update using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "notifications: admins insert" on public.notifications;
create policy "notifications: admins insert" on public.notifications
  for insert with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Notification triggers: new request / new message notify every admin.
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

drop trigger if exists requests_notify on public.requests;
create trigger requests_notify
  after insert on public.requests
  for each row execute function public.on_request_created();

drop trigger if exists messages_notify on public.messages;
create trigger messages_notify
  after insert on public.messages
  for each row execute function public.on_message_created();

-- ----------------------------------------------------------------- realtime --
alter publication supabase_realtime add table public.requests;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ----------------------------------------------------------------- storage ---
insert into storage.buckets (id, name, public)
values ('elkahmed-assets', 'elkahmed-assets', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('elkahmed-files', 'elkahmed-files', false)
on conflict (id) do nothing;  -- private bucket: never flip to public

-- Assets bucket: world-readable, admin-writable.
drop policy if exists "assets: public read" on storage.objects;
create policy "assets: public read" on storage.objects
  for select using (bucket_id = 'elkahmed-assets');

drop policy if exists "assets: admins write" on storage.objects;
create policy "assets: admins write" on storage.objects
  for all using (
    bucket_id = 'elkahmed-assets'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Files bucket: admin-only access. Clients receive time-limited signed URLs
-- generated by the dashboard, so no client read policy is required.
drop policy if exists "files: admins all" on storage.objects;
create policy "files: admins all" on storage.objects
  for all using (
    bucket_id = 'elkahmed-files'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
