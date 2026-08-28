"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * «Захват сигнала»: arms the one-per-session acquisition choreography
 * (fields wipe in from their edges — pure CSS, compositor only) by
 * stamping data-acquire on the wrapper. Guarded by sessionStorage;
 * reduced motion renders settled.
 */
export function SignalAcquire({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    try {
      if (!sessionStorage.getItem("efir-acq")) {
        sessionStorage.setItem("efir-acq", "1");
        ref.current?.setAttribute("data-acquire", "true");
      }
    } catch {
      /* storage unavailable — render settled */
    }
  }, []);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
