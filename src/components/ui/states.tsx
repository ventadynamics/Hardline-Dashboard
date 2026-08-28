import { cn } from "@/lib/cn";

/** Async-state visuals in the system's own voice — no browser defaults. */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-[color:var(--line-1)]", className)} aria-hidden />;
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

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-line2 px-6 py-10 text-center">
      <p className="tele text-[12px] font-bold text-dim">
        <span aria-hidden className="text-faint">[ </span>
        {title}
        <span aria-hidden className="text-faint"> ]</span>
      </p>
      {hint ? <p className="mt-2 text-[12.5px] text-faint">{hint}</p> : null}
    </div>
  );
}

export function ErrorPanel({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="border border-[color:var(--red)]">
      <div className="stripes-red h-[6px] w-full opacity-70" aria-hidden />
      <div className="px-6 py-8 text-center">
        <p className="tele text-[12.5px] font-bold text-[color:var(--red)]">{title}</p>
        <p className="mt-2 text-[12.5px] text-dim">
          {hint ?? "Попробуйте обновить страницу. Если ошибка повторяется — данные временно недоступны."}
        </p>
      </div>
    </div>
  );
}
