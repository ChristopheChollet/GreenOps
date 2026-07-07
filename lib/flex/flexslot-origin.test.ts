import { describe, expect, it } from "vitest";
import {
  flexSlotActionLabel,
  isFlexSlotOrigin,
} from "@/lib/flex/flexslot-origin";

describe("isFlexSlotOrigin", () => {
  it("detects source flexslot", () => {
    expect(isFlexSlotOrigin({ source: "flexslot" })).toBe(true);
  });

  it("detects recommendation_action", () => {
    expect(isFlexSlotOrigin({ recommendation_action: "consume" })).toBe(true);
  });

  it("detects notes from FlexSlot", () => {
    expect(
      isFlexSlotOrigin({ notes: "Créé via FlexSlot — Consommer (score 72)" }),
    ).toBe(true);
  });

  it("rejects manual slot", () => {
    expect(isFlexSlotOrigin({ source: "manual", notes: "manuel" })).toBe(false);
  });
});

describe("flexSlotActionLabel", () => {
  it("maps consume to Consommer", () => {
    expect(flexSlotActionLabel("consume")).toBe("Consommer");
  });
});
