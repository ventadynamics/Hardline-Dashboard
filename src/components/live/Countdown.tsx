"use client";

import { useEffect, useState } from "react";
import { countdown } from "@/lib/format";

/**
 * Ticking HH:MM:SS until `until`. The value renders only after mount so the
 * server HTML never disagrees with the first client frame.
 */
export function Countdown({ until, prefix }: { until: string; prefix?: string }) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(+new Date(until) - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [until]);
  return (
    <span className="tnum font-mono text-[12px] text-dim">
      {prefix ? `${prefix} ` : ""}
      {left === null ? "--:--:--" : countdown(left)}
    </span>
  );
}
