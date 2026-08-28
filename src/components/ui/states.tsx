import Link from "next/link";
import { cn } from "@/lib/cn";

/** Async-state visuals in the system's own voice — no browser defaults. */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-[color:var(--layer-2)]", className)} aria-hidden />;
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-[9px] py-2" role="status" aria-label="Загрузка данных">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-[28px] w-full" />
      ))}
    </div>
  );
}

/** Empty compartment with one clear next action. */
export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="frame px-6 py-10 text-center">
      <p className="tele text-[12px] font-bold text-dim">{title}</p>
      {hint ? <p className="mt-2 text-pretty text-[12.5px] text-faint">{hint}</p> : null}
      {action ? (
        <Link
          href={action.href}
          className="ctrl pressable mt-4 inline-flex items-center px-4 py-[8px] text-[11px] font-medium"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorPanel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[rgba(255,59,48,0.5)]">
      <div className="stripes-red h-[6px] w-full opacity-70" aria-hidden />
      <div className="px-6 py-8 text-center">
        <p className="tele text-[12.5px] font-bold text-red">{title}</p>
        <p className="mt-2 text-pretty text-[12.5px] text-dim">
          {hint ?? "Попробуйте обновить страницу. Если ошибка повторяется — данные временно недоступны."}
        </p>
      </div>
    </div>
  );
}
