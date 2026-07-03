import { ScreenshotFrame } from "@/components/ScreenshotFrame";

const shots = [
  {
    src: "/screenshots/dashboard.webp",
    title: "Tableau de bord",
    alt: "Capture du tableau de bord GreenOps : KPI, graphiques et export PDF",
  },
  {
    src: "/screenshots/flex.webp",
    title: "Flexibilité",
    alt: "Capture du module flexibilité : créneaux, édition inline et export CSV",
  },
  {
    src: "/screenshots/registry.webp",
    title: "Registre REC",
    alt: "Capture du registre REC : fiches, volumes MWh et audit",
  },
  {
    src: "/screenshots/equipe.webp",
    title: "Équipe",
    alt: "Capture de la page Équipe : membres et invitations par e-mail",
  },
];

export function ProductShowcase() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-20" aria-labelledby="showcase-heading">
      <div className="motion-fade-up text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-muted">Produit</p>
        <h2 id="showcase-heading" className="mt-2 text-2xl font-semibold tracking-tight text-primary">
          Un parcours ops complet
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-secondary">
          Auth Supabase, CRUD multi-modules, export CSV et tableaux de bord — déployé sur
          Vercel, prêt à être parcouru en démo.
        </p>
      </div>
      <ul className="showcase-grid mt-10">
        {shots.map((shot, index) => (
          <li
            key={shot.src}
            className={`motion-fade-up motion-stagger-${index + 1}`}
          >
            <ScreenshotFrame src={shot.src} alt={shot.alt} priority={index === 0} />
            <p className="mt-3 text-center text-sm font-medium text-secondary">{shot.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
