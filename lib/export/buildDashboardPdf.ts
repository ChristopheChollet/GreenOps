import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { DashboardReportData } from "./dashboardReport";

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 50;
const LINE = 14;

const KIND_LABELS: Record<string, string> = {
  offer: "Offre",
  need: "Besoin",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  open: "Ouvert",
  matched: "Apparie",
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });
}

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export async function buildDashboardPdf(data: DashboardReportData): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const accent = rgb(0.016, 0.471, 0.341);
  const muted = rgb(0.45, 0.45, 0.45);

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  const ensureSpace = (needed: number) => {
    if (y - needed >= MARGIN) return;
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };

  const drawLine = (text: string, opts?: { bold?: boolean; size?: number; color?: ReturnType<typeof rgb> }) => {
    const size = opts?.size ?? 10;
    ensureSpace(LINE + 4);
    page.drawText(text, {
      x: MARGIN,
      y,
      size,
      font: opts?.bold ? fontBold : font,
      color: opts?.color ?? rgb(0.1, 0.1, 0.1),
    });
    y -= LINE + (opts?.size && opts.size > 11 ? 4 : 0);
  };

  page.drawText("GreenOps", {
    x: MARGIN,
    y,
    size: 20,
    font: fontBold,
    color: accent,
  });
  y -= 26;

  drawLine("Rapport ops — flexibilite & REC", { bold: true, size: 14 });
  y -= 4;
  drawLine(`Organisation : ${truncate(data.orgName, 60)}`, { color: muted });
  drawLine(
    `Genere le ${data.generatedAt.toLocaleString("fr-FR")} — prototype non reglementaire`,
    { size: 9, color: muted },
  );
  if (data.planNote) {
    drawLine(data.planNote, { size: 9, color: muted });
  }
  y -= 8;

  drawLine("Indicateurs", { bold: true, size: 12 });
  drawLine(`Creneaux flex : ${data.flexTotal} (${data.flexOpen} ouvert(s))`);
  drawLine(`Fiches REC : ${data.recTotal} — ${data.totalMwh.toLocaleString("fr-FR")} MWh declares`);
  y -= 8;

  drawLine("Creneaux flex", { bold: true, size: 12 });
  if (data.flexRows.length === 0) {
    drawLine("Aucun creneau.", { color: muted });
  } else {
    for (const row of data.flexRows) {
      ensureSpace(LINE * 2);
      const kind = KIND_LABELS[row.kind] ?? row.kind;
      const status = STATUS_LABELS[row.status] ?? row.status;
      const power =
        row.power_kw != null ? ` — ${row.power_kw} kW` : "";
      drawLine(`${kind} / ${status}${power}`, { bold: true });
      drawLine(`${fmtDate(row.start_at)} -> ${fmtDate(row.end_at)}`, {
        size: 9,
        color: muted,
      });
    }
  }
  y -= 8;

  drawLine("Fiches REC", { bold: true, size: 12 });
  if (data.recRows.length === 0) {
    drawLine("Aucune fiche.", { color: muted });
  } else {
    for (const row of data.recRows) {
      ensureSpace(LINE * 2);
      drawLine(truncate(row.label, 70), { bold: true });
      const source = row.source ? ` — ${row.source}` : "";
      const mwh =
        row.quantity_mwh != null
          ? ` — ${row.quantity_mwh.toLocaleString("fr-FR")} MWh`
          : "";
      drawLine(`${row.period_start} -> ${row.period_end}${source}${mwh}`, {
        size: 9,
        color: muted,
      });
    }
  }

  ensureSpace(30);
  y = MARGIN;
  page.drawText("GreenOps — console SaaS energie & climat", {
    x: MARGIN,
    y,
    size: 8,
    font,
    color: muted,
  });

  return pdf.save();
}
