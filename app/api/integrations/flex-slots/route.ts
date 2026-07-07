import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  parseFlexSlotIntegrationRequest,
} from "@/lib/integrations/flex-slot";
import {
  insertFlexSlotFromIntegration,
  IntegrationError,
} from "@/lib/integrations/insert-flex-slot";

export async function POST(req: NextRequest) {
  const secret = process.env.GREENOPS_INTEGRATION_SECRET?.trim();
  const provided = req.headers.get("x-greenops-service-key")?.trim();

  if (!secret) {
    return NextResponse.json(
      { error: "Intégration non configurée (GREENOPS_INTEGRATION_SECRET)." },
      { status: 503 },
    );
  }

  if (!provided || provided !== secret) {
    return NextResponse.json({ error: "Clé service invalide." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide." }, { status: 400 });
  }

  const parsed = parseFlexSlotIntegrationRequest(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const result = await insertFlexSlotFromIntegration(parsed.data);
    revalidatePath("/flex");
    revalidatePath("/dashboard");
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    if (err instanceof IntegrationError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : "Erreur serveur.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
