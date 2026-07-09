import Link from "next/link";
import { moduleTheme } from "@/lib/moduleTheme";

export type FlexFilterKey = "all" | "open" | "draft" | "flexslot";

const FILTERS: { key: FlexFilterKey; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "open", label: "Ouvert" },
  { key: "draft", label: "Brouillon" },
  { key: "flexslot", label: "Origine FlexSlot" },
];

export function FlexFilters({ active }: { active: FlexFilterKey }) {
  const color = moduleTheme.flex.color;

  return (
    <nav className="filter-pills" aria-label="Filtrer les créneaux">
      {FILTERS.map((filter) => {
        const isActive = filter.key === active;
        const href = filter.key === "all" ? "/flex" : `/flex?filter=${filter.key}`;
        return (
          <Link
            key={filter.key}
            href={href}
            className={`filter-pill${isActive ? " filter-pill-active" : ""}`}
            style={isActive ? { backgroundColor: color } : undefined}
            aria-current={isActive ? "true" : undefined}
          >
            {filter.label}
          </Link>
        );
      })}
    </nav>
  );
}
