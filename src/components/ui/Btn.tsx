import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

const variants = {
  primary: "aug-btn",
  danger: "aug-btn aug-btn--red",
  ghost: "aug-btn !text-dim hover:!text-bg0",
} as const;

/** Augmented control: clipped corners, mechanical inversion on hover. */
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
      data-augmented-ui="tl-clip br-clip border"
      className={cn(
        "inline-flex items-center gap-2 px-4 py-[9px] text-[11.5px] font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
