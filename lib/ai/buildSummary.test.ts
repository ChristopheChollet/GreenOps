import { describe, expect, it } from "vitest";
import {
  buildOpsSummary,
  summaryToPrompt,
  type FlexSlotInput,
  type RecCertificateInput,
} from "./buildSummary";

const NOW = new Date("2026-07-02T12:00:00.000Z");

function daysAgo(days: number): string {
  return new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
}

describe("buildOpsSummary", () => {
  it("returns all-zero aggregates for empty input", () => {
    const summary = buildOpsSummary([], [], NOW);

    expect(summary.flex).toEqual({
      total: 0,
      byKind: { offer: 0, need: 0 },
      byStatus: { draft: 0, open: 0, matched: 0 },
      totalPowerKw: 0,
      recentCount: 0,
    });
    expect(summary.rec).toEqual({
      total: 0,
      totalQuantityMwh: 0,
      sourceCount: 0,
      recentCount: 0,
    });
  });

  it("aggregates flex slots by kind, status and power", () => {
    const flexSlots: FlexSlotInput[] = [
      { kind: "offer", status: "open", start_at: daysAgo(1), end_at: daysAgo(1), power_kw: 100 },
      { kind: "offer", status: "matched", start_at: daysAgo(1), end_at: daysAgo(1), power_kw: 50 },
      { kind: "need", status: "draft", start_at: daysAgo(1), end_at: daysAgo(1), power_kw: null },
    ];

    const summary = buildOpsSummary(flexSlots, [], NOW);

    expect(summary.flex.total).toBe(3);
    expect(summary.flex.byKind).toEqual({ offer: 2, need: 1 });
    expect(summary.flex.byStatus).toEqual({ draft: 1, open: 1, matched: 1 });
    expect(summary.flex.totalPowerKw).toBe(150);
  });

  it("counts only flex slots created within the last 7 days as recent", () => {
    const flexSlots: FlexSlotInput[] = [
      { kind: "offer", status: "open", start_at: daysAgo(2), end_at: daysAgo(2), power_kw: 10 },
      { kind: "offer", status: "open", start_at: daysAgo(30), end_at: daysAgo(30), power_kw: 10 },
    ];

    const summary = buildOpsSummary(flexSlots, [], NOW);

    expect(summary.flex.recentCount).toBe(1);
  });

  it("aggregates REC certificates by quantity and distinct sources", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: daysAgo(1), period_end: daysAgo(1), source: "Solaire", quantity_mwh: 10 },
      { label: "B", period_start: daysAgo(1), period_end: daysAgo(1), source: "Solaire", quantity_mwh: 5 },
      { label: "C", period_start: daysAgo(1), period_end: daysAgo(1), source: "Éolien", quantity_mwh: null },
    ];

    const summary = buildOpsSummary([], recCertificates, NOW);

    expect(summary.rec.total).toBe(3);
    expect(summary.rec.totalQuantityMwh).toBe(15);
    expect(summary.rec.sourceCount).toBe(2);
  });

  it("ignores REC certificates with a missing source when counting distinct sources", () => {
    const recCertificates: RecCertificateInput[] = [
      { label: "A", period_start: daysAgo(1), period_end: daysAgo(1), source: null, quantity_mwh: 1 },
    ];

    const summary = buildOpsSummary([], recCertificates, NOW);

    expect(summary.rec.sourceCount).toBe(0);
  });
});

describe("summaryToPrompt", () => {
  it("includes the key aggregate figures in the generated prompt", () => {
    const summary = buildOpsSummary(
      [{ kind: "offer", status: "open", start_at: daysAgo(1), end_at: daysAgo(1), power_kw: 200 }],
      [{ label: "A", period_start: daysAgo(1), period_end: daysAgo(1), source: "Solaire", quantity_mwh: 42 }],
      NOW,
    );

    const prompt = summaryToPrompt(summary);

    expect(prompt).toContain("1 créneau(x)");
    expect(prompt).toContain("200 kW");
    expect(prompt).toContain("1 fiche(s)");
    expect(prompt).toContain("42 MWh");
  });

  it("never includes free-text fields since they are not part of the summary type", () => {
    const summary = buildOpsSummary([], [], NOW);
    const prompt = summaryToPrompt(summary);

    expect(prompt).not.toContain("notes");
    expect(prompt).not.toContain("document_url");
  });
});
