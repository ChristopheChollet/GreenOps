import { describe, expect, it } from "vitest";
import { buildDashboardPdf } from "./buildDashboardPdf";
import type { DashboardReportData } from "./dashboardReport";

const SAMPLE: DashboardReportData = {
  orgName: "Demo Org",
  generatedAt: new Date("2026-07-03T12:00:00Z"),
  flexTotal: 2,
  flexOpen: 1,
  recTotal: 1,
  totalMwh: 120,
  flexRows: [
    {
      kind: "offer",
      status: "open",
      start_at: "2026-07-03T14:00:00Z",
      end_at: "2026-07-03T16:00:00Z",
      power_kw: 500,
    },
  ],
  recRows: [
    {
      label: "Lot solaire Q2",
      period_start: "2026-04-01",
      period_end: "2026-06-30",
      source: "Parc A",
      quantity_mwh: 120,
    },
  ],
};

describe("buildDashboardPdf", () => {
  it("returns a valid PDF byte stream", async () => {
    const bytes = await buildDashboardPdf(SAMPLE);
    expect(bytes.length).toBeGreaterThan(500);
    const header = new TextDecoder().decode(bytes.slice(0, 5));
    expect(header).toBe("%PDF-");
  });
});
