const flexStatusStyles: Record<string, string> = {
  draft: "status-badge status-badge-neutral",
  open: "status-badge status-badge-ok",
  matched: "status-badge status-badge-info",
};

const flexKindStyles: Record<string, string> = {
  offer: "status-badge status-badge-ok",
  need: "status-badge status-badge-info",
};

export function FlexStatusBadge({ status }: { status: string }) {
  const className = flexStatusStyles[status] ?? "status-badge status-badge-neutral";
  const labels: Record<string, string> = {
    draft: "Brouillon",
    open: "Ouvert",
    matched: "Matché",
  };
  return <span className={className}>{labels[status] ?? status}</span>;
}

export function FlexKindBadge({ kind }: { kind: string }) {
  const className = flexKindStyles[kind] ?? "status-badge status-badge-neutral";
  const labels: Record<string, string> = {
    offer: "Offre",
    need: "Besoin",
  };
  return <span className={className}>{labels[kind] ?? kind}</span>;
}

export function PlanBadge({ plan }: { plan: "free" | "pro" }) {
  const className =
    plan === "pro" ? "status-badge status-badge-ok" : "status-badge status-badge-neutral";
  return <span className={className}>{plan === "pro" ? "Pro" : "Free"}</span>;
}

export function ActivityModuleBadge({ module }: { module: "flex" | "rec" }) {
  return (
    <span
      className={`status-badge ${module === "flex" ? "status-badge-info" : "status-badge-warn"}`}
    >
      {module === "flex" ? "Flex" : "REC"}
    </span>
  );
}
