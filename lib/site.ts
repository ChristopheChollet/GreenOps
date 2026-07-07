const DEFAULT_REPO_URL = "https://github.com/ChristopheChollet/GreenOps";

export function getRepoUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_REPO_URL?.trim();
  return fromEnv || DEFAULT_REPO_URL;
}

export function getDemoUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!url || url.includes("localhost")) return null;
  return url;
}

export function getEcosystemLinks() {
  return {
    gridPulse:
      process.env.NEXT_PUBLIC_GRIDPULSE_DEMO_URL?.trim() ||
      "https://grid-pulse-steel.vercel.app",
    flexSlot:
      process.env.NEXT_PUBLIC_FLEXSLOT_DEMO_URL?.trim() ||
      "https://flex-slot.vercel.app",
  };
}
