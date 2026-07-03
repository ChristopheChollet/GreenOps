import { SignOutButton } from "@/components/SignOutButton";
import { NavLinks } from "@/components/NavLinks";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandLockup } from "@/components/GreenOpsLogo";
import { getSessionOrg } from "@/lib/auth/org";

export async function AppNav() {
  const session = await getSessionOrg();
  const roleLabel =
    session?.role === "viewer" ? "Lecture seule" : "Administrateur";

  return (
    <header className="app-nav site-header" role="banner">
      <div className="app-nav-bar site-header-bar mx-auto max-w-5xl px-4">
        <BrandLockup href="/" />
        <div className="app-nav-scroll min-w-0">
          <NavLinks />
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {session && (
            <span className="role-pill hidden sm:inline" title="Rôle dans l’organisation">
              {roleLabel}
            </span>
          )}
          <SignOutButton />
        </div>
        {session && (
          <p className="app-nav-role-mobile text-xs text-muted sm:hidden">
            Rôle : {roleLabel}
          </p>
        )}
      </div>
    </header>
  );
}
