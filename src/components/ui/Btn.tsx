import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const variants = {
  /* mechanical inversion: phosphor fill on hover */
  primary: "ctrl",
  danger: "ctrl ctrl--red",
  ghost: "ctrl !border-line2 !text-dim hover:!border-line3",
} as const;

/** Rectangular mono control. Hover inverts, press acknowledges. */
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
    <Link
      href={href}
      className={cn(
        "pressable inline-flex items-center gap-2 px-4 py-[9px] text-[11.5px] font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
