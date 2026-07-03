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
