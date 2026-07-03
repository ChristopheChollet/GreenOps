"use client";

import { useTheme } from "next-themes";
import { useIsClient } from "@/lib/useIsClient";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return <span className="btn-ghost h-9 w-9 shrink-0" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      className="btn-ghost h-9 w-9 shrink-0 text-base leading-none"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Mode clair" : "Mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? "☀" : "☾"}
    </button>
  );
}
