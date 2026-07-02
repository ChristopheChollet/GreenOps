import { createTextStreamResponse, streamText, toTextStream } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";
import { getSessionOrg } from "@/lib/auth/org";
import { buildOpsSummary, summaryToPrompt } from "@/lib/ai/buildSummary";
import type { FlexSlotInput, RecCertificateInput } from "@/lib/ai/buildSummary";

const SYSTEM_PROMPT =
  "Tu es un analyste opérationnel spécialisé énergie et climat. Tu rédiges des synthèses courtes, factuelles et en français à partir de données agrégées, sans jamais inventer de chiffres. " +
  "Réponds en texte brut uniquement : pas de Markdown, pas d'astérisques, pas de titres avec #, pas de listes à puces avec - ou *. Utilise des phrases et des paragraphes simples, éventuellement des tirets suivis d'un espace pour énumérer si nécessaire.";

export async function POST() {
  const session = await getSessionOrg();
  if (!session) {
    return new Response("Non authentifié.", { status: 401 });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return new Response(
      "Fonctionnalité IA non configurée sur cet environnement (clé GOOGLE_GENERATIVE_AI_API_KEY manquante).",
      { status: 501 },
    );
  }

  const supabase = await createClient();
  const [{ data: flexSlots, error: flexError }, { data: recCertificates, error: recError }] =
    await Promise.all([
      supabase
        .from("flex_slots")
        .select("kind, status, start_at, end_at, power_kw")
        .eq("org_id", session.orgId),
      supabase
        .from("rec_certificates")
        .select("label, period_start, period_end, source, quantity_mwh")
        .eq("org_id", session.orgId),
    ]);

  if (flexError || recError) {
    return new Response("Impossible de récupérer les données de l'organisation.", {
      status: 500,
    });
  }

  const summary = buildOpsSummary(
    (flexSlots ?? []) as FlexSlotInput[],
    (recCertificates ?? []) as RecCertificateInput[],
  );

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: SYSTEM_PROMPT,
    prompt: summaryToPrompt(summary),
    onError({ error }) {
      console.error("[api/report] streamText error:", error);
    },
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
