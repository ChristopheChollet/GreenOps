import type { UsageSummary } from "@/lib/billing/client";

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function UsageMeter({
  isPro,
  usage,
}: {
  isPro: boolean;
  usage: UsageSummary | null;
}) {
  if (!isPro) {
    return (
      <section className="section-card">
        <h2 className="text-base font-medium text-primary">Usage du mois</h2>
        <p className="mt-2 text-sm text-secondary">
          La facturation à l&apos;usage est réservée au plan Pro.
        </p>
      </section>
    );
  }

  if (!usage) {
    return (
      <section className="section-card">
        <h2 className="text-base font-medium text-primary">Usage du mois</h2>
        <p className="mt-2 text-sm text-muted">Résumé indisponible pour le moment.</p>
      </section>
    );
  }

  const monthLabel = new Date(`${usage.month}-01T00:00:00Z`).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="section-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-medium text-primary">Usage du mois</h2>
          <p className="mt-1 text-sm text-muted capitalize">{monthLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-primary">{formatEuros(usage.total_cents)}</p>
          <p className="text-xs text-muted">total estimé (hors abonnement Pro)</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p className="text-xs text-muted">Lignes</p>
          <p className="mt-1 text-lg font-semibold text-primary">{usage.line_count}</p>
        </div>
        <div className="rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p className="text-xs text-muted">Énergie</p>
          <p className="mt-1 text-lg font-semibold text-primary">
            {usage.total_kwh > 0 ? `${usage.total_kwh.toFixed(1)} kWh` : "—"}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <p className="text-xs text-muted">Moteur tarifaire</p>
          <p className="mt-1 text-sm font-medium text-primary">GridPulse + HP/HC</p>
        </div>
      </div>
    </section>
  );
}
