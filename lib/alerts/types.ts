export type AlertSource = "gridpulse" | "flexslot";
export type AlertStatus = "open" | "acknowledged";

export type MeridianAlert = {
  id: string;
  created_at: string;
  source: AlertSource;
  event_type: string;
  title: string;
  message: string | null;
  zone: string | null;
  carbon_gco2_kwh: number | null;
  threshold_gco2_kwh: number | null;
  recommendation_action: string | null;
  window_start: string | null;
  window_end: string | null;
  snapshot_id: string | null;
  greenops_slot_id: string | null;
  status: AlertStatus;
  acknowledged_at: string | null;
};
