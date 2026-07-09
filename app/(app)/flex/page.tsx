import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { Suspense } from "react";
import { createFlexSlot, deleteFlexSlot, updateFlexSlot } from "@/lib/flex/actions";
import { FormErrorFromQuery } from "@/components/FormErrorFromQuery";
import { exportFlexSlotsCsv } from "@/lib/export/actions";
import { CsvDownloadButton } from "@/components/CsvDownloadButton";
import { AuditMeta } from "@/components/AuditMeta";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { FlexKindBadge, FlexStatusBadge } from "@/components/StatusBadge";
import { toDatetimeLocalValue } from "@/lib/datetime";
import {
  flexSlotActionLabel,
  isFlexSlotOrigin,
} from "@/lib/flex/flexslot-origin";

export const dynamic = "force-dynamic";

type FlexSlot = {
  id: string;
  kind: string;
  status: string;
  start_at: string;
  end_at: string;
  power_kw: number | null;
  notes: string | null;
  source?: string | null;
  recommendation_action?: string | null;
  gridpulse_score?: number | null;
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

  const { data: rows, error } = await supabase
    .from("flex_slots")
    .select(
      "id, kind, status, start_at, end_at, power_kw, notes, source, recommendation_action, gridpulse_score, created_at, updated_at, created_by, updated_by",
    )
    .eq("org_id", orgId)
    .order("start_at", { ascending: false });

  if (error) {
    console.error("[flex] load slots:", error.message);
  }

  const slots = (rows ?? []) as FlexSlot[];
  const openCount = slots.filter((s) => s.status === "open").length;

  return (
    <div className="space-y-8">
      <PageHeader
        module="flex"
        eyebrow="Flexibilité"
        title="Flexibilité"
        description="Offres et besoins de créneaux — pilotage ops Web2 sur la niche énergie / climat."
        actions={
          slots.length > 0 ? (
            <CsvDownloadButton
              label="Exporter CSV"
              filename="greenops-flex-slots.csv"
              exportFn={exportFlexSlotsCsv}
            />
          ) : undefined
        }
      />

      {session?.role === "viewer" && <ReadOnlyBanner />}

      {slots.length > 0 && (
        <p className="text-sm text-muted">
          {slots.length} créneau(x) · {openCount} ouvert(s)
        </p>
      )}

      {isAdmin && (
        <section className="section-card">
          <Suspense fallback={null}>
            <FormErrorFromQuery />
          </Suspense>
          <h2 className="text-lg font-medium text-primary">Nouveau créneau (manuel)</h2>
          <p className="mt-1 text-xs text-muted">
            La fin doit être strictement après le début (ex. début 14:00 → fin 16:00).
          </p>
          <form
            action={createFlexSlot}
            className="mt-4 grid gap-4 sm:grid-cols-2"
          >
            <div className="form-field">
              <label className="form-label">Type</label>
              <select name="kind" className="input-field">
                <option value="offer">Offre</option>
                <option value="need">Besoin</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Statut</label>
              <select name="status" className="input-field">
                <option value="draft">Brouillon</option>
                <option value="open">Ouvert</option>
                <option value="matched">Matché</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Début</label>
              <input
                type="datetime-local"
                name="start_at"
                required
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Fin</label>
              <input
                type="datetime-local"
                name="end_at"
                required
                className="input-field"
              />
            </div>
            <div className="form-field">
              <label className="form-label">Puissance (kW)</label>
              <input
                type="number"
                name="power_kw"
                step="0.01"
                className="input-field"
              />
            </div>
            <div className="form-field sm:col-span-2">
              <label className="form-label">Notes</label>
              <textarea name="notes" rows={2} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="btn-primary px-4 py-2 text-sm">
                Enregistrer
              </button>
            </div>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium text-primary">Créneaux</h2>
        {slots.length === 0 ? (
          <EmptyState
            module="flex"
            title="Aucun créneau flex"
            description={
              isAdmin
                ? "Utilisez le formulaire ci-dessus pour créer votre premier créneau offre ou besoin."
                : "Aucun créneau n’a encore été enregistré pour cette organisation."
            }
          />
        ) : (
          <ul className="card-grid mt-3">
            {slots.map((s) => (
              <li
                key={s.id}
                id={`slot-${s.id}`}
                className="section-card section-card-hover flex scroll-mt-24 flex-wrap items-start justify-between gap-4 target:ring-2 target:ring-orange-400"
              >
                <div className="card-body">
                  <div className="flex flex-wrap items-center gap-2">
                    <FlexKindBadge kind={s.kind} />
                    <FlexStatusBadge status={s.status} />
                    {isFlexSlotOrigin(s) && (
                      <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-950 dark:text-orange-200">
                        FlexSlot
                        {flexSlotActionLabel(s.recommendation_action)
                          ? ` · ${flexSlotActionLabel(s.recommendation_action)}`
                          : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-2">
                    {new Date(s.start_at).toLocaleString("fr-FR")} →{" "}
                    {new Date(s.end_at).toLocaleString("fr-FR")}
                  </p>
                  {s.power_kw != null && (
                    <p className="mt-1 card-body-strong">{s.power_kw} kW</p>
                  )}
                  {s.notes && <p className="mt-2">{s.notes}</p>}
                  <AuditMeta
                    created_at={s.created_at}
                    updated_at={s.updated_at ?? s.created_at}
                    created_by={s.created_by ?? null}
                    updated_by={s.updated_by ?? null}
                  />
                </div>
                {isAdmin && (
                  <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end">
                    <details className="edit-details">
                      <summary className="edit-details-summary">Modifier</summary>
                      <form
                        action={updateFlexSlot.bind(null, s.id)}
                        className="edit-details-form grid gap-3 sm:grid-cols-2"
                      >
                        <div className="form-field">
                          <label className="form-label">Type</label>
                          <select
                            name="kind"
                            defaultValue={s.kind}
                            className="input-field"
                          >
                            <option value="offer">Offre</option>
                            <option value="need">Besoin</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Statut</label>
                          <select
                            name="status"
                            defaultValue={s.status}
                            className="input-field"
                          >
                            <option value="draft">Brouillon</option>
                            <option value="open">Ouvert</option>
                            <option value="matched">Matché</option>
                          </select>
                        </div>
                        <div className="form-field">
                          <label className="form-label">Début</label>
                          <input
                            type="datetime-local"
                            name="start_at"
                            required
                            defaultValue={toDatetimeLocalValue(s.start_at)}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Fin</label>
                          <input
                            type="datetime-local"
                            name="end_at"
                            required
                            defaultValue={toDatetimeLocalValue(s.end_at)}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field">
                          <label className="form-label">Puissance (kW)</label>
                          <input
                            type="number"
                            name="power_kw"
                            step="0.01"
                            defaultValue={s.power_kw ?? undefined}
                            className="input-field"
                          />
                        </div>
                        <div className="form-field sm:col-span-2">
                          <label className="form-label">Notes</label>
                          <textarea
                            name="notes"
                            rows={2}
                            defaultValue={s.notes ?? ""}
                            className="input-field"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <button type="submit" className="btn-primary px-4 py-2 text-sm">
                            Mettre à jour
                          </button>
                        </div>
                      </form>
                    </details>
                    <form action={deleteFlexSlot.bind(null, s.id)}>
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:underline dark:text-red-400"
                        aria-label={`Supprimer le créneau ${s.kind} ${s.status}`}
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
