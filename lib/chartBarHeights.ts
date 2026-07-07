/** Normalise des valeurs numériques en hauteurs CSS % pour le mini-chart hero. */
export function valuesToBarHeightPcts(
  values: readonly number[],
  count = 6,
  minPct = 28,
  maxPct = 92,
): string[] {
  const slice = values.filter((v) => Number.isFinite(v)).slice(-count);
  if (slice.length === 0) {
    return Array.from({ length: count }, () => "40%");
  }

  const padded = [...slice];
  while (padded.length < count) {
    padded.unshift(padded[0] ?? 0);
  }

  const min = Math.min(...padded);
  const max = Math.max(...padded);
  const range = max - min || 1;

  return padded.map((v) => {
    const t = (v - min) / range;
    const pct = minPct + t * (maxPct - minPct);
    return `${Math.round(pct)}%`;
  });
}

/** Compte les créations de slots sur les 6 derniers jours (J-5 … aujourd’hui). */
export function countSlotsByLast6Days(createdAtValues: string[]): number[] {
  const buckets = Array.from({ length: 6 }, () => 0);
  const now = Date.now();

  for (const iso of createdAtValues) {
    const ts = new Date(iso).getTime();
    if (Number.isNaN(ts)) continue;
    const dayDiff = Math.floor((now - ts) / (24 * 60 * 60 * 1000));
    if (dayDiff >= 0 && dayDiff < 6) {
      buckets[5 - dayDiff] += 1;
    }
  }

  return buckets;
}
