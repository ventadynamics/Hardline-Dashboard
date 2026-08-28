"use client";

import { useEffect, useRef, useState } from "react";

const nf = new Intl.NumberFormat("ru-RU");

/**
 * One-shot count-up: the numeral rolls the last stretch up to its real
 * value on mount, like a meter locking in. Server HTML carries the
 * final value; the roll starts only after hydration and is skipped
 * under reduced motion.
 */
export function NumberRise({
  value,
  duration = 900,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const raf = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const from = Math.round(value * 0.86);
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);
  return (
    <span className={className} suppressHydrationWarning>
      {nf.format(shown)}
    </span>
  );
}
