"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";

export async function acknowledgeAlert(alertId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    await requireAdmin();
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Non autorisé" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("meridian_alerts")
    .update({
      status: "acknowledged",
      acknowledged_at: new Date().toISOString(),
    })
    .eq("id", alertId)
    .eq("status", "open");

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/alerts");
  return { ok: true };
}
