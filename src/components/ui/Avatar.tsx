import type { ReactElement } from "react";
import { hashCode } from "@/lib/rng";
import { factionVar } from "@/lib/factions";
import type { FactionColorToken } from "@/types";

/**
 * Unit patch: 0-radius tile on a carbon core with a faction rail, a
 * 2-letter callsign monogram and one of 8 insignia glyphs derived from
 * the id. Replaced by real avatars when the API arrives.
 */

const GLYPHS: ((c: string) => ReactElement)[] = [
  // chevron
  (c) => <path d="M10 20 L16 13 L22 20" fill="none" stroke={c} strokeWidth="1.5" />,
  // double chevron
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      <path d="M10 17 L16 11 L22 17" />
      <path d="M10 22 L16 16 L22 22" />
    </g>
  ),
  // wedge
  (c) => <path d="M16 11 L23 21 H9 Z" fill="none" stroke={c} strokeWidth="1.5" />,
  // bar stack
  (c) => (
    <g stroke={c} strokeWidth="1.5">
      <path d="M10 13h12" />
      <path d="M10 17h12" />
      <path d="M10 21h12" />
    </g>
  ),
  // split square
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      <rect x="10" y="11" width="12" height="11" />
      <path d="M16 11v11" />
    </g>
  ),
  // notch square
  (c) => <path d="M10 11h8l4 4v7H10z" fill="none" stroke={c} strokeWidth="1.5" />,
  // delta
  (c) => <path d="M16 10 L22 22 H10 Z" fill="none" stroke={c} strokeWidth="1.5" />,
  // cross-bar
  (c) => (
    <g stroke={c} strokeWidth="1.5">
      <path d="M16 10v12" />
      <path d="M11 15h10" />
    </g>
  ),
];

export function Avatar({
  seed,
  label,
  tone = "blue",
  size = 28,
  className,
}: {
  seed: string;
  /** callsign for the monogram; falls back to a seed-derived pair */
  label?: string;
  tone?: FactionColorToken;
  size?: number;
  className?: string;
}) {
  const h = Math.abs(hashCode(seed));
  const color = factionVar[tone];
  const mono = (label && label.replace(/[^A-Za-zА-Яа-я0-9]/g, "").slice(0, 2).toUpperCase()) ||
    String.fromCharCode(65 + (h % 26)) + String.fromCharCode(65 + ((h >> 5) % 26));
  const Glyph = GLYPHS[h % GLYPHS.length];
  const big = size >= 40;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden
      className={className}
      style={{ background: "var(--carbon-2)", border: "1px solid var(--line-1)" }}
    >
      <rect x="0" y="0" width="3" height="32" fill={color} />
      <g opacity={big ? 0.5 : 0.35} transform={big ? "translate(6,-5)" : "translate(6,-6) scale(1.05)"}>
        {Glyph(color)}
      </g>
      <text
        x="18"
        y={big ? 25 : 24}
        textAnchor="middle"
        fontSize={big ? 12 : 11}
        fontWeight="700"
        fill="var(--ink)"
        fontFamily="var(--font-display-face), sans-serif"
      >
        {mono}
      </text>
    </svg>
  );
}
