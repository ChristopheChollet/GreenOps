import { getSessionOrg } from "@/lib/auth/org";
import { listMeridianAlerts } from "@/lib/alerts/queries";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { AlertTimeline } from "@/components/AlertTimeline";

export const dynamic = "force-dynamic";

export default async function AlertsPage() {
  const session = await getSessionOrg();

  if (!session) {
    return (
      <EmptyState
        module="alerts"
        title="Non authentifié"
        description="Connectez-vous pour consulter les alertes Meridian consolidées."
        actionHref="/login"
        actionLabel="Se reconnecter"
      />
    );
  }

  const alerts = await listMeridianAlerts(50);
  const isAdmin = session.role === "admin";

  return (
    <div className="space-y-8">
      <PageHeader
        module="alerts"
        eyebrow="Meridian Alerts"
        title="Centre d'alertes"
        description="Vue ops consolidée — alertes carbone GridPulse et recommandations FlexSlot, avec liens vers l'historique et les slots GreenOps."
      />

      {session.role === "viewer" && <ReadOnlyBanner />}

      <div className="section-card">
        <p className="text-sm text-secondary">
          <strong className="text-primary">V2.1 → maturité</strong> — les webhooks Slack/Discord
          restent actifs côté GridPulse et FlexSlot ; cette page centralise l&apos;historique et le
          statut « traité » pour le pilotage ops.
        </p>
      </div>

      <AlertTimeline alerts={alerts} isAdmin={isAdmin} />
    </div>
  );
}
