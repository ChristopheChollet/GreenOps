export function PedagogyNote({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <aside
      className="rounded-lg border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100"
      role="note"
    >
      <p className="font-medium text-amber-900 dark:text-amber-200">{title}</p>
      <div className="mt-2 space-y-2 text-amber-900/90 dark:text-amber-100/90">
        {children}
      </div>
    </aside>
  );
}
