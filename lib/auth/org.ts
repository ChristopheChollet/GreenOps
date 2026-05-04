import { createClient } from "@/lib/supabase/server";

export type OrgRole = "admin" | "viewer";

export type SessionOrg = { orgId: string; role: OrgRole };

export async function getSessionOrg(): Promise<SessionOrg | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id, role")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    const { data: legacy, error: legacyErr } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("user_id", user.id)
      .single();
    if (legacyErr || !legacy) return null;
    return { orgId: legacy.org_id as string, role: "admin" as const };
  }

  const role = (profile.role as OrgRole | null) ?? "admin";
  return { orgId: profile.org_id as string, role };
}

export async function getSessionOrgId(): Promise<string | null> {
  const s = await getSessionOrg();
  return s?.orgId ?? null;
}

export async function getSessionRole(): Promise<OrgRole | null> {
  const s = await getSessionOrg();
  return s?.role ?? null;
}
