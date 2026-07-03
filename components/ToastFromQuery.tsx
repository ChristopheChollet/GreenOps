"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MESSAGES: Record<string, string> = {
  "flex-created": "Créneau flex enregistré.",
  "flex-deleted": "Créneau supprimé.",
  "rec-created": "Fiche REC enregistrée.",
  "rec-deleted": "Fiche REC supprimée.",
};

export function ToastFromQuery() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const toastKey = searchParams.get("toast");
  const [visible, setVisible] = useState(false);
  const message = toastKey ? MESSAGES[toastKey] : null;

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const hideTimer = window.setTimeout(() => setVisible(false), 4000);
    const cleanTimer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 4200);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(cleanTimer);
    };
  }, [message, pathname, router]);

  if (!visible || !message) return null;

  return (
    <div className="toast-banner" role="status" aria-live="polite">
      {message}
    </div>
  );
}
