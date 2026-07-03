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
        className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
      >
        {pending ? "Export…" : label}
      </button>
      {err && (
        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{err}</p>
      )}
    </div>
  );
}
