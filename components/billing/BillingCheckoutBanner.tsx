"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function BillingCheckoutBanner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const checkout = searchParams.get("checkout");
  const [dismissed, setDismissed] = useState(false);

  const visible = checkout === "success" && !dismissed;

  useEffect(() => {
    if (checkout !== "success") return;
    const hideTimer = window.setTimeout(() => setDismissed(true), 5000);
    const cleanTimer = window.setTimeout(() => {
      router.replace(pathname, { scroll: false });
    }, 5200);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(cleanTimer);
    };
  }, [checkout, pathname, router]);

  if (!visible) return null;

  return (
    <div className="toast-banner" role="status" aria-live="polite">
      Paiement test validé — votre organisation est maintenant sur le plan Pro.
    </div>
  );
}
