import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";

const DEMO_STATS = {
  flexTotal: 12,
  recTotal: 8,
  flexOpen: 3,
  foot: "Aperçu démo · connectez-vous pour vos KPIs",
} as const;

export async function HeroLivePreview() {
  const supabase = await createClient();
  const session = await getSessionOrg();

  if (!session?.orgId) {
    return <HeroPreviewStats {...DEMO_STATS} live={false} />;
  }

  const orgId = session.orgId;
  const [{ count: flexTotal }, { count: flexOpen }, { count: recTotal }] =
    await Promise.all([
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
    ]);

  return (
    <HeroPreviewStats
      flexTotal={flexTotal ?? 0}
      recTotal={recTotal ?? 0}
      flexOpen={flexOpen ?? 0}
      foot="Données live · votre organisation"
      live
    />
  );
}

function HeroPreviewStats({
  flexTotal,
  recTotal,
  flexOpen,
  foot,
  live,
}: {
  flexTotal: number;
  recTotal: number;
  flexOpen: number;
  foot: string;
  live: boolean;
}) {
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
          <div className="hero-preview-bar" style={{ height: "55%" }} />
          <div className="hero-preview-bar" style={{ height: "75%" }} />
          <div className="hero-preview-bar" style={{ height: "45%" }} />
          <div className="hero-preview-bar" style={{ height: "90%" }} />
          <div className="hero-preview-bar" style={{ height: "60%" }} />
          <div className="hero-preview-bar" style={{ height: "50%" }} />
        </div>
        <p className="hero-preview-foot text-xs text-muted">{foot}</p>
      </div>
    </div>
  );
}
