import type { FactionColorToken } from "@/types";

/**
 * Faction colors resolve through CSS variables (--faction-*) so the palette
 * can change centrally. Components receive class names, never hex values.
 * Raw faction color = LIGHT (rails, fields, bars, big numerals); text under
 * 28px uses the -hi variant.
 */

export const factionText: Record<FactionColorToken, string> = {
  blue: "text-[color:var(--faction-blue)]",
  red: "text-[color:var(--faction-red)]",
  olive: "text-[color:var(--faction-olive)]",
};

export const factionTextHi: Record<FactionColorToken, string> = {
  blue: "text-[color:var(--faction-blue-hi)]",
  red: "text-[color:var(--faction-red-hi)]",
  olive: "text-[color:var(--faction-olive-hi)]",
};

export const factionBg: Record<FactionColorToken, string> = {
  blue: "bg-[color:var(--faction-blue)]",
  red: "bg-[color:var(--faction-red)]",
  olive: "bg-[color:var(--faction-olive)]",
};

export const factionRail: Record<FactionColorToken, string> = {
  blue: "rail-blue",
  red: "rail-red",
  olive: "rail-olive",
};

/**
 * Light field for a faction on a given flank. Blue enters left, red
 * enters right (Light Law); olive takes whichever flank it holds.
 */
export function fieldFor(token: FactionColorToken, side: "l" | "r"): string {
  if (token === "blue") return "field-blue";
  if (token === "red") return "field-red";
  return side === "l" ? "field-olive-l" : "field-olive-r";
}

export const factionVar: Record<FactionColorToken, string> = {
  blue: "var(--faction-blue)",
  red: "var(--faction-red)",
  olive: "var(--faction-olive)",
};
