import { describe, expect, it } from "vitest";
import { recPeriodErrorKey } from "./validate";

describe("recPeriodErrorKey", () => {
  it("returns null when end is on or after start", () => {
    expect(recPeriodErrorKey("2026-01-01", "2026-12-31")).toBeNull();
    expect(recPeriodErrorKey("2026-06-01", "2026-06-01")).toBeNull();
  });

  it("returns rec-period-order when end is before start", () => {
    expect(recPeriodErrorKey("2026-12-31", "2026-01-01")).toBe("rec-period-order");
  });
});
