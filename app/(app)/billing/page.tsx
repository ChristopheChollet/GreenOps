import { Suspense } from "react";
import { getSessionOrg } from "@/lib/auth/org";
import {
  getBillingLines,
  getSubscriptionStatus,
  getUsageSummary,
} from "@/lib/billing/client";
import { PageHeader } from "@/components/PageHeader";
import { BillingCheckoutBanner } from "@/components/billing/BillingCheckoutBanner";
import { BillingLinesTable } from "@/components/billing/BillingLinesTable";
import { PlanCards } from "@/components/billing/PlanCards";
import { UsageMeter } from "@/components/billing/UsageMeter";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

export default async function BillingPage() {
  const session = await getSessionOrg();
  if (!session) {
    return <p className="text-zinc-600">Non authentifié.</p>;
  }

  let plan: "free" | "pro" = "free";
  let status = "none";
  let periodEnd: string | null = null;
  let unavailable = false;
  let lines: Awaited<ReturnType<typeof getBillingLines>> = [];
  let usage: Awaited<ReturnType<typeof getUsageSummary>> | null = null;
  let usageUnavailable = false;

  try {
    const sub = await getSubscriptionStatus(session.orgId);
    plan = sub.plan;
    status = sub.status;
    periodEnd = sub.current_period_end ?? null;
  } catch {
    unavailable = true;
  }

  const isPro = plan === "pro" && ACTIVE_STATUSES.has(status);

  if (!unavailable && isPro) {
    try {
      const [billingLines, usageSummary] = await Promise.all([
        getBillingLines(session.orgId, { limit: 50 }),
        getUsageSummary(session.orgId),
      ]);
      lines = billingLines;
      usage = usageSummary;
    } catch {
      usageUnavailable = true;
    }
  }

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <BillingCheckoutBanner />
      </Suspense>

      <PageHeader
        module="billing"
        eyebrow="Facturation"
        title="Facturation"
        description="Abonnement Pro (Stripe test) + facturation à l'usage des créneaux flex — tarif dynamique GridPulse."
      />

      {unavailable ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Service de facturation momentanément indisponible. Réessayez plus tard.
        </p>
      ) : (
        <>
          <PlanCards
            isPro={isPro}
            isAdmin={session.role === "admin"}
            periodEnd={periodEnd}
          />

          <UsageMeter isPro={isPro} usage={usageUnavailable ? null : usage} />

          <BillingLinesTable lines={lines} isPro={isPro} />
        </>
      )}

      <p className="text-xs text-muted">
        Paiement géré par Stripe (mode test) — aucune carte réelle n&apos;est débitée. Les
        montants usage sont une simulation pédagogique (kWh × signal carbone × bande HP/HC
        simplifiée), pas une facture réglementaire.
      </p>
    </div>
  );
}
