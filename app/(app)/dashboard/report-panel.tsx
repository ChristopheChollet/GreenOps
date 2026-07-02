"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

// Belt-and-suspenders: the system prompt asks the model for plain text, but
// LLMs don't always follow formatting instructions perfectly. Strip common
// Markdown artifacts so stray "**" or "#" never leak into the UI.
function stripMarkdownArtifacts(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/^[*-]\s+/gm, "- ");
}

export function ReportPanel() {
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function generateReport() {
    setStatus("loading");
    setReport("");
    setErrorMessage("");

    try {
      const res = await fetch("/api/report", { method: "POST" });

      if (!res.ok || !res.body) {
        const message = await res.text().catch(() => "");
        setErrorMessage(
          message || "Impossible de générer le rapport pour le moment.",
        );
        setStatus("error");
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setReport(accumulated);
      }

      if (!accumulated.trim()) {
        setErrorMessage(
          "Le rapport généré est vide. Réessaie dans quelques instants.",
        );
        setStatus("error");
        return;
      }

      setStatus("done");
    } catch {
      setErrorMessage(
        "Une erreur est survenue pendant la génération du rapport.",
      );
      setStatus("error");
    }
  }

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Rapport IA
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Synthèse générée par IA à partir des créneaux flex et fiches REC
            de l’organisation (aucune donnée en texte libre n’est transmise).
          </p>
        </div>
        <button
          type="button"
          onClick={generateReport}
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-600 dark:hover:bg-emerald-700"
        >
          {status === "loading" ? "Génération…" : "Générer le rapport"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {report && (
        <div className="mt-4 whitespace-pre-wrap rounded-lg bg-zinc-50 p-4 text-sm leading-relaxed text-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-200">
          {stripMarkdownArtifacts(report)}
        </div>
      )}
    </section>
  );
}
