"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MESSAGES: Record<string, string> = {
  "flex-time-order":
    "La date de fin doit être postérieure à la date de début (règle métier du créneau).",
  "flex-invalid-dates": "Dates invalides. Vérifiez le début et la fin du créneau.",
  "flex-save": "Impossible d’enregistrer le créneau. Réessayez.",
  "rec-period-order":
    "La fin de période doit être postérieure ou égale au début.",
  "rec-save": "Impossible d’enregistrer la fiche REC. Réessayez.",
};

export function FormErrorFromQuery({
  customMessages,
}: {
  customMessages?: Record<string, string>;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const errorKey = searchParams.get("error");
  const messages = { ...MESSAGES, ...customMessages };
  const message = errorKey ? messages[errorKey] : null;

  useEffect(() => {
    if (!message) return;
    const cleanTimer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 8000);
    return () => window.clearTimeout(cleanTimer);
  }, [message, pathname, router]);

  if (!message) return null;

  return (
    <div className="alert-error mb-4" role="alert">
      {message}
    </div>
  );
}
