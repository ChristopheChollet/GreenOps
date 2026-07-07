import { GreenOpsLogo } from "@/components/GreenOpsLogo";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="app-footer mt-auto">
      <div className="app-footer-inner mx-auto flex max-w-5xl flex-col items-center px-4 py-8 text-center">
        <GreenOpsLogo size="sm" showWordmark />
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Action &amp; traçabilité
        </p>
        <p className="mt-4 text-xs text-muted">
          Christophe Chollet · {year}
        </p>
      </div>
    </footer>
  );
}
