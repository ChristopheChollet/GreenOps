import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/SiteHeader";
import { AppFooter } from "@/components/AppFooter";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ScreenshotFrame } from "@/components/ScreenshotFrame";
import { ModuleIcon } from "@/components/ModuleIcon";
import { getRepoUrl } from "@/lib/site";
import { moduleTheme } from "@/lib/moduleTheme";

export const dynamic = "force-dynamic";

const features = [
  {
    module: "flex" as const,
    title: "Flexibilité réseau",
    description:
      "Créneaux offre / besoin, statuts ops, piste d’audit et export CSV — logique d’engagement et d’équilibre offre-demande.",
  },
  {
    module: "registry" as const,
    title: "Registre REC",
    description:
      "Fiches pédagogiques, volumes MWh, documents liés — traçabilité Web2 sans prétendre à un registre national.",
  },
  {
    module: "dashboard" as const,
    title: "Tableau de bord",
    description:
      "KPI, graphiques et activité récente pour suivre flex et REC en un coup d’œil.",
  },
];

const stack = ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "RLS", "Vercel"];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const repoUrl = getRepoUrl();

  return (
    <div className="app-canvas flex min-h-screen flex-col">
      <SiteHeader
        ctaHref={user ? "/dashboard" : "/login"}
        ctaLabel={user ? "Console" : "Connexion"}
      />

      <main id="main-content" className="flex-1">
        <section className="landing-hero-split mx-auto max-w-5xl px-4 pb-16 pt-12 sm:pb-20 sm:pt-16">
          <div className="landing-hero-copy motion-fade-up">
            <p className="landing-eyebrow">Product engineer · Énergie &amp; climat</p>
            <h1 className="landing-title">
              Console ops pour
              <br />
              <span className="landing-title-accent">flexibilité &amp; REC</span>
            </h1>
            <p className="landing-lead">
              GreenOps est une démo SaaS B2B : authentification, PostgreSQL avec RLS, modules
              métier et pilotage consolidé — le type de produit qu’on retrouve chez les acteurs
              climate-tech et energy ops.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={user ? "/dashboard" : "/login"}
                className="btn-primary px-6 py-2.5 text-sm"
              >
                {user ? "Ouvrir la console" : "Essayer la démo"}
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
          </div>
          <div className="landing-hero-visual motion-fade-up motion-stagger-2">
            <ScreenshotFrame
              src="/screenshots/dashboard.webp"
              alt="Aperçu du tableau de bord GreenOps avec KPI, graphiques flex et REC, et activité récente"
              priority
            />
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-20" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            Fonctionnalités principales
          </h2>
          <div className="feature-grid">
            {features.map((f, index) => {
              const theme = moduleTheme[f.module];
              return (
                <article
                  key={f.module}
                  className={`feature-card motion-fade-up motion-stagger-${index + 1}`}
                >
                  <div
                    className="feature-card-icon"
                    style={{ color: theme.color, backgroundColor: theme.tint }}
                    aria-hidden
                  >
                    <ModuleIcon module={f.module} size={24} />
                  </div>
                  <h3 className="feature-card-title">{f.title}</h3>
                  <p className="feature-card-desc">{f.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <ProductShowcase />

        <section className="landing-stack mx-auto max-w-5xl px-4 pb-16">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-muted">
            Stack technique
          </p>
          <ul className="mt-4 flex flex-wrap justify-center gap-2" aria-label="Stack technique">
            {stack.map((item) => (
              <li key={item} className="stack-pill">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
