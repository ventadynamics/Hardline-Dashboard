import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Segmented control as real links (URL is the state): a 0-radius strip
 * of mono cells; the active cell carries the blue field bleed.
 */
export function SegmentedLinks({
  items,
  ariaLabel,
  className,
}: {
  items: { href: string; label: string; active: boolean }[];
  ariaLabel: string;
  className?: string;
}) {
  return (
    <nav aria-label={ariaLabel} className={cn("flex overflow-x-auto border border-line2", className)}>
      {items.map((it) => (
        <Link
          key={it.href}
          href={it.href}
          scroll={false}
          data-active={it.active}
          aria-current={it.active ? "true" : undefined}
          className="seg whitespace-nowrap last:border-r-0"
        >
          {it.label}
        </Link>
      ))}
    </nav>
  );
}
