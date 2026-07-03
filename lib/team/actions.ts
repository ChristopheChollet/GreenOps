"use server";

import { createClient } from "@/lib/supabase/server";
import { getSessionOrgId } from "@/lib/auth/org";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createOrgInvitation(formData: FormData) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "viewer");

  if (!EMAIL_RE.test(email)) {
    redirect("/team?error=invite-invalid");
  }

  const supabase = await createClient();

  const { data: alreadyMember } = await supabase.rpc("email_already_in_org", {
    check_email: email,
    check_org: orgId,
  });

  if (alreadyMember) {
    redirect("/team?error=invite-member");
  }

  const { error } = await supabase.from("org_invitations").insert({
    org_id: orgId,
    email,
    role: role === "admin" ? "admin" : "viewer",
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/team?error=invite-pending");
    }
    redirect("/team?error=invite-save");
  }

  revalidatePath("/team");
  redirect("/team?toast=invite-created");
}

export async function cancelOrgInvitation(id: string) {
  await requireAdmin();
  const orgId = await getSessionOrgId();
  if (!orgId) throw new Error("Non authentifié");

  const supabase = await createClient();
  const { error } = await supabase
    .from("org_invitations")
    .delete()
    .eq("id", id)
    .eq("org_id", orgId)
    .is("accepted_at", null);

  if (error) redirect("/team?error=invite-save");

  revalidatePath("/team");
  redirect("/team?toast=invite-cancelled");
}
