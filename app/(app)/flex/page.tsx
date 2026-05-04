import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { createFlexSlot, deleteFlexSlot } from "@/lib/flex/actions";
import { exportFlexSlotsCsv } from "@/lib/export/actions";
import { PedagogyNote } from "@/components/PedagogyNote";
import { CsvDownloadButton } from "@/components/CsvDownloadButton";
import { AuditMeta } from "@/components/AuditMeta";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";

type FlexSlot = {
  id: string;
  kind: string;
  status: string;
  start_at: string;
  end_at: string;
  power_kw: number | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export default async function FlexPage() {
  const session = await getSessionOrg();
  const orgId = session?.orgId;
  const isAdmin = session?.role === "admin";
  const supabase = await createClient();

  if (!orgId) {
    return <p className="text-zinc-600">Organisation introuvable.</p>;
  }

  const { data: rows } = await supabase
    .from("flex_slots")
    .select("*")
    .eq("org_id", orgId)
    .order("start_at", { ascending: false });

  const slots = (rows ?? []) as FlexSlot[];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Flexibilité
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Offres et besoins de créneaux (miroir Web2 du marché flex GreenChain
            Common).
          </p>
        </div>
        {slots.length > 0 && (
          <CsvDownloadButton
            label="Exporter CSV"
            filename="greenops-flex-slots.csv"
            exportFn={exportFlexSlotsCsv}
          />
        )}
      </div>

      {session?.role === "viewer" && <ReadOnlyBanner />}

      <PedagogyNote title="Métier (rappel)">
        <p>
          La <strong>flexibilité</strong> sert l’équilibre offre / demande : un
          créneau « offre » ou « besoin » s’inscrit dans           la logique d’engagements
          et de prévision vs réalisation (voir ton dossier{" "}
          <code className="rounded bg-amber-100/60 px-1 text-xs dark:bg-amber-900/40">
            docs-energie-climat
          </code>{" "}
          — notions 3–4 et 9–12 dans la checklist métier).
        </p>
      </PedagogyNote>

      {isAdmin && (
        <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-lg font-medium">Nouveau créneau</h2>
          <form
            action={createFlexSlot}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="mb-1 block text-sm">Type</label>
              <select
                name="kind"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              >
                <option value="offer">Offre</option>
                <option value="need">Besoin</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Statut</label>
              <select
                name="status"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              >
                <option value="draft">Brouillon</option>
                <option value="open">Ouvert</option>
                <option value="matched">Matché</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm">Début</label>
              <input
                type="datetime-local"
                name="start_at"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Fin</label>
              <input
                type="datetime-local"
                name="end_at"
                required
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm">Puissance (kW)</label>
              <input
                type="number"
                name="power_kw"
                step="0.01"
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm">Notes</label>
              <textarea
                name="notes"
                rows={2}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium">Créneaux</h2>
        {slots.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Aucun créneau.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {slots.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <div className="text-sm">
                  <p className="font-medium capitalize">
                    {s.kind} · {s.status}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {new Date(s.start_at).toLocaleString("fr-FR")} →{" "}
                    {new Date(s.end_at).toLocaleString("fr-FR")}
                  </p>
                  {s.power_kw != null && (
                    <p className="text-zinc-500">{s.power_kw} kW</p>
                  )}
                  {s.notes && (
                    <p className="mt-1 text-zinc-600">{s.notes}</p>
                  )}
                  <AuditMeta
                    created_at={s.created_at}
                    updated_at={s.updated_at ?? s.created_at}
                    created_by={s.created_by ?? null}
                    updated_by={s.updated_by ?? null}
                  />
                </div>
                {isAdmin && (
                  <form action={deleteFlexSlot.bind(null, s.id)}>
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Supprimer
                    </button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
