import { getSessionOrg } from "@/lib/auth/org";

export async function requireAdmin(): Promise<void> {
  const session = await getSessionOrg();
  if (!session) throw new Error("Non authentifié");
  if (session.role !== "admin") {
    throw new Error("Lecture seule : droits administrateur requis.");
  }
}
