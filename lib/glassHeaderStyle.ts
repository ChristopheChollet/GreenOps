import type { CSSProperties } from "react";

/** Inline blur — Tailwind/Lightning CSS drops unprefixed backdrop-filter in the bundle. */
export const glassHeaderStyle: CSSProperties = {
  WebkitBackdropFilter: "blur(16px) saturate(180%)",
  backdropFilter: "blur(16px) saturate(180%)",
};
