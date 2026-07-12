import { describe, expect, it } from "vitest";
import { deriveOnboardingStatus } from "./status";

describe("deriveOnboardingStatus", () => {
  it("marks incomplete when all steps are pending", () => {
    const status = deriveOnboardingStatus({
      orgName: "My organization",
      inviteCount: 0,
      memberCount: 1,
      flexSlotCount: 0,
    });

    expect(status.orgNamed).toBe(false);
    expect(status.inviteSent).toBe(false);
    expect(status.hasFlexSlot).toBe(false);
    expect(status.complete).toBe(false);
  });

  it("marks invite step done when a pending invite exists", () => {
    const status = deriveOnboardingStatus({
      orgName: "Meridian Ops",
      inviteCount: 1,
      memberCount: 1,
      flexSlotCount: 0,
    });

    expect(status.orgNamed).toBe(true);
    expect(status.inviteSent).toBe(true);
    expect(status.complete).toBe(false);
  });

  it("marks complete when org, invite and flex slot are done", () => {
    const status = deriveOnboardingStatus({
      orgName: "Meridian Ops",
      inviteCount: 0,
      memberCount: 2,
      flexSlotCount: 1,
    });

    expect(status.complete).toBe(true);
  });
});
