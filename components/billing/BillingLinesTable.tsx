import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import type { BillingLine } from "@/lib/billing/client";

function formatEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

const PRICING_LABELS: Record<string, string> = {
  gridpulse_carbon: "Signal carbone GridPulse",
  slot_score_fallback: "Score créneau",
  stub_fallback: "Tarif fixe (fallback)",
};

export function BillingLinesTable({
  lines,
  isPro,
}: {
  lines: BillingLine[];
  isPro: boolean;
}) {
  if (!isPro) {
    return (
      <section className="section-card">
        <h2 className="text-base font-medium text-primary">Lignes de facturation</h2>
        <p className="mt-2 text-sm text-secondary">
          Passez au plan Pro pour voir la consommation liée aux créneaux flex.
        </p>
      </section>
    );
  }

  if (lines.length === 0) {
    return (
      <section className="section-card">
        <h2 className="mb-4 text-base font-medium text-primary">Lignes de facturation</h2>
        <EmptyState
          module="billing"
          title="Aucune consommation ce mois-ci"
          description="Chaque créneau flex créé en plan Pro génère une ligne facturée (kWh × tarif dynamique)."
          actionHref="/flex"
          actionLabel="Voir les créneaux flex"
        />
      </section>
    );
  }

  return (
    <section className="section-card">
      <h2 className="mb-4 text-base font-medium text-primary">Lignes de facturation</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-xs uppercase tracking-wide text-muted dark:border-neutral-800">
              <th className="px-2 py-2 font-medium">Date</th>
              <th className="px-2 py-2 font-medium">Créneau</th>
              <th className="px-2 py-2 font-medium">kWh</th>
              <th className="px-2 py-2 font-medium">Tarif</th>
              <th className="px-2 py-2 font-medium">Bande</th>
              <th className="px-2 py-2 font-medium text-right">Montant</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr
                key={line.id}
                className="border-b border-neutral-100 last:border-0 dark:border-neutral-800/80"
              >
                <td className="px-2 py-3 text-secondary">
                  {new Date(line.created_at).toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-2 py-3">
                  {line.flex_slot_id ? (
                    <Link href="/flex" className="link-accent font-mono text-xs">
                      {line.flex_slot_id.slice(0, 8)}…
                    </Link>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="px-2 py-3 text-secondary">
                  {line.kwh != null ? line.kwh.toFixed(2) : "—"}
                </td>
                <td className="px-2 py-3 text-secondary">
                  <span className="block">
                    {line.pricing_source
                      ? (PRICING_LABELS[line.pricing_source] ?? line.pricing_source)
                      : "—"}
                  </span>
                  {line.carbon_gco2_kwh != null && (
                    <span className="text-xs text-muted">
                      {line.carbon_gco2_kwh} gCO₂/kWh
                    </span>
                  )}
                </td>
                <td className="px-2 py-3 text-secondary">{line.hp_hc_band ?? "—"}</td>
                <td className="px-2 py-3 text-right font-medium text-primary">
                  {formatEuros(line.amount_cents)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
