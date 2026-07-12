"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  "flex-created": "Créneau flex enregistré.",
  "flex-updated": "Créneau flex mis à jour.",
  "flex-deleted": "Créneau supprimé.",
  "rec-created": "Fiche REC enregistrée.",
  "rec-updated": "Fiche REC mise à jour.",
  "rec-deleted": "Fiche REC supprimée.",
  "invite-created": "Invitation enregistrée.",
  "invite-cancelled": "Invitation annulée.",
  "org-updated": "Nom de l’organisation mis à jour.",
};

export function ToastFromQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const toastKey = searchParams.get("toast");
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const message = toastKey ? MESSAGES[toastKey] : null;
  const visible = Boolean(message && dismissedKey !== toastKey);

  useEffect(() => {
    if (!message || !toastKey) return;
    const hideTimer = window.setTimeout(() => setDismissedKey(toastKey), 4000);
    const cleanTimer = window.setTimeout(() => {
      router.replace(`${pathname}${window.location.hash}`, { scroll: false });
    }, 4200);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(cleanTimer);
    };
  }, [message, toastKey, pathname, router]);

  if (!visible || !message) return null;

  return (
    <div className="toast-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
}
