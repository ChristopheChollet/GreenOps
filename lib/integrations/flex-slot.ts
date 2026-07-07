import { flexSlotTimeErrorKey } from "@/lib/flex/validate";

export type IntegrationAction = "consume" | "flex" | "defer";
export type IntegrationKind = "offer" | "need";

export type FlexSlotIntegrationInput = {
  org_id: string;
  kind: IntegrationKind;
  start_at: string;
  end_at: string;
  power_kw: number | null;
  notes: string | null;
  recommendation: {
    source: "flexslot";
    action: IntegrationAction;
    gridpulse_score: number;
    window_start: string;
    window_end: string;
    avg_carbon_gco2_kwh: number;
  };
};

type ParseResult =
  | { ok: true; data: FlexSlotIntegrationInput }
  | { ok: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readOptionalNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export function parseFlexSlotIntegrationRequest(body: unknown): ParseResult {
  if (!isRecord(body)) {
    return { ok: false, error: "Corps JSON invalide." };
  }

  const orgId = readString(body.org_id);
  const kind = readString(body.kind);
  const startAt = readString(body.start_at);
  const endAt = readString(body.end_at);

  if (!orgId) return { ok: false, error: "org_id requis." };
  if (kind !== "offer" && kind !== "need") {
    return { ok: false, error: "kind doit être offer ou need." };
  }
  if (!startAt || !endAt) {
    return { ok: false, error: "start_at et end_at requis." };
  }

  const timeError = flexSlotTimeErrorKey(startAt, endAt);
  if (timeError === "flex-invalid-dates") {
    return { ok: false, error: "Dates invalides." };
  }
  if (timeError === "flex-time-order") {
    return { ok: false, error: "end_at doit être après start_at." };
  }

  const recommendation = body.recommendation;
  if (!isRecord(recommendation)) {
    return { ok: false, error: "recommendation requise." };
  }

  const action = readString(recommendation.action);
  if (action !== "consume" && action !== "flex" && action !== "defer") {
    return { ok: false, error: "recommendation.action invalide." };
  }

  const score = readOptionalNumber(recommendation.gridpulse_score);
  const avgCarbon = readOptionalNumber(recommendation.avg_carbon_gco2_kwh);
  const windowStart = readString(recommendation.window_start);
  const windowEnd = readString(recommendation.window_end);

  if (score === null || avgCarbon === null || !windowStart || !windowEnd) {
    return {
      ok: false,
      error: "recommendation.gridpulse_score, window_start, window_end et avg_carbon_gco2_kwh requis.",
    };
  }

  const source = readString(recommendation.source);
  if (source !== "flexslot") {
    return { ok: false, error: "recommendation.source doit être flexslot." };
  }

  const notes = readString(body.notes);
  const powerKw = readOptionalNumber(body.power_kw);

  return {
    ok: true,
    data: {
      org_id: orgId,
      kind,
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      power_kw: powerKw,
      notes,
      recommendation: {
        source: "flexslot",
        action,
        gridpulse_score: score,
        window_start: new Date(windowStart).toISOString(),
        window_end: new Date(windowEnd).toISOString(),
        avg_carbon_gco2_kwh: avgCarbon,
      },
    },
  };
}

export function assertIntegrationOrgAllowed(orgId: string): string | null {
  const allowed = process.env.GREENOPS_INTEGRATION_DEMO_ORG_ID?.trim();
  if (allowed && orgId !== allowed) {
    return "org_id non autorisé pour l'intégration démo.";
  }
  return null;
}

export function buildGreenOpsFlexUrl(slotId?: string): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const base = `${site.replace(/\/$/, "")}/flex`;
  return slotId ? `${base}#slot-${slotId}` : base;
}
