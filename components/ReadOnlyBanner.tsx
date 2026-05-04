export function ReadOnlyBanner() {
  return (
    <div
      className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-950 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-100"
      role="status"
    >
      <p className="font-medium">Mode lecture seule</p>
      <p className="mt-1 text-sky-900/85 dark:text-sky-100/85">
        Votre compte a le rôle <strong>viewer</strong> : vous pouvez consulter
        et exporter les données, pas les modifier. Pour tester : dans Supabase
        SQL,{" "}
        <code className="rounded bg-sky-100/80 px-1 text-xs dark:bg-sky-900/80">
          update profiles set role = &apos;viewer&apos; where user_id =
          &apos;…&apos;;
        </code>{" "}
        puis remettre <strong>admin</strong> pour retrouver l’édition.
      </p>
    </div>
  );
}
