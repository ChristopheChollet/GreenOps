-- FlexSlot integration — traçabilité GridPulse → GreenOps
-- Exécuter après 001, 002 (et 003 si invitations)

alter table public.flex_slots
  add column if not exists source text not null default 'manual',
  add column if not exists recommendation_action text,
  add column if not exists gridpulse_score numeric,
  add column if not exists gridpulse_window_start timestamptz,
  add column if not exists gridpulse_window_end timestamptz,
  add column if not exists gridpulse_avg_carbon numeric;

alter table public.flex_slots drop constraint if exists flex_slots_source_check;
alter table public.flex_slots
  add constraint flex_slots_source_check
  check (source in ('manual', 'flexslot'));

alter table public.flex_slots drop constraint if exists flex_slots_recommendation_action_check;
alter table public.flex_slots
  add constraint flex_slots_recommendation_action_check
  check (
    recommendation_action is null
    or recommendation_action in ('consume', 'flex', 'defer')
  );

comment on column public.flex_slots.source is 'manual | flexslot — origine du créneau';
comment on column public.flex_slots.recommendation_action is 'Action FlexSlot : consume | flex | defer';
