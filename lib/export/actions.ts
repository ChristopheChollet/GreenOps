"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { rowsToCsv } from "@/lib/csv";
import { buildDashboardPdf } from "@/lib/export/buildDashboardPdf";
import type { DashboardReportData } from "@/lib/export/dashboardReport";
import { isOrgPro } from "@/lib/billing/client";

/** Free plan: PDF export capped at N most recent rows per section — Pro is unlimited. */
const FREE_PLAN_PDF_ROW_LIMIT = 10;

const FLEX_COLS = [
  { key: "id", header: "id" },
  { key: "kind", header: "kind" },
  { key: "status", header: "status" },
  { key: "start_at", header: "start_at" },
  { key: "end_at", header: "end_at" },
  { key: "power_kw", header: "power_kw" },
  { key: "notes", header: "notes" },
  { key: "created_at", header: "created_at" },
  { key: "updated_at", header: "updated_at" },
  { key: "created_by", header: "created_by" },
  { key: "updated_by", header: "updated_by" },
] as const;

const REC_COLS = [
  { key: "id", header: "id" },
  { key: "label", header: "label" },
  { key: "period_start", header: "period_start" },
  { key: "period_end", header: "period_end" },
  { key: "source", header: "source" },
  { key: "quantity_mwh", header: "quantity_mwh" },
  { key: "document_url", header: "document_url" },
  { key: "notes", header: "notes" },
  { key: "created_at", header: "created_at" },
  { key: "updated_at", header: "updated_at" },
  { key: "created_by", header: "created_by" },
  { key: "updated_by", header: "updated_by" },
] as const;

export async function exportFlexSlotsCsv(): Promise<string> {
  const session = await getSessionOrg();
  if (!session) throw new Error("Non authentifié");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flex_slots")
    .select("*")
    .eq("org_id", session.orgId)
    .order("start_at", { ascending: false });

  if (error) throw new Error(error.message);
  return rowsToCsv((data ?? []) as Record<string, unknown>[], [...FLEX_COLS]);
}

export async function exportRecCertificatesCsv(): Promise<string> {
  const session = await getSessionOrg();
  if (!session) throw new Error("Non authentifié");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rec_certificates")
    .select("*")
    .eq("org_id", session.orgId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return rowsToCsv((data ?? []) as Record<string, unknown>[], [...REC_COLS]);
}

async function fetchDashboardReportData(
  orgId: string,
  isPro: boolean,
): Promise<DashboardReportData> {
  const supabase = await createClient();

  const [
    { data: org },
    { count: flexTotal },
    { count: flexOpen },
    { count: recTotal },
    { data: flexRows },
    { data: recRows },
  ] = await Promise.all([
    supabase.from("organizations").select("name").eq("id", orgId).single(),
    supabase
      .from("flex_slots")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase
      .from("flex_slots")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "open"),
    supabase
      .from("rec_certificates")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase
      .from("flex_slots")
      .select("kind, status, start_at, end_at, power_kw")
      .eq("org_id", orgId)
      .order("start_at", { ascending: false })
      .limit(50),
    supabase
      .from("rec_certificates")
      .select("label, period_start, period_end, source, quantity_mwh")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const recList = recRows ?? [];
  const totalMwh = recList.reduce(
    (sum, r) => sum + (Number(r.quantity_mwh) || 0),
    0,
  );

  const allFlexRows = flexRows ?? [];
  const allRecRows = recList;
  const truncated =
    !isPro &&
    (allFlexRows.length > FREE_PLAN_PDF_ROW_LIMIT || allRecRows.length > FREE_PLAN_PDF_ROW_LIMIT);

  return {
    orgName: (org?.name as string | undefined) ?? "Organisation",
    generatedAt: new Date(),
    planNote: truncated
      ? `Plan Free — export limité aux ${FREE_PLAN_PDF_ROW_LIMIT} dernières entrées par section. Passez au plan Pro pour l'export complet.`
      : undefined,
    flexTotal: flexTotal ?? 0,
    flexOpen: flexOpen ?? 0,
    recTotal: recTotal ?? 0,
    totalMwh,
    flexRows: isPro ? allFlexRows : allFlexRows.slice(0, FREE_PLAN_PDF_ROW_LIMIT),
    recRows: isPro ? allRecRows : allRecRows.slice(0, FREE_PLAN_PDF_ROW_LIMIT),
  };
}

/** Base64-encoded PDF bytes for client download. */
export async function exportDashboardPdf(): Promise<string> {
  const session = await getSessionOrg();
  if (!session) throw new Error("Non authentifié");

  const isPro = await isOrgPro(session.orgId);
  const data = await fetchDashboardReportData(session.orgId, isPro);
  const bytes = await buildDashboardPdf(data);
  return Buffer.from(bytes).toString("base64");
}
