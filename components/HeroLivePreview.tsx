import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import {
  countSlotsByLast6Days,
  valuesToBarHeightPcts,
} from "@/lib/chartBarHeights";

const DEMO_STATS = {
  flexTotal: 12,
  recTotal: 8,
  flexOpen: 3,
  foot: "Aperçu démo · connectez-vous pour vos KPIs",
  chartFoot: "Créneaux flex créés (6 j) · démo",
  barValues: [1, 2, 1, 3, 2, 4],
} as const;

export async function HeroLivePreview() {
  const supabase = await createClient();
  const session = await getSessionOrg();

  if (!session?.orgId) {
    return <HeroPreviewStats {...DEMO_STATS} live={false} />;
  }

  const orgId = session.orgId;
  const since = new Date();
  since.setDate(since.getDate() - 6);

  const [
    { count: flexTotal },
    { count: flexOpen },
    { count: recTotal },
    { data: flexCreated },
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
      .select("created_at")
      .eq("org_id", orgId)
      .gte("created_at", since.toISOString()),
  ]);

  const barValues = countSlotsByLast6Days(
    (flexCreated ?? []).map((r) => r.created_at as string),
  );

  return (
    <HeroPreviewStats
      flexTotal={flexTotal ?? 0}
      recTotal={recTotal ?? 0}
      flexOpen={flexOpen ?? 0}
      foot="Données live · votre organisation"
      chartFoot="Créneaux flex créés sur les 6 derniers jours"
      live
      barValues={barValues}
    />
  );
}

function HeroPreviewStats({
  flexTotal,
  recTotal,
  flexOpen,
  foot,
  chartFoot,
  live,
  barValues,
}: {
  flexTotal: number;
  recTotal: number;
  flexOpen: number;
  foot: string;
  chartFoot: string;
  live: boolean;
  barValues: readonly number[];
}) {
  const barHeights = valuesToBarHeightPcts(barValues);

  return (
    <div className="screenshot-frame motion-fade-up motion-stagger-2">
      <div className="screenshot-frame-chrome">
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
        <span className="screenshot-frame-dot" />
        <span className="ml-2 text-xs text-muted">
          greenops{live ? " — live" : ""}
        </span>
      </div>
      <div className="hero-preview-body">
        <div className="hero-preview-stats">
          <div className="hero-preview-stat">
            <p className="hero-preview-label">Créneaux flex</p>
            <p className="hero-preview-value">{flexTotal}</p>
          </div>
          <div className="hero-preview-stat">
            <p className="hero-preview-label">REC</p>
            <p className="hero-preview-value">{recTotal}</p>
          </div>
          <div className="hero-preview-stat">
            <p className="hero-preview-label">Ouverts</p>
            <p className="hero-preview-value hero-preview-value-ok">{flexOpen}</p>
          </div>
        </div>
        <div className="hero-preview-chart" aria-hidden>
          {barHeights.map((height, i) => (
            <div key={i} className="hero-preview-bar" style={{ height }} />
          ))}
        </div>
        <p className="hero-preview-foot text-xs text-muted">
          {foot}
          <span className="block mt-1">{chartFoot}</span>
        </p>
      </div>
    </div>
  );
}
