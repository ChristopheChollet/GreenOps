import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";
import { getSessionOrg } from "@/lib/auth/org";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/flex", label: "Flexibilité" },
  { href: "/registry", label: "Registre REC" },
];

export async function AppNav() {
  const session = await getSessionOrg();
  const roleLabel =
    session?.role === "viewer" ? "Lecture seule" : "Administrateur";

  return (
    <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/dashboard"
          className="font-semibold text-emerald-700 dark:text-emerald-400"
        >
          GreenOps Console
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          {session && (
            <span
              className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-600 dark:border-zinc-700 dark:text-zinc-400"
              title="Rôle dans l’organisation"
            >
              {roleLabel}
            </span>
          )}
          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
