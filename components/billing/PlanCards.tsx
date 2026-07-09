import { BillingActionButton } from "@/components/BillingActionButton";
import { PlanBadge } from "@/components/StatusBadge";

const FREE_FEATURES = [
  "Tableau de bord & graphiques",
  "Créneaux flex & registre REC",
  "Export CSV",
  "Équipe & invitations",
];

const PRO_FEATURES = [
  "Tout le plan Free",
  "Export PDF illimité",
  "Facturation à l'usage des créneaux flex",
  "Tarif dynamique (signal GridPulse + HP/HC)",
];

export function PlanCards({
  isPro,
  isAdmin,
  periodEnd,
}: {
  isPro: boolean;
  isAdmin: boolean;
  periodEnd: string | null;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <article
        className={`section-card ${!isPro ? "ring-2 ring-emerald-500/40" : ""}`}
        aria-current={!isPro ? "true" : undefined}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-primary">Free</h2>
          <PlanBadge plan="free" />
        </div>
        <p className="mt-2 text-sm text-secondary">Pour piloter les ops sans facturation usage.</p>
        <ul className="mt-4 space-y-2 text-sm text-secondary">
          {FREE_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {!isPro && (
          <p className="mt-4 text-xs font-medium text-emerald-700 dark:text-emerald-400">
            Plan actuel
          </p>
        )}
      </article>

      <article
        className={`section-card ${isPro ? "ring-2 ring-pink-500/40" : ""}`}
        aria-current={isPro ? "true" : undefined}
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium text-primary">Pro</h2>
          <PlanBadge plan="pro" />
        </div>
        <p className="mt-2 text-sm text-secondary">
          Abonnement + consommation des créneaux flex facturés au fil de l&apos;eau.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-secondary">
          {PRO_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-emerald-600" aria-hidden>
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {isPro && periodEnd && (
          <p className="mt-4 text-xs text-muted">
            Renouvellement le {new Date(periodEnd).toLocaleDateString("fr-FR")}
          </p>
        )}
        {isPro && (
          <p className="mt-2 text-xs font-medium text-pink-700 dark:text-pink-400">Plan actuel</p>
        )}
        {isAdmin && (
          <div className="mt-4">
            {isPro ? (
              <BillingActionButton label="Gérer l'abonnement" endpoint="/api/billing/portal" />
            ) : (
              <BillingActionButton label="Passer au plan Pro" endpoint="/api/billing/checkout" />
            )}
          </div>
        )}
        {!isAdmin && (
          <p className="mt-4 text-xs text-muted">Réservé aux administrateurs.</p>
        )}
      </article>
    </div>
  );
}
