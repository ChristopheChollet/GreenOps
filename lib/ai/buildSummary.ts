export type FlexKind = "offer" | "need";
export type FlexStatus = "draft" | "open" | "matched";

export type FlexSlotInput = {
  kind: FlexKind;
  status: FlexStatus;
  start_at: string;
  end_at: string;
  power_kw: number | null;
};

export type RecCertificateInput = {
  label: string;
  period_start: string;
  period_end: string;
  source: string | null;
  quantity_mwh: number | null;
};

export type OpsSummary = {
  generatedAt: string;
  flex: {
    total: number;
    byKind: Record<FlexKind, number>;
    byStatus: Record<FlexStatus, number>;
    totalPowerKw: number;
    recentCount: number;
  };
  rec: {
    total: number;
    totalQuantityMwh: number;
    sourceCount: number;
    recentCount: number;
  };
};

const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

function isRecent(dateStr: string, now: number): boolean {
  const t = new Date(dateStr).getTime();
  return Number.isFinite(t) && now - t <= RECENT_WINDOW_MS && t <= now;
}

export function buildOpsSummary(
  flexSlots: FlexSlotInput[],
  recCertificates: RecCertificateInput[],
  now: Date = new Date(),
): OpsSummary {
  const nowMs = now.getTime();

  const byKind: Record<FlexKind, number> = { offer: 0, need: 0 };
  const byStatus: Record<FlexStatus, number> = {
    draft: 0,
    open: 0,
    matched: 0,
  };
  let totalPowerKw = 0;
  let flexRecentCount = 0;

  for (const slot of flexSlots) {
    byKind[slot.kind] += 1;
    byStatus[slot.status] += 1;
    totalPowerKw += slot.power_kw ?? 0;
    if (isRecent(slot.start_at, nowMs)) flexRecentCount += 1;
  }

  const sources = new Set<string>();
  let totalQuantityMwh = 0;
  let recRecentCount = 0;

  for (const cert of recCertificates) {
    if (cert.source) sources.add(cert.source);
    totalQuantityMwh += cert.quantity_mwh ?? 0;
    if (isRecent(cert.period_start, nowMs)) recRecentCount += 1;
  }

  return {
    generatedAt: now.toISOString(),
    flex: {
      total: flexSlots.length,
      byKind,
      byStatus,
      totalPowerKw,
      recentCount: flexRecentCount,
    },
    rec: {
      total: recCertificates.length,
      totalQuantityMwh,
      sourceCount: sources.size,
      recentCount: recRecentCount,
    },
  };
}

// Only aggregate numbers are sent to the LLM — never free-text fields like
// `notes` or `document_url` — to keep the third-party API call minimal and
// avoid leaking user-entered content.
export function summaryToPrompt(summary: OpsSummary): string {
  const { flex, rec } = summary;

  return [
    "Voici les données agrégées d'une organisation sur une console de pilotage énergie/climat (démo pédagogique, non réglementaire).",
    "",
    "Flexibilité (créneaux offre/besoin pour l'équilibrage réseau) :",
    `- Total : ${flex.total} créneau(x)`,
    `- Par type : ${flex.byKind.offer} offre(s), ${flex.byKind.need} besoin(s)`,
    `- Par statut : ${flex.byStatus.draft} brouillon(s), ${flex.byStatus.open} ouvert(s), ${flex.byStatus.matched} apparié(s)`,
    `- Puissance cumulée : ${flex.totalPowerKw} kW`,
    `- Créés dans les 7 derniers jours : ${flex.recentCount}`,
    "",
    "Registre REC (certificats d'énergie renouvelable) :",
    `- Total : ${rec.total} fiche(s)`,
    `- Volume cumulé : ${rec.totalQuantityMwh} MWh`,
    `- Nombre de sources distinctes : ${rec.sourceCount}`,
    `- Créées dans les 7 derniers jours : ${rec.recentCount}`,
    "",
    "Rédige un résumé exécutif en français, factuel et concis (2 à 3 courts paragraphes ou une liste à puces), à destination d'un responsable d'exploitation. Base-toi uniquement sur les chiffres fournis ci-dessus, n'invente aucune donnée. S'il n'y a aucune donnée, dis-le simplement et invite à créer un premier créneau ou une première fiche REC.",
  ].join("\n");
}
