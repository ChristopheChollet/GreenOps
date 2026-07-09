import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/SiteHeader";
import { AppFooter } from "@/components/AppFooter";
import { HeroLivePreview } from "@/components/HeroLivePreview";
import { ModuleIcon } from "@/components/ModuleIcon";
import { MeridianJourneyBar } from "@/components/MeridianJourneyBar";
import { OpsChain } from "@/components/OpsChain";
import { getEcosystemLinks, getRepoUrl } from "@/lib/site";
import { moduleTheme, type ModuleKey } from "@/lib/moduleTheme";

export const dynamic = "force-dynamic";

type Feature = {
  module: ModuleKey;
  href: string;
  title: string;
  description: string;
};

const opsFeatures: Feature[] = [
  {
    module: "dashboard",
    href: "/dashboard",
    title: "Tableau de bord",
    description:
      "KPI flex/REC, graphiques, activité récente et export PDF — vue consolidée ops.",
  },
  {
    module: "flex",
    href: "/flex",
    title: "Flexibilité",
    description:
      "Créneaux offre/besoin, édition inline, statuts, audit et export CSV.",
  },
  {
    module: "registry",
    href: "/registry",
    title: "Registre REC",
    description:
      "Fiches certificats, volumes MWh, édition et piste d'audit — démo non réglementaire.",
  },
];

const orgFeatures: Feature[] = [
  {
    module: "team",
    href: "/team",
    title: "Équipe",
    description:
      "Invitations par e-mail, rôles admin/viewer et isolation multi-organisation (RLS).",
  },
  {
    module: "billing",
    href: "/billing",
    title: "Facturation",
    description:
      "Plan Free / Pro, Stripe Checkout, portail abonnement et gate export PDF.",
  },
  {
    module: "alerts",
    href: "/alerts",
    title: "Meridian Alerts",
    description:
      "Centre d'alertes consolidé — carbone GridPulse, reco FlexSlot, statut traité.",
  },
];

const stack = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "RLS",
  "Stripe",
  "pdf-lib",
  "Vercel",
];

function FeatureCard({ feature }: { feature: Feature }) {
  const theme = moduleTheme[feature.module];
  return (
    <li className="h-full">
      <Link href={feature.href} className="feature-card feature-card-link">
        <span
          className="feature-card-icon"
          style={{ color: theme.color, backgroundColor: theme.tint }}
          aria-hidden
        >
          <ModuleIcon module={feature.module} size={24} />
        </span>
        <h3 className="feature-card-title">{feature.title}</h3>
        <p className="feature-card-desc">{feature.description}</p>
      </Link>
    </li>
  );
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const repoUrl = getRepoUrl();
  const ecosystem = getEcosystemLinks();
  const ctaHref = user ? "/dashboard" : "/login";
  const ctaLabel = user ? "Ouvrir le tableau de bord" : "Essayer la démo";

  return (
    <>
      <SiteHeader />
      <MeridianJourneyBar current="greenops" />

      <main id="main-content" className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <div className="pb-16">
          <section className="landing-hero-split pb-16 pt-4 sm:pt-8">
            <div className="landing-hero-copy motion-fade-up min-w-0">
            <p className="landing-eyebrow">Product engineer · Énergie &amp; climat</p>
            <h1 className="landing-title">
              Pilotage ops
              <br />
              <span className="landing-title-accent">flexibilité &amp; REC</span>
            </h1>
            <p className="landing-lead">
              GreenOps est une démo SaaS B2B : authentification Supabase, PostgreSQL
              avec RLS, cinq modules métier (dont facturation Stripe) et exports — le
              pendant produit de GridPulse (data mix &amp; carbone), orienté ops énergie
              / climat.
            </p>
            <div className="landing-hero-cta">
              <Link href={ctaHref} className="btn-primary border border-transparent px-6 py-2.5 text-sm">
                {ctaLabel}
              </Link>
              <a
                href={repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost px-6 py-2.5 text-sm"
              >
                Code source →
              </a>
            </div>
            <ul className="stack-pills" aria-label="Stack technique">
              {stack.map((item) => (
                <li key={item}>
                  <span className="stack-pill">{item}</span>
                </li>
              ))}
            </ul>
            </div>
            <div className="min-w-0">
              <HeroLivePreview />
            </div>
          </section>

          <OpsChain
            highlight="action"
            links={{
              gridPulse: ecosystem.gridPulse,
              flexSlot: ecosystem.flexSlot,
            }}
          />

          <section
          className="landing-modules motion-fade-up motion-stagger-2"
          aria-labelledby="features-heading"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Modules
          </p>
          <h2 id="features-heading" className="mt-2 text-xl font-semibold text-primary">
            Les cinq pages du produit
          </h2>
          <p className="landing-modules-lead">
            Même entrées que la navigation — connexion requise (magic link). Chaque
            module partage la même organisation et les politiques RLS PostgreSQL.
          </p>

          <div className="feature-groups">
            <div className="feature-group">
              <h3 className="feature-group-title">Pilotage ops</h3>
              <ul className="feature-grid feature-grid-ops">
                {opsFeatures.map((f) => (
                  <FeatureCard key={f.href} feature={f} />
                ))}
              </ul>
            </div>

            <div className="feature-group">
              <h3 className="feature-group-title">Organisation &amp; abonnement</h3>
              <ul className="feature-grid feature-grid-org">
                {orgFeatures.map((f) => (
                  <FeatureCard key={f.href} feature={f} />
                ))}
              </ul>
            </div>
          </div>
          </section>
        </div>
      </main>

      <AppFooter />
    </>
  );
}
