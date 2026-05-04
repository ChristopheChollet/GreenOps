import Link from "next/link";
import { SignOutButton } from "@/components/SignOutButton";

const links = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/flex", label: "Flexibilité" },
  { href: "/registry", label: "Registre REC" },
];

export function AppNav() {
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
        <SignOutButton />
      </div>
    </header>
  );
}
