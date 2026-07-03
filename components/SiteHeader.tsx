import Link from "next/link";
import { GreenOpsLogo } from "@/components/GreenOpsLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader({
  ctaHref = "/login",
  ctaLabel = "Connexion",
}: {
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <header className="site-header" role="banner">
      <div className="site-header-bar mx-auto flex max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="brand-lockup-min">
          <GreenOpsLogo size="md" showWordmark />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href={ctaHref} className="btn-primary px-4 py-2 text-sm">
            {ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
