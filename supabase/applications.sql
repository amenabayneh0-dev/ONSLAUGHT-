-- ONSLAUGHT ESPORTS: applications table for Supabase.
-- Run in the Supabase SQL editor. Then set VITE_SUPABASE_URL and
-- VITE_SUPABASE_ANON_KEY (see .env.example) and rebuild the site.

create table if not exists public.applications (
  id                      uuid primary key default gen_random_uuid(),
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  status                  text not null default 'pending'
                          check (status in ('pending', 'accepted', 'rejected')),
  pubg_username           text not null check (char_length(pubg_username) between 3 and 30),
  pubg_id                 text not null check (char_length(pubg_id) between 5 and 40),
  age                     smallint not null check (age between 13 and 99),
  country                 text not null check (char_length(country) between 2 and 56),
  preferred_role          text not null check (preferred_role in ('igl', 'assault', 'entry', 'sniper', 'support')),
  kd_ratio                numeric(5,2) not null check (kd_ratio > 0 and kd_ratio <= 50),
  competitive_experience  text not null check (competitive_experience in ('none', 'scrims', 'online', 'lan', 'pro')),
  previous_clan           text check (char_length(previous_clan) <= 60),
  discord_username        text not null check (char_length(discord_username) between 2 and 40),
  additional_info         text check (char_length(additional_info) <= 1000),
  admin_notes             text check (char_length(admin_notes) <= 1000),  -- staff-only notes (admin dashboard)
  reviewed_by             uuid,            -- staff user who changed the status (future admin phase)
  reviewed_at             timestamptz
);

-- One application per PUBG ID (case-insensitive). The site shows a friendly
-- "already applied" message when this constraint rejects a duplicate.
create unique index if not exists applications_pubg_id_unique
  on public.applications (lower(pubg_id));

alter table public.applications enable row level security;

-- Visitors may INSERT new applications, and only as 'pending'.
-- No SELECT / UPDATE / DELETE policy exists for anonymous users, so nobody can
-- read other applicants' data or change a status from the browser.
drop policy if exists "Anyone can apply" on public.applications;
create policy "Anyone can apply"
  on public.applications for insert
  to anon
  with check (status = 'pending');

-- Staff access (future admin phase): add policies for authenticated staff, e.g.
--   create policy "Staff can read" on public.applications for select to authenticated using (...);
--   create policy "Staff can review" on public.applications for update to authenticated using (...);

-- Already created the table earlier? Add the notes column with:
--   alter table public.applications add column if not exists admin_notes text check (char_length(admin_notes) <= 1000);
