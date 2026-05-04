export function escapeCsvCell(v: string | number | null | undefined): string {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function rowsToCsv(
  rows: Record<string, unknown>[],
  columns: { key: string; header: string }[],
): string {
  const header = columns.map((c) => escapeCsvCell(c.header)).join(",");
  const lines = [
    header,
    ...rows.map((row) =>
      columns.map((c) => escapeCsvCell(row[c.key] as string | number | null)).join(","),
    ),
  ];
  return `\uFEFF${lines.join("\n")}`;
}
