"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import type { LiveSnapshot } from "@/types";

/**
 * Live readout line. Polls /api/live; values drift slowly and count up
 * through a GSAP-eased transition — no per-second noise, no stat tiles.
 */

const nf = new Intl.NumberFormat("ru-RU");
const POLL_MS = 15_000;

function useAnimatedNumber(target: number): number {
  const [shown, setShown] = useState(target);
  const proxy = useRef({ v: target });
  useEffect(() => {
    const tween = gsap.to(proxy.current, {
      v: target,
      duration: 0.8,
      ease: "power2.out",
      snap: { v: 1 },
      onUpdate: () => setShown(Math.round(proxy.current.v)),
    });
    return () => {
      tween.kill();
    };
  }, [target]);
  return shown;
}

function Seg({ value, label, first, stack }: { value: number; label: string; first?: boolean; stack?: boolean }) {
  const shown = useAnimatedNumber(value);
  if (stack) {
    return (
      <div className="flex items-baseline justify-between gap-3 border-b border-line px-4 py-3 last:border-b-0">
        <span className="tech-label flex items-center gap-2">
          {first && <span className="live-dot !h-[6px] !w-[6px] self-center" aria-hidden />}
          {label}
        </span>
        <span className="tnum font-mono text-[18px] font-bold leading-none text-ink">{nf.format(shown)}</span>
      </div>
    );
  }
  return (
    <div className={`flex items-baseline gap-2.5 py-3 pr-6 ${first ? "" : "border-l border-line2 pl-6"}`}>
      {first && <span className="live-dot mr-0.5 self-center" aria-hidden />}
      <span className="tnum font-mono text-[20px] font-bold leading-none text-ink">{nf.format(shown)}</span>
      <span className="tech-label">{label}</span>
    </div>
  );
}

export function LiveTicker({ initial, layout = "row" }: { initial: LiveSnapshot; layout?: "row" | "stack" }) {
  const [snap, setSnap] = useState(initial);
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        if (res.ok) setSnap((await res.json()) as LiveSnapshot);
      } catch {
        /* keep the last snapshot */
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  if (layout === "stack") {
    return (
      <div>
        <Seg stack first value={snap.liveMatches} label="матчей в эфире" />
        <Seg stack value={snap.playersOnline} label="игроков онлайн" />
        <Seg stack value={snap.activeClans} label="активных кланов" />
        <Seg stack value={snap.matchesToday} label="матчей сегодня" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center">
      <Seg first value={snap.liveMatches} label="матчей в эфире" />
      <Seg value={snap.playersOnline} label="игроков онлайн" />
      <div className="hidden sm:contents">
        <Seg value={snap.activeClans} label="активных кланов" />
        <Seg value={snap.matchesToday} label="матчей сегодня" />
      </div>
      <Link
        href="/matches"
        className="group ml-auto hidden items-center gap-1.5 py-2.5 pl-5 text-[12.5px] font-medium text-dim transition-colors hover:text-ink lg:inline-flex"
      >
        Смотреть матчи
        <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
