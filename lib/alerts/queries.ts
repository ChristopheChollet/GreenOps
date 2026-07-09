import { createClient } from "@/lib/supabase/server";
import type { MeridianAlert } from "@/lib/alerts/types";

export async function listMeridianAlerts(limit = 50): Promise<MeridianAlert[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("meridian_alerts")
    .select(
      "id, created_at, source, event_type, title, message, zone, carbon_gco2_kwh, threshold_gco2_kwh, recommendation_action, window_start, window_end, snapshot_id, greenops_slot_id, status, acknowledged_at",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[alerts] list failed:", error.message);
    return [];
  }

  return (data ?? []) as MeridianAlert[];
}
