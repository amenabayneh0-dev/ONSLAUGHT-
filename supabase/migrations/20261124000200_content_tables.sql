-- =====================================================================
-- ONSLAUGHT ESPORTS, Phase 08, migration 2 of 4
-- Public content tables: players, tournaments, achievements, gallery, site_settings.
--
-- Requires migration 1 (…0100) to have run first (uses public.is_admin()).
-- HOW TO RUN: SQL Editor -> paste -> Run. Idempotent; nothing is dropped.
--
-- ACCESS MODEL
--   Visitors (anon + signed-in non-admins): may READ rows where is_published = true.
--   Administrators (profiles.role = 'admin'): may read everything and create/update/delete.
--   Enforced by Row Level Security AND by table privileges, never by the front end.
-- =====================================================================

-- ---------------------------------------------------------------- players
create table if not exists public.players (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 60),
  username        text not null check (char_length(username) between 2 and 30),
  number          smallint not null check (number between 0 and 99),
  role            text not null check (role in ('igl', 'assault', 'entry', 'sniper', 'support')),
  country         text not null check (char_length(country) between 1 and 56),
  description     text not null default '' check (char_length(description) <= 200),
  bio             text not null default '' check (char_length(bio) <= 1500),
  photo_path      text check (char_length(photo_path) <= 300),           -- file in the player-photos bucket
  photo_url       text check (photo_url ~ '^(https://|/)' and char_length(photo_url) <= 500), -- or an external / site path
  photo_position  text not null default 'center top' check (char_length(photo_position) <= 40),
  kills           integer not null default 0 check (kills >= 0),
  matches         integer not null default 0 check (matches >= 0),
  mvps            integer not null default 0 check (mvps >= 0),
  win_rate        numeric(5,2) not null default 0 check (win_rate between 0 and 100),
  is_sample       boolean not null default false,
  is_published    boolean not null default true,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint players_number_key unique (number)
);
create unique index if not exists players_username_lower_key on public.players (lower(username));
create index if not exists players_public_order_idx on public.players (is_published, sort_order, number);

-- ------------------------------------------------------------ tournaments
create table if not exists public.tournaments (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  name          text not null check (char_length(name) between 1 and 80),
  held_on       text not null check (held_on ~ '^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$'),  -- 'YYYY-MM' or 'YYYY-MM-DD'
  placement     integer not null check (placement >= 1),
  teams         integer not null check (teams >= 1),
  description   text not null default '' check (char_length(description) <= 300),
  image_path    text check (char_length(image_path) <= 300),             -- file in the tournament-images bucket
  image_url     text check (image_url ~ '^(https://|/)' and char_length(image_url) <= 500),
  is_sample     boolean not null default false,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint tournaments_placement_within_teams check (placement <= teams)
);
create index if not exists tournaments_public_date_idx on public.tournaments (is_published, held_on desc);

-- ----------------------------------------------------------- achievements
-- kind 'mvp' / 'special' : an award earned at one tournament (tournament_id set).
-- kind 'honor'           : a personal achievement shown on a player's profile (player_id set).
create table if not exists public.achievements (
  id             uuid primary key default gen_random_uuid(),
  kind           text not null check (kind in ('mvp', 'special', 'honor')),
  tournament_id  uuid references public.tournaments (id) on delete cascade,
  player_id      uuid references public.players (id) on delete cascade,
  title          text not null check (char_length(title) between 1 and 120),
  event          text not null default '' check (char_length(event) <= 120),
  year           smallint check (year between 2000 and 2100),
  player_label   text check (char_length(player_label) <= 60),           -- who earned a tournament award
  is_sample      boolean not null default false,
  is_published   boolean not null default true,
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint achievements_shape check (
    (kind = 'honor' and player_id is not null and tournament_id is null)
    or (kind in ('mvp', 'special') and tournament_id is not null and player_id is null)
  )
);
create index if not exists achievements_tournament_idx on public.achievements (tournament_id);
create index if not exists achievements_player_idx on public.achievements (player_id);
create index if not exists achievements_public_idx on public.achievements (is_published, kind);

-- ---------------------------------------------------------------- gallery
create table if not exists public.gallery (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null check (kind in ('photo', 'video')),
  category      text not null check (char_length(category) between 1 and 40),
  title         text not null check (char_length(title) between 1 and 80),
  caption       text not null default '' check (char_length(caption) <= 200),
  alt           text not null default '' check (char_length(alt) <= 150),
  layout        text not null default 'normal' check (layout in ('normal', 'wide', 'tall', 'feature')),
  image_path    text check (char_length(image_path) <= 300),             -- file in the gallery-photos bucket
  image_url     text check (image_url ~ '^(https://|/)' and char_length(image_url) <= 500),
  video_url     text check (char_length(video_url) <= 300),              -- any YouTube link or 11-char id
  description   text not null default '' check (char_length(description) <= 300),
  duration      text not null default '' check (char_length(duration) <= 12),
  is_sample     boolean not null default false,
  is_published  boolean not null default true,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint gallery_video_url_only_for_videos check (kind = 'video' or video_url is null),
  constraint gallery_images_only_for_photos check (kind = 'photo' or (image_path is null and image_url is null))
);
create index if not exists gallery_kind_category_idx on public.gallery (kind, category);
create index if not exists gallery_public_order_idx on public.gallery (is_published, kind, sort_order);

-- ---------------------------------------------------------- site_settings
-- Key/value JSON: clan, socials, recruitment, content, gallery_categories, team_stats.
-- Rows with is_public = true are readable by everyone, so NEVER store secrets here.
create table if not exists public.site_settings (
  key         text primary key check (key ~ '^[a-z_]{2,40}$'),
  value       jsonb not null,
  is_public   boolean not null default true,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users (id) on delete set null
);

create or replace function public.site_settings_stamp()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  new.updated_by = (select auth.uid());
  return new;
end;
$$;

drop trigger if exists site_settings_stamp on public.site_settings;
create trigger site_settings_stamp
  before insert or update on public.site_settings
  for each row execute function public.site_settings_stamp();

-- updated_at triggers for the other tables
do $$
declare t text;
begin
  foreach t in array array['players', 'tournaments', 'achievements', 'gallery'] loop
    execute format('drop trigger if exists %I on public.%I', t || '_set_updated_at', t);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end $$;

-- Recruitment gate used by the applications policy (migration 3). Defaults to OPEN when unset.
create or replace function public.recruitment_is_open()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select s.value ->> 'status' from public.site_settings s where s.key = 'recruitment'), 'open') = 'open';
$$;
revoke all on function public.recruitment_is_open() from public;
grant execute on function public.recruitment_is_open() to anon, authenticated;

-- ---------------------------------------------------------------------
-- Privileges + Row Level Security
-- Supabase grants new tables to anon/authenticated by default, so reset them first,
-- then grant only what is needed. RLS then decides which ROWS are allowed.
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['players', 'tournaments', 'achievements', 'gallery', 'site_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon, authenticated', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on table public.%I to authenticated', t);
  end loop;
end $$;

-- Public READ of approved content
drop policy if exists "Public can read published players" on public.players;
create policy "Public can read published players" on public.players for select to anon, authenticated using (is_published);
drop policy if exists "Public can read published tournaments" on public.tournaments;
create policy "Public can read published tournaments" on public.tournaments for select to anon, authenticated using (is_published);
drop policy if exists "Public can read published achievements" on public.achievements;
create policy "Public can read published achievements" on public.achievements for select to anon, authenticated using (is_published);
drop policy if exists "Public can read published gallery" on public.gallery;
create policy "Public can read published gallery" on public.gallery for select to anon, authenticated using (is_published);
drop policy if exists "Public can read public settings" on public.site_settings;
create policy "Public can read public settings" on public.site_settings for select to anon, authenticated using (is_public);

-- ADMIN full access (read everything incl. unpublished, and write)
do $$
declare t text;
begin
  foreach t in array array['players', 'tournaments', 'achievements', 'gallery', 'site_settings'] loop
    execute format('drop policy if exists "Admins can read all %1$s" on public.%1$I', t);
    execute format('create policy "Admins can read all %1$s" on public.%1$I for select to authenticated using ((select public.is_admin()))', t);
    execute format('drop policy if exists "Admins can insert %1$s" on public.%1$I', t);
    execute format('create policy "Admins can insert %1$s" on public.%1$I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format('drop policy if exists "Admins can update %1$s" on public.%1$I', t);
    execute format('create policy "Admins can update %1$s" on public.%1$I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('drop policy if exists "Admins can delete %1$s" on public.%1$I', t);
    execute format('create policy "Admins can delete %1$s" on public.%1$I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end $$;
