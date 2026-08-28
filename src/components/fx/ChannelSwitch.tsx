"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Channel switch: every route change replays a short CRT wipe onto the
 * next feed. Keyed by pathname so query-param changes (filters, tabs)
 * never re-trigger it. Reduced motion disables the wipe in CSS.
 */
export function ChannelSwitch({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="channel-in">
      {children}
    </div>
  );
}
