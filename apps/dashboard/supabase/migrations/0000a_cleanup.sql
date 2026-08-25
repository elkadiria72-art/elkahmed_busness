-- =============================================================================
-- STEP 1 of 2 — CLEANUP ONLY
-- Close every other Supabase tab (Table Editor!) before running this.
-- =============================================================================

set lock_timeout = '10s';

drop trigger if exists set_settings_updated_at on public.settings;
drop trigger if exists set_projects_updated_at on public.projects;
drop trigger if exists requests_notify on public.requests;
drop trigger if exists messages_notify on public.messages;
drop trigger if exists on_auth_user_created on auth.users;

-- CASCADE removes dependent objects (e.g. leftover update-timestamp triggers)
drop function if exists public.touch_updated_at() cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.on_request_created() cascade;
drop function if exists public.on_message_created() cascade;
drop function if exists public.notify_admins(text, text) cascade;
drop function if exists public.handle_new_user() cascade;

drop table if exists public.notifications cascade;
drop table if exists public.files cascade;
drop table if exists public.messages cascade;
drop table if exists public.services cascade;
drop table if exists public.projects cascade;
drop table if exists public.requests cascade;
drop table if exists public.settings cascade;
drop table if exists public.profiles cascade;

drop policy if exists "assets: admin insert"  on storage.objects;
drop policy if exists "assets: admin update"  on storage.objects;
drop policy if exists "assets: admin delete"  on storage.objects;
drop policy if exists "files: participants read" on storage.objects;
drop policy if exists "files: admin write"    on storage.objects;
