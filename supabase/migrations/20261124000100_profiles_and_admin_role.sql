-- =====================================================================
-- ONSLAUGHT ESPORTS, Phase 08, migration 1 of 4
-- Profiles, admin role check, shared helpers.
--
-- HOW TO RUN: Supabase dashboard -> SQL Editor -> paste this whole file -> Run.
-- Run the four phase-08 migrations IN ORDER (…0100, …0200, …0300, …0400).
-- Safe to re-run: everything is idempotent. Nothing here drops data.
-- =====================================================================

-- Keeps `updated_at` correct on every table that has it.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- One profile per Supabase Auth user. `role` is what makes someone an administrator.
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text,
  display_name  text check (char_length(display_name) <= 60),
  role          text not null default 'user' check (role in ('user', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists profiles_admin_idx on public.profiles (id) where role = 'admin';

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Every new auth user gets a profile with the LOWEST role ('user').
-- Nobody becomes an admin automatically; see supabase/README.md for the one manual step.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill profiles for users that already exist (all as 'user').
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

-- THE authorization check used by every admin policy in this project.
-- SECURITY DEFINER so it can read profiles without recursing into profiles' own RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Row Level Security for profiles
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;

-- Defense in depth: the API roles get SELECT only. There is deliberately NO insert/update/delete
-- privilege, so a signed-in user can never edit their own role through the API.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

drop policy if exists "Admins can read all profiles" on public.profiles;
create policy "Admins can read all profiles"
  on public.profiles for select to authenticated
  using ((select public.is_admin()));
