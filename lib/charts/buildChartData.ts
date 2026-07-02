import type {
  FlexKind,
  FlexSlotInput,
  FlexStatus,
  RecCertificateInput,
} from "@/lib/ai/buildSummary";

export type FlexStatusChartRow = {
  status: FlexStatus;
  statusLabel: string;
  offer: number;
  need: number;
};

export type RecSourceChartRow = {
  source: string;
  quantityMwh: number;
};

const STATUS_ORDER: FlexStatus[] = ["draft", "open", "matched"];
const STATUS_LABELS: Record<FlexStatus, string> = {
  draft: "Brouillon",
  open: "Ouvert",
  matched: "Apparié",
};

const UNSPECIFIED_SOURCE_LABEL = "Non renseigné";

export function buildFlexStatusChartData(
  flexSlots: Pick<FlexSlotInput, "kind" | "status">[],
): FlexStatusChartRow[] {
  const counts: Record<FlexStatus, Record<FlexKind, number>> = {
    draft: { offer: 0, need: 0 },
    open: { offer: 0, need: 0 },
    matched: { offer: 0, need: 0 },
  };

  for (const slot of flexSlots) {
    counts[slot.status][slot.kind] += 1;
  }

  return STATUS_ORDER.map((status) => ({
    status,
    statusLabel: STATUS_LABELS[status],
    offer: counts[status].offer,
    need: counts[status].need,
  }));
}

export function buildRecSourceChartData(
  recCertificates: Pick<RecCertificateInput, "source" | "quantity_mwh">[],
): RecSourceChartRow[] {
  const totals = new Map<string, number>();

  for (const cert of recCertificates) {
    const source = cert.source?.trim() || UNSPECIFIED_SOURCE_LABEL;
    totals.set(source, (totals.get(source) ?? 0) + (cert.quantity_mwh ?? 0));
  }

  return Array.from(totals, ([source, quantityMwh]) => ({
    source,
    quantityMwh,
  })).sort((a, b) => b.quantityMwh - a.quantityMwh);
}
