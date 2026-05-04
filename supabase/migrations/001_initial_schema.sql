-- GreenOps MVP — run in Supabase SQL Editor or via CLI migrate
-- Creates org + profile per new auth user, flex slots, REC rows, RLS

create extension if not exists "pgcrypto";

-- Organizations (one created per user at signup via trigger)
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My organization',
  created_at timestamptz not null default now()
);

-- Link auth.users -> org
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete restrict,
  created_at timestamptz not null default now()
);

create index profiles_org_id_idx on public.profiles (org_id);

-- Flex market (Web2 mirror of GridFlex-style slots)
create table public.flex_slots (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  kind text not null check (kind in ('offer', 'need')),
  status text not null default 'draft' check (status in ('draft', 'open', 'matched')),
  start_at timestamptz not null,
  end_at timestamptz not null,
  power_kw numeric,
  notes text,
  created_at timestamptz not null default now(),
  constraint flex_time_order check (end_at > start_at)
);

create index flex_slots_org_id_idx on public.flex_slots (org_id);

-- REC-style certificates (pedagogical / non-regulatory)
create table public.rec_certificates (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  label text not null,
  period_start date not null,
  period_end date not null,
  source text,
  quantity_mwh numeric,
  document_url text,
  notes text,
  created_at timestamptz not null default now(),
  constraint rec_period_order check (period_end >= period_start)
);

create index rec_certificates_org_id_idx on public.rec_certificates (org_id);

-- New user: one organization + profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
begin
  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data ->> 'full_name', 'My organization'))
  returning id into new_org_id;

  insert into public.profiles (user_id, org_id)
  values (new.id, new_org_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.flex_slots enable row level security;
alter table public.rec_certificates enable row level security;

-- Helper: orgs visible to the signed-in user
create or replace function public.user_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id from public.profiles where user_id = auth.uid();
$$;

-- Organizations: read own org only
create policy organizations_select_own
  on public.organizations for select
  using (id in (select public.user_org_ids()));

create policy organizations_update_own
  on public.organizations for update
  using (id in (select public.user_org_ids()));

-- Profiles: own row
create policy profiles_select_own
  on public.profiles for select
  using (user_id = auth.uid());

-- Flex / REC: CRUD within org
create policy flex_select
  on public.flex_slots for select
  using (org_id in (select public.user_org_ids()));

create policy flex_insert
  on public.flex_slots for insert
  with check (org_id in (select public.user_org_ids()));

create policy flex_update
  on public.flex_slots for update
  using (org_id in (select public.user_org_ids()));

create policy flex_delete
  on public.flex_slots for delete
  using (org_id in (select public.user_org_ids()));

create policy rec_select
  on public.rec_certificates for select
  using (org_id in (select public.user_org_ids()));

create policy rec_insert
  on public.rec_certificates for insert
  with check (org_id in (select public.user_org_ids()));

create policy rec_update
  on public.rec_certificates for update
  using (org_id in (select public.user_org_ids()));

create policy rec_delete
  on public.rec_certificates for delete
  using (org_id in (select public.user_org_ids()));
