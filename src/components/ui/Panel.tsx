import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Augmented housing: asymmetric machined cuts, 1px boundary. */
export function Panel({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  corners?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={cn("aug", padded && "p-4", className)}
      data-augmented-ui="tl-clip br-clip border"
    >
      {children}
    </div>
  );
}
