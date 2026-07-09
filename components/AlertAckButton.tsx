"use client";

import { useTransition } from "react";
import { acknowledgeAlert } from "@/lib/alerts/actions";

export function AlertAckButton({ alertId }: { alertId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        startTransition(() => {
          void acknowledgeAlert(alertId);
        })
      }
      className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
    >
      {isPending ? "…" : "Marquer traité"}
    </button>
  );
}
