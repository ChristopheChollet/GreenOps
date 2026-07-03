export function flexSlotTimeErrorKey(
  startAt: string,
  endAt: string,
): "flex-invalid-dates" | "flex-time-order" | null {
  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "flex-invalid-dates";
  }
  if (end <= start) {
    return "flex-time-order";
  }
  return null;
}
