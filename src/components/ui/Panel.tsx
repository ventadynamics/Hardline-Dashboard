import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Framed compartment: solid substrate, visible 1px boundary, 90-degree. */
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
  return <div className={cn("frame", padded && "p-4", className)}>{children}</div>;
}
