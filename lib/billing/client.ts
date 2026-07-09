/**
 * Server-side client for VoltFlow (billing microservice).
 * Never import this from a client component — it uses the service key.
 */

export type BillingLine = {
  id: string;
  org_id: string;
  flex_slot_id: string | null;
  amount_cents: number;
  kwh: number | null;
  duration_hours: number | null;
  unit_price_cents: number | null;
  pricing_source: string | null;
  carbon_gco2_kwh: number | null;
  hp_hc_band: string | null;
  created_at: string;
};

export type UsageSummary = {
  org_id: string;
  month: string;
  period_start: string | null;
  period_end: string | null;
  line_count: number;
  total_cents: number;
  total_kwh: number;
};

export type SubscriptionStatus = {
  org_id: string;
  plan: "free" | "pro";
  status: string;
  current_period_end?: string | null;
};

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function voltflowConfig() {
  const apiUrl = process.env.VOLTFLOW_API_URL;
  const serviceKey = process.env.VOLTFLOW_SERVICE_KEY;
  if (!apiUrl || !serviceKey) {
    throw new Error("VOLTFLOW_API_URL et VOLTFLOW_SERVICE_KEY requis.");
  }
  return { apiUrl, serviceKey };
}

async function voltflowFetch(path: string, init?: RequestInit): Promise<Response> {
  const { apiUrl, serviceKey } = voltflowConfig();
  return fetch(`${apiUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-VoltFlow-Service-Key": serviceKey,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}

export async function getSubscriptionStatus(orgId: string): Promise<SubscriptionStatus> {
  const res = await voltflowFetch(`/api/v1/subscriptions/${orgId}`);
  if (!res.ok) {
    throw new Error(`VoltFlow: statut abonnement indisponible (${res.status}).`);
  }
  return res.json();
}

/** Best-effort plan check — never throws, defaults to `false` on error. */
export async function isOrgPro(orgId: string): Promise<boolean> {
  try {
    const sub = await getSubscriptionStatus(orgId);
    return sub.plan === "pro" && ACTIVE_STATUSES.has(sub.status);
  } catch {
    return false;
  }
}

export async function createCheckoutSession(
  orgId: string,
  email?: string,
): Promise<string> {
  const res = await voltflowFetch("/checkout/session", {
    method: "POST",
    body: JSON.stringify({ org_id: orgId, email }),
  });
  if (!res.ok) {
    throw new Error(`VoltFlow: création de la session Checkout impossible (${res.status}).`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

export async function createBillingPortalSession(orgId: string): Promise<string> {
  const res = await voltflowFetch("/billing/portal", {
    method: "POST",
    body: JSON.stringify({ org_id: orgId }),
  });
  if (!res.ok) {
    throw new Error(`VoltFlow: ouverture du portail de facturation impossible (${res.status}).`);
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

/** Best-effort usage recording — never throws, must not block flex_slot creation. */
export async function recordUsage(orgId: string, flexSlotId: string): Promise<void> {
  try {
    await voltflowFetch("/usage/record", {
      method: "POST",
      body: JSON.stringify({ org_id: orgId, flex_slot_id: flexSlotId }),
    });
  } catch {
    // Silently ignored: billing must never break the core flex_slot flow.
  }
}

export async function getBillingLines(
  orgId: string,
  options?: { month?: string; limit?: number },
): Promise<BillingLine[]> {
  const params = new URLSearchParams();
  if (options?.month) params.set("month", options.month);
  if (options?.limit) params.set("limit", String(options.limit));
  const query = params.toString();
  const res = await voltflowFetch(
    `/api/v1/billing-lines/${orgId}${query ? `?${query}` : ""}`,
  );
  if (!res.ok) {
    throw new Error(`VoltFlow: lignes de facturation indisponibles (${res.status}).`);
  }
  const data = (await res.json()) as { lines: BillingLine[] };
  return data.lines ?? [];
}

export async function getUsageSummary(
  orgId: string,
  month?: string,
): Promise<UsageSummary> {
  const query = month ? `?month=${encodeURIComponent(month)}` : "";
  const res = await voltflowFetch(`/api/v1/usage/${orgId}${query}`);
  if (!res.ok) {
    throw new Error(`VoltFlow: résumé usage indisponible (${res.status}).`);
  }
  return res.json();
}
