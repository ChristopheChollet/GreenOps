import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: qpError } = await searchParams;

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-8 rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <h1 className="text-2xl font-semibold text-emerald-800 dark:text-emerald-400">
            GreenOps Console
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Connexion par lien magique (email). Configurez Supabase Auth →
            Email.
          </p>
        </div>
        {qpError === "auth" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            Échec de la connexion. Réessayez ou vérifiez la redirection dans
            Supabase.
          </p>
        )}
        <LoginForm />
        <p className="text-center text-sm text-zinc-500">
          <Link href="/" className="hover:underline">
            ← Accueil
          </Link>
        </p>
      </div>
    </div>
  );
}
