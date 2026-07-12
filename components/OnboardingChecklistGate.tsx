import { getOnboardingStatus } from "@/lib/onboarding/status";
import type { OrgRole } from "@/lib/auth/org";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { Suspense } from "react";

export async function OnboardingChecklistGate({
  orgId,
  role,
}: {
  orgId: string;
  role: OrgRole;
}) {
  if (role !== "admin") return null;

  const status = await getOnboardingStatus(orgId);
  if (status.complete) return null;

  return (
    <Suspense fallback={null}>
      <OnboardingChecklist status={status} />
    </Suspense>
  );
}
