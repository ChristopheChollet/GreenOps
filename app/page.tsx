import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <main className="mx-auto flex max-w-3xl flex-1 flex-col justify-center px-4 py-20">
        <p className="text-sm font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
          GreenOps Console
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Portail Web2 énergie & climat
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          Même vision modulaire que{" "}
          <strong className="text-zinc-800 dark:text-zinc-200">
            GreenChain Common
          </strong>{" "}
          (flexibilité, registre REC, pilotage) — sans blockchain. SaaS B2B de
          démonstration pour portfolio.
        </p>
        <ul className="mt-8 list-inside list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
          <li>Créneaux flex (offre / besoin)</li>
          <li>Fiches REC pédagogiques + lien document</li>
          <li>Tableau de bord et activité récente</li>
        </ul>
        <div className="mt-10 flex flex-wrap gap-4">
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Tableau de bord
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Connexion
            </Link>
          )}
          <span className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-500 dark:border-zinc-600">
            Doc : README à la racine du repo
          </span>
        </div>
        <p className="mt-12 text-xs text-zinc-500">
          Stack : Next.js (App Router), Supabase Auth + PostgreSQL + RLS,
          déploiement Vercel. Voir le README pour la migration SQL et la
          configuration.
        </p>
      </main>
    </div>
  );
}
