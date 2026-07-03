import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/SiteHeader";
import { AppFooter } from "@/components/AppFooter";
import { HeroLivePreview } from "@/components/HeroLivePreview";
import { ModuleIcon } from "@/components/ModuleIcon";
import { getRepoUrl } from "@/lib/site";
import { moduleTheme, type ModuleKey } from "@/lib/moduleTheme";

export const dynamic = "force-dynamic";

const features: {
  module: ModuleKey;
  href: string;
  title: string;
  description: string;
}[] = [
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
  {
    module: "team",
    href: "/team",
    title: "Équipe",
    description:
      "Invitations par e-mail, rôles admin/viewer et isolation multi-organisation (RLS).",
  },
];

const stack = [
  "Next.js",
  "TypeScript",
  "Supabase",
  "PostgreSQL",
  "RLS",
  "pdf-lib",
  "Vercel",
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const repoUrl = getRepoUrl();
  const ctaHref = user ? "/dashboard" : "/login";
  const ctaLabel = user ? "Ouvrir le tableau de bord" : "Essayer la démo";

  return (
    <div className="app-canvas flex min-h-screen flex-col">
      <SiteHeader />

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
              avec RLS, modules métier et exports — le pendant produit de GridPulse
              (data mix &amp; carbone), orienté ops énergie / climat.
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

          <section
          className="landing-modules motion-fade-up motion-stagger-2"
          aria-labelledby="features-heading"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-muted">
            Modules
          </p>
          <h2 id="features-heading" className="mt-2 text-xl font-semibold text-primary">
            Les quatre pages du produit
          </h2>
          <p className="landing-modules-lead">
            Même entrées que la navigation — connexion requise (magic link). Chaque
            module partage la même organisation et les politiques RLS PostgreSQL.
          </p>
          <ul className="feature-grid">
            {features.map((f) => {
              const theme = moduleTheme[f.module];
              return (
                <li key={f.href} className="h-full">
                  <Link href={f.href} className="feature-card feature-card-link">
                    <span
                      className="feature-card-icon"
                      style={{ color: theme.color, backgroundColor: theme.tint }}
                      aria-hidden
                    >
                      <ModuleIcon module={f.module} size={24} />
                    </span>
                    <h3 className="feature-card-title">{f.title}</h3>
                    <p className="feature-card-desc">{f.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
          </section>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
