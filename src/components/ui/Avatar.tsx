import { hashCode, mulberry32 } from "@/lib/rng";
import { factionVar } from "@/lib/factions";
import type { FactionColorToken } from "@/types";

/**
 * Deterministic tactical identicon: a seeded 5x5 block pattern in the
 * player's faction hue. Replaced by real avatars when the API arrives.
 */
export function Avatar({
  seed,
  tone = "blue",
  size = 28,
  className,
}: {
  seed: string;
  tone?: FactionColorToken;
  size?: number;
  className?: string;
}) {
  const rng = mulberry32(hashCode(seed));
  const cells: { x: number; y: number; o: number }[] = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      if (rng() > 0.52) continue;
      const o = 0.35 + rng() * 0.65;
      cells.push({ x, y, o });
      if (x < 2) cells.push({ x: 4 - x, y, o });
    }
  }
  const color = factionVar[tone];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 5 5"
      role="img"
      aria-hidden
      className={className}
      style={{
        background: "var(--layer-2)",
        border: "1px solid var(--line-2)",
        borderRadius: "var(--radius-1)",
      }}
      shapeRendering="crispEdges"
    >
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={1} height={1} fill={color} opacity={c.o * 0.85} />
      ))}
    </svg>
  );
}
