-- Meridian Alerts — vue ops consolidée (GridPulse + FlexSlot)
-- Exécuter sur le même projet Supabase que GreenOps (après 004).

create table if not exists public.meridian_alerts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  source text not null check (source in ('gridpulse', 'flexslot')),
  event_type text not null,
  title text not null,
  message text,
  payload jsonb not null default '{}'::jsonb,

  zone text,
  carbon_gco2_kwh numeric,
  threshold_gco2_kwh numeric,
  recommendation_action text,
  window_start timestamptz,
  window_end timestamptz,

  snapshot_id uuid references public.flexslot_recommendation_snapshots (id) on delete set null,
  greenops_slot_id uuid references public.flex_slots (id) on delete set null,

  status text not null default 'open' check (status in ('open', 'acknowledged')),
  acknowledged_at timestamptz,
  acknowledged_by uuid references auth.users (id) on delete set null,

  org_id uuid references public.organizations (id) on delete cascade
);

create index if not exists meridian_alerts_created_at_idx
  on public.meridian_alerts (created_at desc);

create index if not exists meridian_alerts_status_idx
  on public.meridian_alerts (status, created_at desc);

alter table public.meridian_alerts enable row level security;

-- Lecture : alertes de l'org ou alertes écosystème (org_id null)
drop policy if exists meridian_alerts_select on public.meridian_alerts;
create policy meridian_alerts_select
  on public.meridian_alerts for select
  using (
    org_id is null
    or org_id in (select public.user_org_ids())
  );

-- Ack : admins uniquement
drop policy if exists meridian_alerts_ack on public.meridian_alerts;
create policy meridian_alerts_ack
  on public.meridian_alerts for update
  using (
    (org_id is null or org_id in (select public.user_org_ids()))
    and public.user_is_admin()
  )
  with check (
    (org_id is null or org_id in (select public.user_org_ids()))
    and public.user_is_admin()
  );

comment on table public.meridian_alerts is
  'Meridian Alerts — événements consolidés GridPulse (carbone) et FlexSlot (reco).';

-- Données démo pour portfolio / captures (ignorées si déjà présentes)
insert into public.meridian_alerts (
  source, event_type, title, message, payload,
  zone, carbon_gco2_kwh, threshold_gco2_kwh,
  recommendation_action, window_start, window_end, status
)
select * from (values
  (
    'gridpulse'::text,
    'carbon_threshold_exceeded'::text,
    'Seuil carbone dépassé — 218 gCO₂/kWh'::text,
    'GridPulse · zone FR — franchissement du seuil 200 gCO₂/kWh.'::text,
    '{"event":"carbon_threshold_exceeded","zone":"FR","carbon_gco2_kwh":218,"threshold_gco2_kwh":200,"service":"gridpulse"}'::jsonb,
    'FR'::text,
    218::numeric,
    200::numeric,
    null::text,
    null::timestamptz,
    null::timestamptz,
    'open'::text
  ),
  (
    'flexslot'::text,
    'flexslot_recommendation_alert'::text,
    'Recommandation Décaler — score 34'::text,
    'FlexSlot · action ops sur fenêtre GridPulse (carbone élevé).'::text,
    '{"event":"flexslot_recommendation_alert","source":"flexslot","action":"defer","label":"Décaler","score":34}'::jsonb,
    null::text,
    224::numeric,
    200::numeric,
    'defer'::text,
    (now() - interval '2 hours')::timestamptz,
    (now() + interval '4 hours')::timestamptz,
    'open'::text
  ),
  (
    'flexslot'::text,
    'flexslot_recommendation_alert'::text,
    'Carbone élevé — 205 gCO₂/kWh'::text,
    'FlexSlot · alerte carbone sur fenêtre recommandée.'::text,
    '{"event":"flexslot_recommendation_alert","source":"flexslot","action":"flex","label":"Flex","score":58}'::jsonb,
    null::text,
    205::numeric,
    200::numeric,
    'flex'::text,
    (now() - interval '26 hours')::timestamptz,
    (now() - interval '20 hours')::timestamptz,
    'acknowledged'::text
  )
) as seed (
  source, event_type, title, message, payload,
  zone, carbon_gco2_kwh, threshold_gco2_kwh,
  recommendation_action, window_start, window_end, status
)
where not exists (select 1 from public.meridian_alerts limit 1);
