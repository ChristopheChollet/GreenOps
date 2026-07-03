export type ModuleKey = "dashboard" | "flex" | "registry";

export const moduleTheme: Record<ModuleKey, { color: string; tint: string }> = {
  dashboard: { color: "#059669", tint: "#ecfdf5" },
  flex: { color: "#0284c7", tint: "#eff6ff" },
  registry: { color: "#d97706", tint: "#fffbeb" },
};
