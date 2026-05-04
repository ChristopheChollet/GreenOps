function shortId(id: string | null | undefined) {
  if (!id) return null;
  return `${id.slice(0, 8)}…`;
}

export function AuditMeta({
  created_at,
  updated_at,
  created_by,
  updated_by,
}: {
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}) {
  const created = new Date(created_at).getTime();
  const updated = new Date(updated_at).getTime();
  const wasEdited = updated - created > 2000;

  return (
    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
      Créé {new Date(created_at).toLocaleString("fr-FR")}
      {shortId(created_by) && (
        <span className="tabular-nums"> · id {shortId(created_by)}</span>
      )}
      {wasEdited && (
        <>
          {" "}
          · Modifié {new Date(updated_at).toLocaleString("fr-FR")}
          {shortId(updated_by) && (
            <span className="tabular-nums"> · id {shortId(updated_by)}</span>
          )}
        </>
      )}
    </p>
  );
}
