export function recPeriodErrorKey(
  periodStart: string,
  periodEnd: string,
): "rec-period-order" | null {
  if (!periodStart || !periodEnd) return null;
  if (periodEnd < periodStart) return "rec-period-order";
  return null;
}
