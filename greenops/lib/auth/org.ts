import { createClient } from "@/lib/supabase/server";

export async function getSessionOrgId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) return null;
  return profile.org_id as string;
}
