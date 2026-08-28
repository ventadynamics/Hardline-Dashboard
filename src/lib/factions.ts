import type { FactionColorToken } from "@/types";

/**
 * Faction colors resolve through CSS variables (--faction-*) so the palette
 * can change centrally. Components receive class names, never hex values.
 */

export const factionText: Record<FactionColorToken, string> = {
  blue: "text-[color:var(--faction-blue)]",
  red: "text-[color:var(--faction-red)]",
  olive: "text-[color:var(--faction-olive)]",
};

export const factionBg: Record<FactionColorToken, string> = {
  blue: "bg-[color:var(--faction-blue)]",
  red: "bg-[color:var(--faction-red)]",
  olive: "bg-[color:var(--faction-olive)]",
};

export const factionVar: Record<FactionColorToken, string> = {
  blue: "var(--faction-blue)",
  red: "var(--faction-red)",
  olive: "var(--faction-olive)",
};
