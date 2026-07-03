"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ModuleKey } from "@/lib/moduleTheme";
import { moduleTheme } from "@/lib/moduleTheme";

const links: { href: string; label: string; module: ModuleKey }[] = [
  { href: "/dashboard", label: "Tableau de bord", module: "dashboard" },
  { href: "/flex", label: "Flexibilité", module: "flex" },
  { href: "/registry", label: "Registre REC", module: "registry" },
  { href: "/team", label: "Équipe", module: "dashboard" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 text-sm" aria-label="Navigation principale">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        const color = moduleTheme[l.module].color;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link${active ? " nav-link-active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span
              className="nav-dot"
              style={{ backgroundColor: color }}
              aria-hidden
            />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
