import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const variants = {
  /* ink slab — the one loud control; red/blue stay light, never a fill */
  primary: "ctrl ctrl--primary",
  /* destructive only */
  danger: "ctrl ctrl--hazard",
  /* quiet chrome */
  ghost: "ctrl",
} as const;

/** Broadcast control: 36px mono caps on a 3px-radius plate. */
export function Btn({
  href,
  children,
  variant = "ghost",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("pressable", variants[variant], className)}>
      {children}
    </Link>
  );
}
