import Link from "next/link";
import { cn } from "@/lib/cn";

/** Async-state visuals in the broadcast's own voice — no browser defaults. */

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden />;
}

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
  return (
    <div className="space-y-[9px] py-2" role="status" aria-label="Загрузка данных">
      <p className="tech-label px-1">Загрузка данных…</p>
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
    <div className="plate px-6 py-10 text-center">
      <svg width="48" height="48" viewBox="0 0 32 32" className="mx-auto mb-4 opacity-30" aria-hidden>
        <path d="M16 6 L26 26 H6 Z" fill="none" stroke="var(--dim)" strokeWidth="1.5" />
      </svg>
      <p className="tele text-[12px] font-bold text-dim">{title}</p>
      {hint ? <p className="mt-2 text-pretty text-[12.5px] text-faint">{hint}</p> : null}
      {action ? (
        <Link href={action.href} className="ctrl pressable mt-5">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

export function ErrorPanel({ title = "Сигнал потерян", hint }: { title?: string; hint?: string }) {
  return (
    <div className="plate overflow-hidden">
      <div className="stripes-hazard h-[8px] w-full" aria-hidden />
      <div className="px-6 py-8 text-center">
        <p className="tele text-[12.5px] font-bold text-[color:var(--hazard-hi)]">{title}</p>
        <p className="mt-2 text-pretty text-[12.5px] text-dim">
          {hint ?? "Данные временно недоступны. Повторите запрос через минуту."}
        </p>
      </div>
    </div>
  );
}
