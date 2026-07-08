"use client";

import { useState } from "react";

type Props = {
  label: string;
  endpoint: "/api/billing/checkout" | "/api/billing/portal";
};

export function BillingActionButton({ label, endpoint }: Props) {
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onClick() {
    setErr(null);
    setPending(true);
    try {
      const res = await fetch(endpoint, { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Action impossible.");
      }
      window.location.href = data.url;
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action impossible.");
      setPending(false);
    }
  }

  return (
    <div className="inline-block">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Redirection…" : label}
      </button>
      {err && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{err}</p>}
    </div>
  );
}
