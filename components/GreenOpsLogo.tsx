import Link from "next/link";

export function GreenOpsLogo({
  size = "md",
  showWordmark = false,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const dim = size === "sm" ? 28 : size === "lg" ? 40 : 32;

  return (
    <span className={`greenops-logo greenops-logo-${size}`}>
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="greenops-logo-mark"
      >
        <rect width="32" height="32" rx="8" fill="#059669" />
        <rect x="7" y="7" width="8" height="10" rx="1.5" fill="white" fillOpacity="0.92" />
        <rect x="17" y="7" width="8" height="6" rx="1.5" fill="white" fillOpacity="0.75" />
        <rect x="17" y="15" width="8" height="10" rx="1.5" fill="white" fillOpacity="0.92" />
        <rect x="7" y="19" width="8" height="6" rx="1.5" fill="white" fillOpacity="0.75" />
        <circle cx="24" cy="8" r="2.5" className="greenops-logo-accent" />
      </svg>
      {showWordmark ? (
        <span className="greenops-logo-wordmark">
          Green<span className="greenops-logo-wordmark-accent">Ops</span>
        </span>
      ) : null}
    </span>
  );
}

export function BrandLockup({ href = "/dashboard" }: { href?: string }) {
  return (
    <Link href={href} className="brand-lockup">
      <GreenOpsLogo size="md" />
      <span className="brand-lockup-text">
        <span className="brand-lockup-name">GreenOps</span>
        <span className="brand-lockup-sub">Ops énergie</span>
      </span>
    </Link>
  );
}
