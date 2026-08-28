"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll-entry reveal: fade-up once when the block enters the viewport.
 * IntersectionObserver only — never a scroll listener. Honors reduced motion
 * via the .reveal CSS (globals.css).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.shown = "true";
          io.disconnect();
        }
      },
      { rootMargin: "-40px 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className ?? ""}`} style={{ ["--d" as string]: `${delay}ms` }}>
      {children}
    </div>
  );
}
