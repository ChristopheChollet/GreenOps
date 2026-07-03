import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import Link from "next/link";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { PageHeader } from "@/components/PageHeader";
import { StatGrid } from "@/components/StatGrid";
import { EmptyState } from "@/components/EmptyState";
import { ActivityModuleBadge } from "@/components/StatusBadge";
import { ChartsPanel } from "./charts-panel";
import { buildFlexStatusChartData, buildRecSourceChartData } from "@/lib/charts/buildChartData";
import type { FlexSlotInput, RecCertificateInput } from "@/lib/ops/types";

export default async function DashboardPage() {
  const session = await getSessionOrg();
  const orgId = session?.orgId;
  const supabase = await createClient();

  if (!orgId) {
    return (
      <p className="text-zinc-600">
        Profil ou organisation introuvable. Vérifiez que la migration SQL et
        le trigger `handle_new_user` sont appliqués sur Supabase.
      </p>
    );
  }

  const [
    { count: flexTotal },
    { count: flexOpen },
    { count: recTotal },
    { data: flexRecent },
    { data: recRecent },
    { data: flexForCharts },
    { data: recForCharts },
  ] = await Promise.all([
    supabase
      .from("flex_slots")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase
      .from("flex_slots")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", "open"),
    supabase
      .from("rec_certificates")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId),
    supabase
      .from("flex_slots")
      .select("id, kind, status, start_at, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("rec_certificates")
      .select("id, label, period_start, created_at")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("flex_slots").select("kind, status").eq("org_id", orgId),
    supabase
      .from("rec_certificates")
      .select("source, quantity_mwh")
      .eq("org_id", orgId),
  ]);

  const flexStatusData = buildFlexStatusChartData(
    (flexForCharts ?? []) as Pick<FlexSlotInput, "kind" | "status">[],
  );
  const recSourceData = buildRecSourceChartData(
    (recForCharts ?? []) as Pick<RecCertificateInput, "source" | "quantity_mwh">[],
  );

  type FlexRow = {
    id: string;
    kind: string;
    status: string;
    start_at: string;
    created_at: string;
  };
  type RecRow = {
    id: string;
    label: string;
    period_start: string;
    created_at: string;
  };

  const flexRows = (flexRecent ?? []) as FlexRow[];
  const recRows = (recRecent ?? []) as RecRow[];

  const activity: {
    label: string;
    at: string;
    href: string;
    module: "flex" | "rec";
  }[] = [
    ...flexRows.map((r) => ({
      label: `${r.kind} · ${r.status}`,
      at: r.created_at,
      href: "/flex",
      module: "flex" as const,
    })),
    ...recRows.map((r) => ({
      label: r.label,
      at: r.created_at,
      href: "/registry",
      module: "rec" as const,
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8">
      <PageHeader
        module="dashboard"
        eyebrow="Pilotage"
        title="Tableau de bord"
        description="Pilotage flexibilité et attestations REC (démo Web2, non réglementaire)."
      />

      {session?.role === "viewer" && <ReadOnlyBanner />}

      <StatGrid
        items={[
          {
            label: "Créneaux flex",
            value: flexTotal ?? 0,
            hint: `${flexOpen ?? 0} ouvert(s)`,
            tone: "ok",
          },
          {
            label: "Fiches REC",
            value: recTotal ?? 0,
            tone: recTotal ? "default" : "warn",
          },
          {
            label: "Organisation",
            value: session?.role === "viewer" ? "Viewer" : "Admin",
            hint: "Rôle actif",
          },
        ]}
      />

      <ChartsPanel flexStatusData={flexStatusData} recSourceData={recSourceData} />

      <section>
        <h2 className="text-lg font-medium text-primary">Activité récente</h2>
        {activity.length === 0 ? (
          <EmptyState
            module="dashboard"
            title="Aucune activité pour l’instant"
            description="Créez un créneau flex ou une fiche REC pour alimenter le tableau de bord."
            actionHref="/flex"
            actionLabel="Créer un créneau flex"
          />
        ) : (
          <ul className="activity-list">
            {activity.map((a, i) => (
              <li key={`${a.at}-${i}`} className="activity-item">
                <Link href={a.href} className="activity-item-label hover:underline">
                  <ActivityModuleBadge module={a.module} />
                  <span>{a.label}</span>
                </Link>
                <time className="shrink-0 text-xs text-muted" dateTime={a.at}>
                  {new Date(a.at).toLocaleString("fr-FR")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
