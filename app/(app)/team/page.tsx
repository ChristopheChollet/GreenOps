import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { Suspense } from "react";
import {
  cancelOrgInvitation,
  createOrgInvitation,
} from "@/lib/team/actions";
import { FormErrorFromQuery } from "@/components/FormErrorFromQuery";
import { ReadOnlyBanner } from "@/components/ReadOnlyBanner";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";

type MemberRow = {
  user_id: string;
  role: string;
  email: string;
  member_since: string;
};

type InviteRow = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

const TEAM_ERRORS: Record<string, string> = {
  "invite-invalid": "Adresse e-mail invalide.",
  "invite-member": "Cette personne fait déjà partie de l’organisation.",
  "invite-pending": "Une invitation est déjà en attente pour cette adresse.",
  "invite-save": "Impossible d’enregistrer l’invitation. Réessayez.",
};

export default async function TeamPage() {
  const session = await getSessionOrg();
  const orgId = session?.orgId;
  const isAdmin = session?.role === "admin";
  const supabase = await createClient();

  if (!orgId) {
    return <p className="text-zinc-600">Organisation introuvable.</p>;
  }

  const [{ data: members }, { data: invites }] = await Promise.all([
    supabase.rpc("list_org_members"),
    supabase
      .from("org_invitations")
      .select("id, email, role, created_at")
      .eq("org_id", orgId)
      .is("accepted_at", null)
      .order("created_at", { ascending: false }),
  ]);

  const memberRows = (members ?? []) as MemberRow[];
  const inviteRows = (invites ?? []) as InviteRow[];

  return (
    <div className="space-y-8">
      <PageHeader
        module="dashboard"
        eyebrow="Organisation"
        title="Équipe"
        description="Membres et invitations — les invités rejoignent l’organisation à leur première connexion (magic link)."
      />

      {session?.role === "viewer" && <ReadOnlyBanner />}

      {isAdmin && (
        <section className="section-card">
          <Suspense fallback={null}>
            <FormErrorFromQuery customMessages={TEAM_ERRORS} />
          </Suspense>
          <h2 className="text-lg font-medium text-primary">Inviter un collègue</h2>
          <p className="mt-1 text-xs text-muted">
            L’adresse ne doit pas déjà avoir de compte GreenOps — sinon créez un
            compte test avec une autre adresse.
          </p>
          <form
            action={createOrgInvitation}
            className="mt-4 flex flex-wrap items-end gap-4"
          >
            <div className="form-field min-w-[14rem] flex-1">
              <label className="form-label" htmlFor="invite-email">
                E-mail
              </label>
              <input
                id="invite-email"
                type="email"
                name="email"
                required
                placeholder="collegue@exemple.com"
                className="input-field"
              />
            </div>
            <div className="form-field min-w-[10rem]">
              <label className="form-label" htmlFor="invite-role">
                Rôle
              </label>
              <select id="invite-role" name="role" className="input-field">
                <option value="viewer">Lecture seule</option>
                <option value="admin">Administrateur</option>
              </select>
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm">
              Envoyer l’invitation
            </button>
          </form>
        </section>
      )}

      <section>
        <h2 className="text-lg font-medium text-primary">
          Membres ({memberRows.length})
        </h2>
        {memberRows.length === 0 ? (
          <EmptyState
            module="dashboard"
            title="Aucun membre"
            description="Impossible de charger la liste des membres."
          />
        ) : (
          <ul className="activity-list mt-3">
            {memberRows.map((m) => (
              <li key={m.user_id} className="activity-item">
                <span className="activity-item-label">
                  <span>{m.email}</span>
                  <span className="role-pill ml-2">
                    {m.role === "viewer" ? "Lecture seule" : "Administrateur"}
                  </span>
                </span>
                <time className="shrink-0 text-xs text-muted" dateTime={m.member_since}>
                  Depuis {new Date(m.member_since).toLocaleDateString("fr-FR")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isAdmin && (
        <section>
          <h2 className="text-lg font-medium text-primary">
            Invitations en attente ({inviteRows.length})
          </h2>
          {inviteRows.length === 0 ? (
            <p className="mt-3 text-sm text-muted">Aucune invitation en cours.</p>
          ) : (
            <ul className="activity-list mt-3">
              {inviteRows.map((inv) => (
                <li key={inv.id} className="activity-item">
                  <span className="activity-item-label">
                    <span>{inv.email}</span>
                    <span className="role-pill ml-2">
                      {inv.role === "viewer" ? "Lecture seule" : "Administrateur"}
                    </span>
                  </span>
                  <form action={cancelOrgInvitation.bind(null, inv.id)}>
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline dark:text-red-400"
                    >
                      Annuler
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
