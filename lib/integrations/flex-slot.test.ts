import { describe, expect, it } from "vitest";
import {
  assertIntegrationOrgAllowed,
  parseFlexSlotIntegrationRequest,
} from "@/lib/integrations/flex-slot";

describe("parseFlexSlotIntegrationRequest", () => {
  it("accepts a valid payload", () => {
    const result = parseFlexSlotIntegrationRequest({
      org_id: "11111111-1111-1111-1111-111111111111",
      kind: "need",
      start_at: "2026-07-07T10:00:00.000Z",
      end_at: "2026-07-07T16:00:00.000Z",
      notes: "Créé via FlexSlot",
      recommendation: {
        source: "flexslot",
        action: "consume",
        gridpulse_score: 78.2,
        window_start: "2026-07-07T10:00:00.000Z",
        window_end: "2026-07-07T16:00:00.000Z",
        avg_carbon_gco2_kwh: 42.5,
      },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.kind).toBe("need");
      expect(result.data.recommendation.action).toBe("consume");
    }
  });

  it("rejects invalid kind", () => {
    const result = parseFlexSlotIntegrationRequest({
      org_id: "11111111-1111-1111-1111-111111111111",
      kind: "invalid",
      start_at: "2026-07-07T10:00:00.000Z",
      end_at: "2026-07-07T16:00:00.000Z",
      recommendation: {
        source: "flexslot",
        action: "flex",
        gridpulse_score: 50,
        window_start: "2026-07-07T10:00:00.000Z",
        window_end: "2026-07-07T16:00:00.000Z",
        avg_carbon_gco2_kwh: 80,
      },
    });
    expect(result.ok).toBe(false);
  });
});

describe("assertIntegrationOrgAllowed", () => {
  it("allows any org when demo org env is unset", () => {
    delete process.env.GREENOPS_INTEGRATION_DEMO_ORG_ID;
    expect(assertIntegrationOrgAllowed("11111111-1111-1111-1111-111111111111")).toBeNull();
  });

  it("restricts org when demo org env is set", () => {
    process.env.GREENOPS_INTEGRATION_DEMO_ORG_ID =
      "22222222-2222-2222-2222-222222222222";
    expect(assertIntegrationOrgAllowed("11111111-1111-1111-1111-111111111111")).toMatch(
      /non autorisé/,
    );
    expect(
      assertIntegrationOrgAllowed("22222222-2222-2222-2222-222222222222"),
    ).toBeNull();
    delete process.env.GREENOPS_INTEGRATION_DEMO_ORG_ID;
  });
});
