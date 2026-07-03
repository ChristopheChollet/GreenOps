"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionOrgId } from "@/lib/auth/org";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { flexSlotTimeErrorKey } from "@/lib/flex/validate";

export async function createFlexSlot(formData: FormData) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const kind = String(formData.get("kind") ?? "offer");
  const status = String(formData.get("status") ?? "draft");
  const startAt = String(formData.get("start_at"));
  const endAt = String(formData.get("end_at"));
  const powerKw = formData.get("power_kw");
  const notes = formData.get("notes");

  if (!startAt || !endAt) {
    redirect("/flex?error=flex-invalid-dates");
  }

  const timeError = flexSlotTimeErrorKey(startAt, endAt);
  if (timeError) {
    redirect(`/flex?error=${timeError}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("flex_slots").insert({
    org_id: orgId,
    kind: kind === "need" ? "need" : "offer",
    status: ["draft", "open", "matched"].includes(status) ? status : "draft",
    start_at: new Date(startAt).toISOString(),
    end_at: new Date(endAt).toISOString(),
    power_kw: powerKw ? Number(powerKw) : null,
    notes: notes ? String(notes) : null,
  });

  if (error) {
    if (error.message.includes("flex_time_order")) {
      redirect("/flex?error=flex-time-order");
    }
    redirect("/flex?error=flex-save");
  }
  revalidatePath("/flex");
  revalidatePath("/dashboard");
  redirect("/flex?toast=flex-created");
}

export async function updateFlexSlot(id: string, formData: FormData) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const kind = String(formData.get("kind") ?? "offer");
  const status = String(formData.get("status") ?? "draft");
  const startAt = String(formData.get("start_at"));
  const endAt = String(formData.get("end_at"));
  const powerKw = formData.get("power_kw");
  const notes = formData.get("notes");

  if (!startAt || !endAt) {
    redirect("/flex?error=flex-invalid-dates");
  }

  const timeError = flexSlotTimeErrorKey(startAt, endAt);
  if (timeError) {
    redirect(`/flex?error=${timeError}`);
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("flex_slots")
    .update({
      kind: kind === "need" ? "need" : "offer",
      status: ["draft", "open", "matched"].includes(status) ? status : "draft",
      start_at: new Date(startAt).toISOString(),
      end_at: new Date(endAt).toISOString(),
      power_kw: powerKw ? Number(powerKw) : null,
      notes: notes ? String(notes) : null,
    })
    .eq("id", id)
    .eq("org_id", orgId);

  if (error) {
    if (error.message.includes("flex_time_order")) {
      redirect("/flex?error=flex-time-order");
    }
    redirect("/flex?error=flex-save");
  }
  revalidatePath("/flex");
  revalidatePath("/dashboard");
  redirect("/flex?toast=flex-updated");
}

export async function deleteFlexSlot(id: string) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const supabase = await createClient();
  const { error } = await supabase
    .from("flex_slots")
    .delete()
    .eq("id", id)
    .eq("org_id", orgId);

  if (error) throw new Error(error.message);
  revalidatePath("/flex");
  revalidatePath("/dashboard");
  redirect("/flex?toast=flex-deleted");
}
