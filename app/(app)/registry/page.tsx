import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { Suspense } from "react";
import {
  createRecCertificate,
  deleteRecCertificate,
  updateRecCertificate,
} from "@/lib/registry/actions";
import { FormErrorFromQuery } from "@/components/FormErrorFromQuery";
import { exportRecCertificatesCsv } from "@/lib/export/actions";
import { CsvDownloadButton } from "@/components/CsvDownloadButton";
import { AuditMeta } from "@/components/AuditMeta";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

type RecRow = {
  id: string;
  label: string;
  period_start: string;
  period_end: string;
  source: string | null;
  quantity_mwh: number | null;
  document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  created_by?: string | null;
  updated_by?: string | null;
};

export default async function RegistryPage() {
  const session = await getSessionOrg();
  const orgId = session?.orgId;
  const isAdmin = session?.role === "admin";
  const supabase = await createClient();

  if (!orgId) {
    return <p className="text-zinc-600">Organisation introuvable.</p>;
  }

  const { data: rows } = await supabase
    .from("rec_certificates")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  const certs = (rows ?? []) as RecRow[];
  const totalMwh = certs.reduce((sum, c) => sum + (c.quantity_mwh ?? 0), 0);

  return (
    <div className="space-y-8">
      <PageHeader
        module="registry"
        eyebrow="Registre"
        title="Registre REC (Web2)"
        description="Fiches pédagogiques — pas un registre national. Traçabilité et audit pour la démo ops."
        actions={
          certs.length > 0 ? (
            <CsvDownloadButton
              label="Exporter CSV"
              filename="greenops-rec-certificates.csv"
              exportFn={exportRecCertificatesCsv}
            />
          ) : undefined
        }
      />

      {session?.role === "viewer" && <ReadOnlyBanner />}

      {certs.length > 0 && (
        <p className="text-sm text-muted">
          {certs.length} fiche(s) · {totalMwh.toLocaleString("fr-FR")} MWh déclarés
        </p>
      )}

      {isAdmin && (
        <section className="section-card">
          <Suspense fallback={null}>
            <FormErrorFromQuery />
          </Suspense>
          <h2 className="text-lg font-medium text-primary">Nouvelle fiche</h2>
          <form
            action={createRecCertificate}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div className="form-field sm:col-span-2">
              <label className="form-label">Libellé</label>
              <input name="label" required className="input-field" />
            </div>
            <div className="form-field">
              <label className="form-label">Période début</label>
              <input
                type="date"
                name="period_start"
                required
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Période fin</label>
              <input
                type="date"
                name="period_end"
                required
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Source / producteur</label>
              <input name="source" className="input-field" />
            </div>
            <div className="form-field">
              <label className="form-label">Quantité (MWh)</label>
              <input
                type="number"
                name="quantity_mwh"
                step="0.001"
                className="input-field"
              />
            </div>
            <div className="form-field sm:col-span-2">
              <label className="form-label">URL document (PDF)</label>
              <input
                type="url"
                name="document_url"
                placeholder="https://…"
                className="input-field"
              />
            </div>
            <div className="form-field sm:col-span-2">
              <label className="form-label">Notes</label>
              <textarea name="notes" rows={2} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium text-primary">Fiches</h2>
        {certs.length === 0 ? (
          <EmptyState
            module="registry"
            title="Aucune fiche REC"
            description={
              isAdmin
                ? "Créez une fiche pédagogique pour documenter un certificat ou un lot REC de démonstration."
                : "Aucune fiche n’a encore été enregistrée pour cette organisation."
            }
          />
        ) : (
          <ul className="card-grid mt-3">
            {certs.map((c) => (
              <li
                key={c.id}
                className="section-card section-card-hover flex flex-wrap items-start justify-between gap-4"
              >
                <div className="card-body">
                  <p className="card-title">{c.label}</p>
                  <p className="mt-1">
                    {c.period_start} → {c.period_end}
                  </p>
                  {c.source && <p className="mt-1 text-muted">Source : {c.source}</p>}
                  {c.quantity_mwh != null && (
                    <p className="mt-1 card-body-strong">{c.quantity_mwh} MWh</p>
                  )}
                  {c.document_url && (
                    <a
                      href={c.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-accent mt-2 inline-block"
                    >
                      Document →
                    </a>
                  )}
                  {c.notes && <p className="mt-2">{c.notes}</p>}
                  <AuditMeta
                    created_at={c.created_at}
                    updated_at={c.updated_at ?? c.created_at}
                    created_by={c.created_by ?? null}
                    updated_by={c.updated_by ?? null}
                  />
                </div>
                {isAdmin && (
                  <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
                    <details className="edit-details">
                      <summary className="edit-details-summary">Modifier</summary>
                      <form
                        action={updateRecCertificate.bind(null, c.id)}
                        className="edit-details-form grid gap-3 sm:grid-cols-2"
                      >
                        <div className="form-field sm:col-span-2">
                          <label className="form-label">Libellé</label>
                          <input
                            name="label"
                            required
                            defaultValue={c.label}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Période début</label>
                          <input
                            type="date"
                            name="period_start"
                            required
                            defaultValue={c.period_start}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Période fin</label>
                          <input
                            type="date"
                            name="period_end"
                            required
                            defaultValue={c.period_end}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Source / producteur</label>
                          <input
                            name="source"
                            defaultValue={c.source ?? ""}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Quantité (MWh)</label>
                          <input
                            type="number"
                            name="quantity_mwh"
                            step="0.001"
                            defaultValue={c.quantity_mwh ?? undefined}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field sm:col-span-2">
                          <label className="form-label">URL document (PDF)</label>
                          <input
                            type="url"
                            name="document_url"
                            placeholder="https://…"
                            defaultValue={c.document_url ?? ""}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field sm:col-span-2">
                          <label className="form-label">Notes</label>
                          <textarea
                            name="notes"
                            rows={2}
                            defaultValue={c.notes ?? ""}
                            className="input-field"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <button type="submit" className="btn-primary">
                            Mettre à jour
                          </button>
                        </div>
                      </form>
                    </details>
                    <form action={deleteRecCertificate.bind(null, c.id)}>
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                        aria-label={`Supprimer la fiche ${c.label}`}
                      >
                        Supprimer
                      </button>
                    </form>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
