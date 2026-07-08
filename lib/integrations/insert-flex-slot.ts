import { createServiceClient } from "@/lib/supabase/service";
import {
  assertIntegrationOrgAllowed,
  buildGreenOpsFlexUrl,
  type FlexSlotIntegrationInput,
} from "@/lib/integrations/flex-slot";
import { recordUsage } from "@/lib/billing/client";

export async function insertFlexSlotFromIntegration(
  input: FlexSlotIntegrationInput,
): Promise<{
  id: string;
  greenops_url: string;
  source: string;
  recommendation_action: string;
  notes: string | null;
}> {
  const orgError = assertIntegrationOrgAllowed(input.org_id);
  if (orgError) {
    throw new IntegrationError(orgError, 403);
  }

  const supabase = createServiceClient();

  const { data: org, error: orgLookupError } = await supabase
    .from("organizations")
    .select("id")
    .eq("id", input.org_id)
    .maybeSingle();

  if (orgLookupError) {
    throw new IntegrationError(orgLookupError.message, 500);
  }
  if (!org) {
    throw new IntegrationError("Organisation introuvable.", 404);
  }

  const { data, error } = await supabase
    .from("flex_slots")
    .insert({
      org_id: input.org_id,
      kind: input.kind,
      status: "open",
      start_at: input.start_at,
      end_at: input.end_at,
      power_kw: input.power_kw,
      notes: input.notes,
      source: "flexslot",
      recommendation_action: input.recommendation.action,
      gridpulse_score: input.recommendation.gridpulse_score,
      gridpulse_window_start: input.recommendation.window_start,
      gridpulse_window_end: input.recommendation.window_end,
      gridpulse_avg_carbon: input.recommendation.avg_carbon_gco2_kwh,
    })
    .select("id, source, recommendation_action, notes")
    .single();

  if (error) {
    throw new IntegrationError(error.message, 500);
  }

  if (data.source !== "flexslot") {
    throw new IntegrationError(
      "Insert FlexSlot incomplet (source != flexslot). Vérifier migration 004.",
      500,
    );
  }

  // Best-effort: VoltFlow decides internally whether the org is billable (Pro plan).
  await recordUsage(input.org_id, data.id);

  return {
    id: data.id,
    greenops_url: buildGreenOpsFlexUrl(data.id),
    source: data.source,
    recommendation_action: data.recommendation_action ?? "",
    notes: data.notes,
  };
}

export class IntegrationError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
