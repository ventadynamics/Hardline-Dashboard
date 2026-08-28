"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One-shot count-up: the numeral rolls the last stretch up to its real
 * value on mount, like a meter locking in. Server HTML carries the
 * final value; the roll starts only after hydration and is skipped
 * under reduced motion. Handles integers, decimals and suffixed
 * values (percentages) with ru-RU formatting.
 */
export function NumberRise({
  value,
  decimals = 0,
  suffix = "",
  duration = 900,
  delay = 0,
  className,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = value * 0.86;
    let t0: number | null = null;
    const tick = (t: number) => {
      if (t0 === null) t0 = t + delay;
      const p = Math.min(1, Math.max(0, (t - t0) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(from + (value - from) * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration, delay]);
  const nf = new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <span className={className} suppressHydrationWarning>
      {nf.format(shown)}
      {suffix}
    </span>
  );
}
