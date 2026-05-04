-- Audit trail (created_by / updated_at / updated_by) + rôles admin / viewer
-- Exécuter dans le SQL Editor après 001_initial_schema.sql

-- Rôle par profil : admin = CRUD ; viewer = lecture seule (RLS)
alter table public.profiles
  add column if not exists role text not null default 'admin'
    check (role in ('admin', 'viewer'));

create or replace function public.user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.user_id = auth.uid()),
    false
  );
$$;

-- Colonnes d’audit
alter table public.flex_slots add column if not exists created_by uuid references auth.users (id) on delete set null;
alter table public.flex_slots add column if not exists updated_at timestamptz not null default now();
alter table public.flex_slots add column if not exists updated_by uuid references auth.users (id) on delete set null;
alter table public.flex_slots alter column created_by set default auth.uid();

alter table public.rec_certificates add column if not exists created_by uuid references auth.users (id) on delete set null;
alter table public.rec_certificates add column if not exists updated_at timestamptz not null default now();
alter table public.rec_certificates add column if not exists updated_by uuid references auth.users (id) on delete set null;
alter table public.rec_certificates alter column created_by set default auth.uid();

create or replace function public.touch_updated_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;

drop trigger if exists flex_slots_touch_updated on public.flex_slots;
create trigger flex_slots_touch_updated
  before update on public.flex_slots
  for each row execute function public.touch_updated_audit();

drop trigger if exists rec_certificates_touch_updated on public.rec_certificates;
create trigger rec_certificates_touch_updated
  before update on public.rec_certificates
  for each row execute function public.touch_updated_audit();

-- RLS : mutations réservées aux admins
drop policy if exists organizations_update_own on public.organizations;
create policy organizations_update_own
  on public.organizations for update
  using (
    id in (select public.user_org_ids())
    and public.user_is_admin()
  );

drop policy if exists flex_insert on public.flex_slots;
drop policy if exists flex_update on public.flex_slots;
drop policy if exists flex_delete on public.flex_slots;

create policy flex_insert
  on public.flex_slots for insert
  with check (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy flex_update
  on public.flex_slots for update
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy flex_delete
  on public.flex_slots for delete
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

drop policy if exists rec_insert on public.rec_certificates;
drop policy if exists rec_update on public.rec_certificates;
drop policy if exists rec_delete on public.rec_certificates;

create policy rec_insert
  on public.rec_certificates for insert
  with check (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy rec_update
  on public.rec_certificates for update
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy rec_delete
  on public.rec_certificates for delete
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );
