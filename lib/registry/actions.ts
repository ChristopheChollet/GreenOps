"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionOrgId } from "@/lib/auth/org";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createRecCertificate(formData: FormData) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const label = String(formData.get("label") ?? "").trim();
  const periodStart = String(formData.get("period_start"));
  const periodEnd = String(formData.get("period_end"));
  const source = formData.get("source");
  const quantityMwh = formData.get("quantity_mwh");
  const documentUrl = formData.get("document_url");
  const notes = formData.get("notes");

  if (!label || !periodStart || !periodEnd) {
    redirect("/registry?error=rec-save");
  }

  if (periodEnd < periodStart) {
    redirect("/registry?error=rec-period-order");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rec_certificates").insert({
    org_id: orgId,
    label,
    period_start: periodStart,
    period_end: periodEnd,
    source: source ? String(source) : null,
    quantity_mwh: quantityMwh ? Number(quantityMwh) : null,
    document_url: documentUrl ? String(documentUrl) : null,
    notes: notes ? String(notes) : null,
  });

  if (error) {
    if (error.message.includes("rec_period_order")) {
      redirect("/registry?error=rec-period-order");
    }
    redirect("/registry?error=rec-save");
  }
  revalidatePath("/registry");
  revalidatePath("/dashboard");
  redirect("/registry?toast=rec-created");
}

export async function deleteRecCertificate(id: string) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const supabase = await createClient();
  const { error } = await supabase
    .from("rec_certificates")
    .delete()
    .eq("id", id)
    .eq("org_id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/registry");
  revalidatePath("/dashboard");
  redirect("/registry?toast=rec-deleted");
}
