"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ModuleKey } from "@/lib/moduleTheme";
import { moduleTheme } from "@/lib/moduleTheme";

const links: {
  href: string;
  label: string;
  title: string;
  module: ModuleKey;
}[] = [
  { href: "/dashboard", label: "Dashboard", title: "Tableau de bord", module: "dashboard" },
  { href: "/flex", label: "Flexibilité", title: "Flexibilité", module: "flex" },
  { href: "/registry", label: "REC", title: "Registre REC", module: "registry" },
  { href: "/team", label: "Équipe", title: "Équipe", module: "team" },
  { href: "/billing", label: "Facturation", title: "Facturation", module: "billing" },
  { href: "/alerts", label: "Alertes", title: "Meridian Alerts", module: "alerts" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="nav-links" aria-label="Navigation principale">
      {links.map((l) => {
        const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
        const color = moduleTheme[l.module].color;
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`nav-link${active ? " nav-link-active" : ""}`}
            aria-current={active ? "page" : undefined}
            title={l.title}
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
