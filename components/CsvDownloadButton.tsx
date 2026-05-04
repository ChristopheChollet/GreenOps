"use client";

import { useState } from "react";

type Props = {
  label: string;
  filename: string;
  exportFn: () => Promise<string>;
};

export function CsvDownloadButton({ label, filename, exportFn }: Props) {
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setErr(null);
    setPending(true);
    try {
      const csv = await exportFn();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Export impossible");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      >
        {pending ? "Export…" : label}
      </button>
      {err && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{err}</p>
      )}
    </div>
  );
}
