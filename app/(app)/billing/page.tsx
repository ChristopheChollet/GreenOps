import { getSessionOrg } from "@/lib/auth/org";
import { getSubscriptionStatus } from "@/lib/billing/client";
import { PageHeader } from "@/components/PageHeader";
import { PlanBadge } from "@/components/StatusBadge";
import { BillingActionButton } from "@/components/BillingActionButton";

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

  try {
    const sub = await getSubscriptionStatus(session.orgId);
    plan = sub.plan;
    status = sub.status;
    periodEnd = sub.current_period_end ?? null;
  } catch {
    unavailable = true;
  }

  const isPro = plan === "pro" && ACTIVE_STATUSES.has(status);

  return (
    <div className="space-y-8">
      <PageHeader
        module="billing"
        eyebrow="Facturation"
        title="Facturation"
        description="Abonnement VoltFlow — facturation à l'usage du plan Pro (Stripe test mode)."
      />

      {unavailable ? (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          Service de facturation momentanément indisponible. Réessayez plus tard.
        </p>
      ) : (
        <section className="rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Plan actuel</p>
              <p className="mt-1 flex items-center gap-2 text-2xl font-semibold text-primary">
                <PlanBadge plan={isPro ? "pro" : "free"} />
              </p>
              {isPro && periodEnd && (
                <p className="mt-1 text-xs text-muted">
                  Renouvellement le {new Date(periodEnd).toLocaleDateString("fr-FR")}
                </p>
              )}
            </div>

            {session.role === "admin" ? (
              isPro ? (
                <BillingActionButton label="Gérer l'abonnement" endpoint="/api/billing/portal" />
              ) : (
                <BillingActionButton label="Passer au plan Pro" endpoint="/api/billing/checkout" />
              )
            ) : (
              <p className="text-xs text-muted">Réservé aux administrateurs.</p>
            )}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-neutral-200 p-6 text-sm text-secondary dark:border-neutral-800">
        <h2 className="mb-3 text-base font-medium text-primary">Free vs Pro</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>Free — tableau de bord, créneaux flex, registre REC, export CSV</li>
          <li>Pro — export PDF illimité, facturation à l&apos;usage des créneaux flex</li>
        </ul>
        <p className="mt-4 text-xs text-muted">
          Paiement géré par Stripe (mode test) — aucune carte réelle n&apos;est débitée.
        </p>
      </section>
    </div>
  );
}
