-- V2 : invitations multi-utilisateurs par organisation
-- Exécuter après 002_audit_roles.sql

create table public.org_invitations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null default 'viewer' check (role in ('admin', 'viewer')),
  invited_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create unique index org_invitations_pending_unique
  on public.org_invitations (org_id, lower(email))
  where accepted_at is null;

create index org_invitations_org_id_idx on public.org_invitations (org_id);

-- Membres visibles au sein de la même organisation
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_org
  on public.profiles for select
  using (org_id in (select public.user_org_ids()));

-- Emails des membres (RPC — auth.users non exposé en RLS client)
create or replace function public.list_org_members()
returns table (
  user_id uuid,
  role text,
  email text,
  member_since timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select p.user_id, p.role, u.email::text, p.created_at
  from public.profiles p
  join auth.users u on u.id = p.user_id
  where p.org_id in (select public.user_org_ids())
  order by p.created_at asc;
$$;

revoke all on function public.list_org_members() from public;
grant execute on function public.list_org_members() to authenticated;

create or replace function public.email_already_in_org(check_email text, check_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    join auth.users u on u.id = p.user_id
    where p.org_id = check_org
      and lower(u.email) = lower(trim(check_email))
  );
$$;

revoke all on function public.email_already_in_org(text, uuid) from public;
grant execute on function public.email_already_in_org(text, uuid) to authenticated;

-- Inscription : rejoindre une org invitée au lieu de créer une nouvelle
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  invite record;
begin
  select i.id, i.org_id, i.role
  into invite
  from public.org_invitations i
  where lower(i.email) = lower(new.email)
    and i.accepted_at is null
  order by i.created_at desc
  limit 1;

  if invite is not null then
    insert into public.profiles (user_id, org_id, role)
    values (new.id, invite.org_id, invite.role);

    update public.org_invitations
    set accepted_at = now()
    where id = invite.id;

    return new;
  end if;

  insert into public.organizations (name)
  values (coalesce(new.raw_user_meta_data ->> 'full_name', 'My organization'))
  returning id into new_org_id;

  insert into public.profiles (user_id, org_id, role)
  values (new.id, new_org_id, 'admin');

  return new;
end;
$$;

alter table public.org_invitations enable row level security;

create policy org_invitations_select
  on public.org_invitations for select
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy org_invitations_insert
  on public.org_invitations for insert
  with check (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );

create policy org_invitations_delete
  on public.org_invitations for delete
  using (
    org_id in (select public.user_org_ids())
    and public.user_is_admin()
  );
