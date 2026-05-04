import { createClient } from "@/lib/supabase/server";
import { getSessionOrgId } from "@/lib/auth/org";
import {
  createRecCertificate,
  deleteRecCertificate,
} from "@/lib/registry/actions";

export default async function RegistryPage() {
  const orgId = await getSessionOrgId();
  const supabase = await createClient();

  if (!orgId) {
    return <p className="text-zinc-600">Organisation introuvable.</p>;
  }

  const { data: rows } = await supabase
    .from("rec_certificates")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  const certs = rows ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Registre REC (Web2)
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Fiches pédagogiques — pas un registre national. Miroir narratif du
          module Registry de GreenChain Common.
        </p>
      </div>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-lg font-medium">Nouvelle fiche</h2>
        <form
          action={createRecCertificate}
          className="mt-4 grid gap-4 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm">Libellé</label>
            <input
              name="label"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Période début</label>
            <input
              type="date"
              name="period_start"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Période fin</label>
            <input
              type="date"
              name="period_end"
              required
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Source / producteur</label>
            <input
              name="source"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Quantité (MWh)</label>
            <input
              type="number"
              name="quantity_mwh"
              step="0.001"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-600 dark:bg-zinc-900"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm">URL document (PDF)</label>
            <input
              type="url"
              name="document_url"
              placeholder="https://…"
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

      <section>
        <h2 className="text-lg font-medium">Fiches</h2>
        {certs.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">Aucune fiche.</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {certs.map(
              (c: {
                id: string;
                label: string;
                period_start: string;
                period_end: string;
                source: string | null;
                quantity_mwh: number | null;
                document_url: string | null;
                notes: string | null;
              }) => (
                <li
                  key={c.id}
                  className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <div className="text-sm">
                    <p className="font-medium">{c.label}</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {c.period_start} → {c.period_end}
                    </p>
                    {c.source && (
                      <p className="text-zinc-500">Source : {c.source}</p>
                    )}
                    {c.quantity_mwh != null && (
                      <p className="text-zinc-500">{c.quantity_mwh} MWh</p>
                    )}
                    {c.document_url && (
                      <a
                        href={c.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-emerald-700 hover:underline dark:text-emerald-400"
                      >
                        Document
                      </a>
                    )}
                    {c.notes && (
                      <p className="mt-1 text-zinc-600">{c.notes}</p>
                    )}
                  </div>
                  <form action={deleteRecCertificate.bind(null, c.id)}>
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Supprimer
                    </button>
                  </form>
                </li>
              ),
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
