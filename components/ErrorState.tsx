import Link from "next/link";

export function ErrorState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="empty-state error-state">
      <div className="empty-state-icon error-state-icon" aria-hidden>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4M12 16.5h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.28 2.25h17.8a1.5 1.5 0 0 0 1.28-2.25L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
