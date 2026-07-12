import { createClient } from "@/lib/supabase/server";

export type OnboardingStatus = {
  orgNamed: boolean;
  inviteSent: boolean;
  hasFlexSlot: boolean;
  complete: boolean;
  orgName: string;
};

const DEFAULT_ORG_NAME = "My organization";

export function deriveOnboardingStatus(input: {
  orgName: string;
  inviteCount: number;
  memberCount: number;
  flexSlotCount: number;
}): OnboardingStatus {
  const orgNamed =
    input.orgName.trim() !== "" && input.orgName !== DEFAULT_ORG_NAME;
  const inviteSent = input.inviteCount > 0 || input.memberCount > 1;
  const hasFlexSlot = input.flexSlotCount > 0;

  return {
    orgNamed,
    inviteSent,
    hasFlexSlot,
    complete: orgNamed && inviteSent && hasFlexSlot,
    orgName: input.orgName,
  };
}

export async function getOnboardingStatus(
  orgId: string,
): Promise<OnboardingStatus> {
  const supabase = await createClient();

  const [
    { data: org },
    { count: inviteCount },
    { count: flexSlotCount },
    { data: members },
  ] = await Promise.all([
    supabase.from("organizations").select("name").eq("id", orgId).single(),
    supabase
      .from("org_invitations")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase
      .from("flex_slots")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase.rpc("list_org_members"),
  ]);

  return deriveOnboardingStatus({
    orgName: (org?.name as string | undefined) ?? DEFAULT_ORG_NAME,
    inviteCount: inviteCount ?? 0,
    memberCount: Array.isArray(members) ? members.length : 0,
    flexSlotCount: flexSlotCount ?? 0,
  });
}
