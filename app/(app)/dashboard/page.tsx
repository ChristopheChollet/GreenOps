import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import Link from "next/link";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";

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
  ]);

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

  const activity: { label: string; at: string; href: string }[] = [
    ...flexRows.map((r) => ({
      label: `Flex ${r.kind} · ${r.status}`,
      at: r.created_at,
      href: "/flex",
    })),
    ...recRows.map((r) => ({
      label: `REC · ${r.label}`,
      at: r.created_at,
      href: "/registry",
    })),
  ]
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Pilotage flexibilité et attestations REC (démo Web2, non
          réglementaire).
        </p>
      </div>

      {session?.role === "viewer" && <ReadOnlyBanner />}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-500">Créneaux flex (total)</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {flexTotal ?? 0}
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Ouverts : {flexOpen ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-500">Fiches REC</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            {recTotal ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="text-sm text-zinc-500">Actions rapides</p>
          <ul className="mt-2 space-y-2 text-sm">
            <li>
              <Link
                href="/flex"
                className="text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Nouveau créneau flex
              </Link>
            </li>
            <li>
              <Link
                href="/registry"
                className="text-emerald-700 hover:underline dark:text-emerald-400"
              >
                Nouvelle fiche REC
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
          Activité récente
        </h2>
        {activity.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">
            Aucun enregistrement pour l’instant.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/50">
            {activity.map((a, i) => (
              <li
                key={`${a.at}-${i}`}
                className="flex items-center justify-between gap-4 px-4 py-3 text-sm"
              >
                <span className="text-zinc-800 dark:text-zinc-200">
                  {a.label}
                </span>
                <span className="shrink-0 text-zinc-500">
                  {new Date(a.at).toLocaleString("fr-FR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
