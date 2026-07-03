export function ReadOnlyBanner() {
  return (
    <div className="notice-banner notice-banner-info" role="status">
      <p className="notice-banner-title">Mode lecture seule</p>
      <p className="notice-banner-body">
        Votre compte a le rôle <strong>viewer</strong> : vous pouvez consulter
        et exporter les données, pas les modifier. Pour tester : dans Supabase
        SQL,{" "}
        <code className="notice-code">
          update profiles set role = &apos;viewer&apos; where user_id =
          &apos;…&apos;;
        </code>{" "}
        puis remettre <strong>admin</strong> pour retrouver l’édition.
      </p>
    </div>
  );
}
