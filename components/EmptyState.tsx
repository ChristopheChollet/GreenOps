import Link from "next/link";
import { ModuleIcon } from "@/components/ModuleIcon";
import type { ModuleKey } from "@/lib/moduleTheme";
import { moduleTheme } from "@/lib/moduleTheme";

export function EmptyState({
  module,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  module?: ModuleKey;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  const theme = moduleTheme[module ?? "dashboard"];

  return (
    <div className="empty-state">
      <div
        className="empty-state-icon"
        style={{ color: theme.color, backgroundColor: theme.tint }}
        aria-hidden
      >
        <ModuleIcon module={module ?? "dashboard"} size={26} />
      </div>
      <p className="empty-state-title">{title}</p>
      <p className="empty-state-desc">{description}</p>
      {actionHref && actionLabel ? (
        <Link href={actionHref} className="empty-state-action link-accent">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
