import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { SiteHeader } from "@/components/SiteHeader";
import { GreenOpsLogo } from "@/components/GreenOpsLogo";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: qpError } = await searchParams;

  return (
    <div className="app-canvas flex min-h-screen flex-col">
      <SiteHeader ctaHref="/" ctaLabel="Accueil" />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12" id="main-content">
        <div className="login-card w-full max-w-md space-y-8">
          <div className="text-center">
            <GreenOpsLogo size="lg" showWordmark />
            <p className="mt-3 text-sm text-muted">Console · Connexion sécurisée</p>
            <p className="mt-4 text-sm text-secondary">
              Lien magique par email. Configurez Supabase Auth → Email.
            </p>
          </div>
          {qpError === "auth" && (
            <p className="alert-error rounded-md px-3 py-2 text-sm">
              Échec de la connexion. Réessayez ou vérifiez la redirection dans
              Supabase.
            </p>
          )}
          <LoginForm />
          <p className="text-center text-sm text-muted">
            <Link href="/" className="link-accent">
              ← Retour à l&apos;accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
