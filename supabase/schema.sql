-- =====================================================================
-- Kumkum Dahreja · portfolio + admin database
-- Run this once in Supabase → SQL Editor → New query → Run.
-- Public tables: what the website shows. Private tables: money,
-- deliverables, contacts. Only the admin account can see private data.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- Admin accounts ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Projects (public part) ----------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  kind text not null default '',
  category text not null default 'web' check (category in ('web', 'shopify', 'wordpress', 'app', 'design')),
  image_url text not null default '',
  live_url text not null default '',
  summary text not null default '',
  stack text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'live' check (status in ('live', 'in-progress')),
  published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Projects (private part: client, stage, money) ----------
create table if not exists public.project_private (
  project_id uuid primary key references public.projects (id) on delete cascade,
  client text not null default '',
  source text not null default 'direct' check (source in ('direct', 'upwork', 'agency', 'personal')),
  stage text not null default 'onboarding' check (stage in ('onboarding', 'design', 'development', 'review', 'delivered')),
  repo_url text not null default '',
  start_date date,
  due_date date,
  delivered_date date,
  amount numeric(12, 2) not null default 0,
  received numeric(12, 2) not null default 0,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'advance', 'settled', 'na')),
  notes text not null default ''
);

-- ---------- Brands & cafés (public names wall) ----------
create table if not exists public.collabs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('cafe', 'brand', 'modelling', 'ugc')),
  show_on_site boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Deals (private: deliverables, dates, payments) ----------
create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  collab_id uuid not null references public.collabs (id) on delete cascade,
  title text not null default '',
  deal_type text not null default 'barter' check (deal_type in ('paid', 'barter', 'ugc', 'paid_barter')),
  status text not null default 'planned' check (status in ('planned', 'shoot_done', 'editing', 'posted', 'done', 'cancelled')),
  deliverables jsonb not null default '[]'::jsonb,   -- [{ "label": "Reel", "done": false }]
  shoot_date date,
  due_date date,
  posted_date date,
  amount numeric(12, 2) not null default 0,
  received numeric(12, 2) not null default 0,
  payment_status text not null default 'na' check (payment_status in ('na', 'pending', 'partial', 'received')),
  invoice_sent boolean not null default false,
  barter_details text not null default '',
  barter_value numeric(12, 2) not null default 0,
  contact_name text not null default '',
  contact_phone text not null default '',
  post_url text not null default '',
  views int,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Featured reels (public) ----------
create table if not exists public.reels (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  category text not null check (category in ('cafe', 'brand', 'modelling', 'ugc')),
  partner text not null,
  note text not null default '',
  thumb_url text not null default '',
  featured boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- Media kit (one snapshot per month, newest is shown) ----------
create table if not exists public.mediakit_snapshots (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- ---------- Profile / About content (single row) ----------
create table if not exists public.site_profile (
  id int primary key default 1 check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Row level security ----------
alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.project_private enable row level security;
alter table public.collabs enable row level security;
alter table public.deals enable row level security;
alter table public.reels enable row level security;
alter table public.mediakit_snapshots enable row level security;
alter table public.site_profile enable row level security;

drop policy if exists "own admin row" on public.admins;
create policy "own admin row" on public.admins for select to authenticated using (user_id = auth.uid());

-- public reads only what is published; admin reads/writes everything
drop policy if exists "read published projects" on public.projects;
create policy "read published projects" on public.projects for select using (published or public.is_admin());
drop policy if exists "admin writes projects" on public.projects;
create policy "admin writes projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin only project_private" on public.project_private;
create policy "admin only project_private" on public.project_private for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read visible collabs" on public.collabs;
create policy "read visible collabs" on public.collabs for select using (show_on_site or public.is_admin());
drop policy if exists "admin writes collabs" on public.collabs;
create policy "admin writes collabs" on public.collabs for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admin only deals" on public.deals;
create policy "admin only deals" on public.deals for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read featured reels" on public.reels;
create policy "read featured reels" on public.reels for select using (featured or public.is_admin());
drop policy if exists "admin writes reels" on public.reels;
create policy "admin writes reels" on public.reels for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read mediakit" on public.mediakit_snapshots;
create policy "read mediakit" on public.mediakit_snapshots for select using (true);
drop policy if exists "admin writes mediakit" on public.mediakit_snapshots;
create policy "admin writes mediakit" on public.mediakit_snapshots for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "read profile" on public.site_profile;
create policy "read profile" on public.site_profile for select using (true);
drop policy if exists "admin writes profile" on public.site_profile;
create policy "admin writes profile" on public.site_profile for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- table privileges (RLS above still decides which rows)
grant usage on schema public to anon, authenticated;
grant select on public.projects, public.collabs, public.reels, public.mediakit_snapshots, public.site_profile to anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on public.project_private, public.deals from anon;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------- File storage for uploads (images, resume) ----------
insert into storage.buckets (id, name, public)
values ('site', 'site', true)
on conflict (id) do nothing;

drop policy if exists "admin uploads" on storage.objects;
create policy "admin uploads" on storage.objects for insert to authenticated with check (bucket_id = 'site' and public.is_admin());
drop policy if exists "admin updates uploads" on storage.objects;
create policy "admin updates uploads" on storage.objects for update to authenticated using (bucket_id = 'site' and public.is_admin());
drop policy if exists "admin deletes uploads" on storage.objects;
create policy "admin deletes uploads" on storage.objects for delete to authenticated using (bucket_id = 'site' and public.is_admin());
