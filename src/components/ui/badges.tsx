import Link from "next/link";
import { cn } from "@/lib/cn";
import { factionRail, factionTextHi } from "@/lib/factions";
import type { Faction } from "@/types";

/** Live square: the ONLY green in the system, always paired with text. */
export function LiveDot({ tone = "green", label }: { tone?: "green" | "red" | "blue"; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn("live-dot", tone === "red" && "live-dot--red", tone === "blue" && "live-dot--blue")}
        aria-hidden
      />
      {label ? <span className="tech-label !text-dim">{label}</span> : null}
    </span>
  );
}

/** Faction tag: 3px rail + text in the faction's -hi light. Never color alone. */
export function FactionTag({
  faction,
  full = false,
  className,
}: {
  faction: Faction;
  full?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "tele inline-flex h-[20px] items-center whitespace-nowrap rounded-sm border border-line2 pl-2 pr-2 text-[10.5px] font-bold",
        factionRail[faction.colorToken],
        factionTextHi[faction.colorToken],
        className,
      )}
    >
      {full ? faction.name : faction.code}
    </span>
  );
}

/** Result tag: words + light, structural color never alone. */
export function ResultBadge({ result }: { result: "win" | "loss" | "draw" }) {
  const text = result === "win" ? "ПОБЕДА" : result === "loss" ? "ПОРАЖЕНИЕ" : "НИЧЬЯ";
  return (
    <span
      className={cn(
        "tele inline-flex h-[20px] items-center rounded-sm border px-2 text-[10.5px] font-bold leading-none",
        result === "win" && "border-[rgba(237,242,250,0.4)] text-ink",
        result === "loss" && "border-[rgba(255,59,59,0.4)] text-[color:var(--hazard-hi)]",
        result === "draw" && "border-line2 text-dim",
      )}
    >
      {text}
    </span>
  );
}

export function ClanTagLink({ clanId, tag }: { clanId: string; tag: string }) {
  return (
    <Link
      href={`/clans/${clanId}`}
      className="font-mono text-[12px] text-faint transition-colors hover:text-ink"
    >
      [{tag}]
    </Link>
  );
}
