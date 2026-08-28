"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Entrance choreography for the hero scene: staggered rise for [data-fx]
 * blocks, a longer slide for the [data-fx-car] cutout. Honors reduced motion
 * via gsap.matchMedia; cleanup handled by useGSAP.
 */
export function IntroFx({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-fx]", {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.11,
          clearProps: "all",
        });
        gsap.from("[data-fx-car]", {
          x: 70,
          opacity: 0,
          duration: 1.15,
          ease: "power3.out",
          delay: 0.2,
          clearProps: "all",
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
