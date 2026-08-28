import type { Faction } from "@/types";

/**
 * LIGHT LAW: on any split surface blue light enters from the LEFT and
 * red from the RIGHT; olive takes the free flank. Sides never swap to
 * mark the winner — brightness and tags do that.
 */
export function orderByLight<T extends { faction: Faction }>(a: T, b: T): [T, T] {
  const weight = (f: Faction) => (f.colorToken === "blue" ? 0 : f.colorToken === "red" ? 2 : 1);
  return weight(a.faction) <= weight(b.faction) ? [a, b] : [b, a];
}
