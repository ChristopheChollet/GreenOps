import { NextResponse } from "next/server";
import { getSessionOrg } from "@/lib/auth/org";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/billing/client";

export async function POST() {
  const session = await getSessionOrg();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }
  if (session.role !== "admin") {
    return NextResponse.json(
      { error: "Action réservée aux administrateurs." },
      { status: 403 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const url = await createCheckoutSession(session.orgId, user?.email ?? undefined);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
