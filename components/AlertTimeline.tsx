import Link from "next/link";
import { AlertAckButton } from "@/components/AlertAckButton";
import { getEcosystemLinks } from "@/lib/site";
import type { MeridianAlert } from "@/lib/alerts/types";

const SOURCE_LABELS: Record<string, string> = {
  gridpulse: "GridPulse",
  flexslot: "FlexSlot",
};

const ACTION_LABELS: Record<string, string> = {
  consume: "Consommer",
  flex: "Flex",
  defer: "Décaler",
};

function formatDate(value: string): string {
  return new Date(value).toLocaleString("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function AlertRow({
  alert,
  isAdmin,
  flexSlotUrl,
  gridPulseUrl,
}: {
  alert: MeridianAlert;
  isAdmin: boolean;
  flexSlotUrl: string;
  gridPulseUrl: string;
}) {
  const isOpen = alert.status === "open";

  return (
    <li className={`alert-timeline-item${isOpen ? "" : " alert-timeline-item-ack"}`}>
      <div className="alert-timeline-marker" data-source={alert.source} aria-hidden />
      <div className="alert-timeline-card section-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`alert-source-badge alert-source-${alert.source}`}>
                {SOURCE_LABELS[alert.source] ?? alert.source}
              </span>
              {alert.recommendation_action ? (
                <span className="alert-action-pill">
                  {ACTION_LABELS[alert.recommendation_action] ?? alert.recommendation_action}
                </span>
              ) : null}
              {!isOpen ? (
                <span className="alert-status-pill alert-status-ack">Traité</span>
              ) : (
                <span className="alert-status-pill alert-status-open">Ouvert</span>
              )}
            </div>
            <p className="mt-2 font-medium text-primary">{alert.title}</p>
            {alert.message ? (
              <p className="mt-1 text-sm text-secondary">{alert.message}</p>
            ) : null}
            <p className="mt-2 text-xs text-muted">{formatDate(alert.created_at)}</p>
          </div>
          {isOpen && isAdmin ? <AlertAckButton alertId={alert.id} /> : null}
        </div>

        <dl className="alert-timeline-meta mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {alert.carbon_gco2_kwh != null ? (
            <div>
              <dt className="text-xs text-muted">Carbone</dt>
              <dd className="font-medium">{alert.carbon_gco2_kwh.toFixed(0)} gCO₂/kWh</dd>
            </div>
          ) : null}
          {alert.threshold_gco2_kwh != null ? (
            <div>
              <dt className="text-xs text-muted">Seuil</dt>
              <dd className="font-medium">{alert.threshold_gco2_kwh.toFixed(0)} gCO₂/kWh</dd>
            </div>
          ) : null}
          {alert.zone ? (
            <div>
              <dt className="text-xs text-muted">Zone</dt>
              <dd className="font-medium">{alert.zone}</dd>
            </div>
          ) : null}
          {alert.window_start && alert.window_end ? (
            <div>
              <dt className="text-xs text-muted">Fenêtre</dt>
              <dd className="font-medium">
                {formatDate(alert.window_start)} → {formatDate(alert.window_end)}
              </dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {alert.source === "gridpulse" ? (
            <a
              href={gridPulseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent font-medium"
            >
              Voir GridPulse ↗
            </a>
          ) : null}
          {alert.source === "flexslot" ? (
            <a
              href={`${flexSlotUrl.replace(/\/$/, "")}/history`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-accent font-medium"
            >
              Historique FlexSlot ↗
            </a>
          ) : null}
          {alert.greenops_slot_id ? (
            <Link href={`/flex#slot-${alert.greenops_slot_id}`} className="link-accent font-medium">
              Voir le slot GreenOps →
            </Link>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function AlertTimeline({
  alerts,
  isAdmin,
}: {
  alerts: MeridianAlert[];
  isAdmin: boolean;
}) {
  const { flexSlot, gridPulse } = getEcosystemLinks();
  const openCount = alerts.filter((a) => a.status === "open").length;

  return (
    <section aria-labelledby="alerts-timeline-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="alerts-timeline-heading" className="text-lg font-medium text-primary">
          Timeline
        </h2>
        {alerts.length > 0 ? (
          <p className="text-sm text-muted">
            {alerts.length} alerte(s) · {openCount} ouverte(s)
          </p>
        ) : null}
      </div>

      {alerts.length === 0 ? (
        <p className="mt-4 text-sm text-secondary">
          Aucune alerte enregistrée. Les événements GridPulse (seuil carbone) et FlexSlot
          (reco defer / carbone élevé) apparaîtront ici après la prochaine ingestion ou visite
          recommandations.
        </p>
      ) : (
        <ol className="alert-timeline mt-4">
          {alerts.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              isAdmin={isAdmin}
              flexSlotUrl={flexSlot}
              gridPulseUrl={gridPulse}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
