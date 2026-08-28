import Link from "next/link";
import { cn } from "@/lib/cn";
import { factionBg } from "@/lib/factions";
import type { Faction } from "@/types";

/** Live status: the ONLY terminal-green element in the system. */
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

/** Faction reference: square color tick + mono code. Never color alone. */
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
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap", className)}>
      <span className={cn("inline-block h-[9px] w-[9px]", factionBg[faction.colorToken])} aria-hidden />
      <span className="tele text-[11.5px] font-bold text-ink">{full ? faction.name : faction.code}</span>
    </span>
  );
}

export function ResultBadge({ result }: { result: "win" | "loss" | "draw" }) {
  const text = result === "win" ? "ПОБЕДА" : result === "loss" ? "ПОРАЖЕНИЕ" : "НИЧЬЯ";
  return (
    <span
      className={cn(
        "tele inline-block border px-1.5 py-[3px] text-[10px] font-bold leading-none",
        result === "win" && "border-ink text-ink",
        result === "loss" && "border-[color:var(--red)] text-[color:var(--red)]",
        result === "draw" && "border-line3 text-dim",
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
