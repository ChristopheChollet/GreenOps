import { describe, expect, it } from "vitest";
import { buildFlexStatusChartData, buildRecSourceChartData } from "./buildChartData";
import type { FlexSlotInput, RecCertificateInput } from "@/lib/ops/types";

describe("buildFlexStatusChartData", () => {
  it("returns all three statuses with zero counts for empty input", () => {
    const rows = buildFlexStatusChartData([]);

    expect(rows).toEqual([
      { status: "draft", statusLabel: "Brouillon", offer: 0, need: 0 },
      { status: "open", statusLabel: "Ouvert", offer: 0, need: 0 },
      { status: "matched", statusLabel: "Apparié", offer: 0, need: 0 },
    ]);
  });

  it("counts offers and needs per status", () => {
    const flexSlots: FlexSlotInput[] = [
      { kind: "offer", status: "open", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 10 },
      { kind: "offer", status: "open", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 10 },
      { kind: "need", status: "open", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 10 },
      { kind: "need", status: "matched", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 10 },
      { kind: "offer", status: "draft", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: null },
    ];

    const rows = buildFlexStatusChartData(flexSlots);

    expect(rows).toEqual([
      { status: "draft", statusLabel: "Brouillon", offer: 1, need: 0 },
      { status: "open", statusLabel: "Ouvert", offer: 2, need: 1 },
      { status: "matched", statusLabel: "Apparié", offer: 0, need: 1 },
    ]);
  });

  it("always returns rows in draft, open, matched order regardless of input order", () => {
    const flexSlots: FlexSlotInput[] = [
      { kind: "offer", status: "matched", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 1 },
      { kind: "offer", status: "draft", start_at: "2026-01-01", end_at: "2026-01-01", power_kw: 1 },
    ];

    const rows = buildFlexStatusChartData(flexSlots);

    expect(rows.map((r) => r.status)).toEqual(["draft", "open", "matched"]);
  });
});

describe("buildRecSourceChartData", () => {
  it("returns an empty array for empty input", () => {
    expect(buildRecSourceChartData([])).toEqual([]);
  });

  it("sums quantity_mwh per distinct source", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: "2026-01-01", period_end: "2026-01-01", source: "Solaire", quantity_mwh: 10 },
      { label: "B", period_start: "2026-01-01", period_end: "2026-01-01", source: "Solaire", quantity_mwh: 5 },
      { label: "C", period_start: "2026-01-01", period_end: "2026-01-01", source: "Éolien", quantity_mwh: 20 },
    ];

    const rows = buildRecSourceChartData(recCertificates);

    expect(rows).toEqual([
      { source: "Éolien", quantityMwh: 20 },
      { source: "Solaire", quantityMwh: 15 },
    ]);
  });

  it("sorts sources by descending volume", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: "2026-01-01", period_end: "2026-01-01", source: "Petit", quantity_mwh: 1 },
      { label: "B", period_start: "2026-01-01", period_end: "2026-01-01", source: "Grand", quantity_mwh: 99 },
    ];

    const rows = buildRecSourceChartData(recCertificates);

    expect(rows.map((r) => r.source)).toEqual(["Grand", "Petit"]);
  });

  it("groups certificates with a missing or blank source under 'Non renseigné'", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: "2026-01-01", period_end: "2026-01-01", source: null, quantity_mwh: 3 },
      { label: "B", period_start: "2026-01-01", period_end: "2026-01-01", source: "  ", quantity_mwh: 2 },
    ];

    const rows = buildRecSourceChartData(recCertificates);

    expect(rows).toEqual([{ source: "Non renseigné", quantityMwh: 5 }]);
  });

  it("treats a null quantity_mwh as zero", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: "2026-01-01", period_end: "2026-01-01", source: "Solaire", quantity_mwh: null },
    ];

    const rows = buildRecSourceChartData(recCertificates);

    expect(rows).toEqual([{ source: "Solaire", quantityMwh: 0 }]);
  });
});
