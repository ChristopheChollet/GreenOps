import { describe, expect, it } from "vitest";
import { flexSlotTimeErrorKey } from "./validate";

describe("flexSlotTimeErrorKey", () => {
  it("returns null when end is after start", () => {
    expect(
      flexSlotTimeErrorKey("2026-07-03T14:00", "2026-07-03T16:00"),
    ).toBeNull();
  });

  it("returns flex-time-order when end equals start", () => {
    expect(
      flexSlotTimeErrorKey("2026-07-03T14:00", "2026-07-03T14:00"),
    ).toBe("flex-time-order");
  });

  it("returns flex-time-order when end is before start", () => {
    expect(
      flexSlotTimeErrorKey("2026-07-03T16:00", "2026-07-03T14:00"),
    ).toBe("flex-time-order");
  });
});
