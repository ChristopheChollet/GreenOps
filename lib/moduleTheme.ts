export type ModuleKey = "dashboard" | "flex" | "registry" | "team" | "billing" | "alerts";

export const moduleTheme: Record<ModuleKey, { color: string; tint: string }> = {
  dashboard: { color: "#059669", tint: "#ecfdf5" },
  flex: { color: "#0284c7", tint: "#eff6ff" },
  registry: { color: "#d97706", tint: "#fffbeb" },
  team: { color: "#7c3aed", tint: "#f5f3ff" },
  billing: { color: "#db2777", tint: "#fdf2f8" },
  alerts: { color: "#dc2626", tint: "#fef2f2" },
};
