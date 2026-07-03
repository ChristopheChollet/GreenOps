import { ModuleIcon } from "@/components/ModuleIcon";
import type { ModuleKey } from "@/lib/moduleTheme";
import { moduleTheme } from "@/lib/moduleTheme";

export function PageHeader({
  module,
  eyebrow,
  title,
  description,
  actions,
}: {
  module: ModuleKey;
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  const theme = moduleTheme[module];

  return (
    <header className="module-header">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          <div
            className="module-icon-badge"
            style={{ color: theme.color, backgroundColor: theme.tint }}
          >
            <ModuleIcon module={module} />
          </div>
          <div>
            {eyebrow ? (
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="text-2xl font-semibold text-primary">{title}</h1>
            {description ? (
              <p className="module-header-desc mt-1 max-w-2xl text-sm text-secondary">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
