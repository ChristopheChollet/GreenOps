export type FlexSlotOriginFields = {
  source?: string | null;
  recommendation_action?: string | null;
  notes?: string | null;
};

const ACTION_LABELS: Record<string, string> = {
  consume: "Consommer",
  flex: "Flex",
  defer: "Décaler",
};

export function isFlexSlotOrigin(slot: FlexSlotOriginFields): boolean {
  if (slot.source === "flexslot") return true;
  if (slot.recommendation_action) return true;
  return (slot.notes?.includes("FlexSlot") ?? false) || (slot.notes?.includes("flexslot") ?? false);
}

export function flexSlotActionLabel(action: string | null | undefined): string | null {
  if (!action) return null;
  return ACTION_LABELS[action] ?? action;
}
