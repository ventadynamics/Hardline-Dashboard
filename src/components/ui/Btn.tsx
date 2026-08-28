import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const variants = {
  /* solid ink fill — the one loud control; red/blue stay light, not fill */
  primary: "ctrl ctrl--primary",
  /* hazard edge: red as signal on the border, translucent body */
  danger: "ctrl ctrl--red",
  /* quiet layered control */
  ghost: "ctrl",
} as const;

/** Rectangular mono control on the layer system. Press acknowledges. */
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
