import { signOut } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-muted hover:text-primary"
      >
        Déconnexion
      </button>
    </form>
  );
}
