import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Plate compartment: translucent layer, hairline, inset top light. */
export function Panel({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return <div className={cn("plate", padded && "p-4", className)}>{children}</div>;
}
