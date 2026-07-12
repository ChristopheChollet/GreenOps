"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OnboardingStatus } from "@/lib/onboarding/status";

const DISMISS_KEY = "greenops-onboarding-dismissed";

type Step = {
  id: "org" | "invite" | "flex";
  label: string;
  description: string;
  href: string;
  done: boolean;
};

export function OnboardingChecklist({ status }: { status: OnboardingStatus }) {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (searchParams.get("tour") === "1") return null;

  if (status.complete || dismissed) return null;

  const steps: Step[] = [
    {
      id: "org",
      label: "Nommer l’organisation",
      description: "Remplacez le nom par défaut sur la page Équipe.",
      href: "/team#org-name",
      done: status.orgNamed,
    },
    {
      id: "invite",
      label: "Inviter un collègue",
      description: "Ajoutez une invitation — elle sera acceptée à la première connexion.",
      href: "/team#invite",
      done: status.inviteSent,
    },
    {
      id: "flex",
      label: "Créer un créneau flex",
      description: "Enregistrez votre premier créneau pour alimenter le tableau de bord.",
      href: "/flex",
      done: status.hasFlexSlot,
    },
  ];

  const doneCount = steps.filter((step) => step.done).length;
  const nextStep = steps.find((step) => !step.done);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <section className="onboarding-card" aria-labelledby="onboarding-title">
      <div className="onboarding-header">
        <div>
          <p className="onboarding-eyebrow">Premiers pas</p>
          <h2 id="onboarding-title" className="onboarding-title">
            Configurez votre espace GreenOps
          </h2>
          <p className="onboarding-desc">
            {doneCount}/{steps.length} étapes — parcours démo Meridian en ~2 minutes.
          </p>
        </div>
        <button type="button" onClick={dismiss} className="onboarding-dismiss">
          Masquer
        </button>
      </div>

      <ol className="onboarding-steps">
        {steps.map((step, index) => {
          const isCurrent = nextStep?.id === step.id;

          return (
            <li
              key={step.id}
              className={`onboarding-step${step.done ? " onboarding-step-done" : ""}${isCurrent ? " onboarding-step-current" : ""}`}
            >
              <span className="onboarding-step-index" aria-hidden>
                {step.done ? "✓" : index + 1}
              </span>
              <div className="onboarding-step-body">
                <p className="onboarding-step-label">{step.label}</p>
                <p className="onboarding-step-desc">{step.description}</p>
                {!step.done && isCurrent ? (
                  <Link href={step.href} className="onboarding-step-action link-accent">
                    Faire maintenant
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
