import Link from "next/link";
import { GreenOpsLogo } from "@/components/GreenOpsLogo";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { glassHeaderStyle } from "@/lib/glassHeaderStyle";

export function SiteHeader({ showNav = true }: { showNav?: boolean }) {
  return (
    <header className="site-header" style={glassHeaderStyle} role="banner">
      <div className="site-header-bar mx-auto flex max-w-5xl items-center justify-between gap-4 px-4">
        <Link href="/" className="brand-lockup shrink-0">
          <GreenOpsLogo size="md" />
          <span className="brand-lockup-text">
            <span className="brand-lockup-name">GreenOps</span>
            <span className="brand-lockup-sub">Ops énergie</span>
          </span>
        </Link>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          {showNav ? (
            <div className="header-nav-scroll min-w-0">
              <NavLinks />
            </div>
          ) : null}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
