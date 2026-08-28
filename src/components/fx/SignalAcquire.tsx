"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * «Захват сигнала»: arms the acquisition choreography (fields wipe in
 * from their edges, the score tears through an RGB glitch — pure CSS,
 * compositor only) on every mount of the stage. Reduced motion renders
 * settled via the CSS guards.
 */
export function SignalAcquire({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.setAttribute("data-acquire", "true");
  }, []);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
