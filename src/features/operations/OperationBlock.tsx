import Link from "next/link";
import { Countdown } from "@/components/live/Countdown";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/cn";
import { operationsService, sessionService } from "@/services";

/**
 * Daily clan operation as a dense task ledger: one row per task, inline
 * progress, single hairline system. Progress is mock today, API tomorrow.
 */
export async function OperationBlock() {
  const session = await sessionService.current();
  if (!session.clan) {
    return (
      <section>
        <SectionHeader title="Операции клана" accent="red" />
        <EmptyState
          title="Вы не состоите в клане"
          hint="Вступите в клан, чтобы получать ежедневные задачи операции."
        />
      </section>
    );
  }
  const op = await operationsService.currentForClan(session.clan.id);
  if (!op) {
    return (
      <section>
        <SectionHeader title="Операции клана" accent="red" />
        <EmptyState title="Сегодня задач нет" hint="Новая ротация — в 00:00." />
      </section>
    );
  }
  const done = op.tasks.filter((t) => t.status === "done").length;

  return (
    <section aria-label="Операции клана">
      <SectionHeader
        title="Операции клана"
        accent="red"
        meta={
          <>
            <Link
              href={`/clans/${session.clan.id}`}
              className="font-mono text-[11px] text-faint transition-colors hover:text-bluebright"
            >
              [{session.clan.tag}] {session.clan.name}
            </Link>
            <span className="tnum font-mono text-[11px] text-faint">{done}/{op.tasks.length}</span>
            <Countdown until={op.expiresAt} prefix="СБРОС" />
          </>
        }
      />
      <div className="border-t border-line2">
        <div>
          {op.tasks.map((t, i) => {
          const share = t.total === 0 ? 0 : Math.min(1, t.progress / t.total);
          const isDone = t.status === "done";
          return (
            <article
              key={t.id}
              className={cn(
                "grid grid-cols-[14px_1fr_auto] items-center gap-x-3.5 px-4 py-3 transition-colors hover:bg-[rgba(158,178,208,0.035)] sm:grid-cols-[14px_minmax(0,1.4fr)_minmax(120px,180px)_86px]",
                i > 0 && "border-t border-line",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "h-[10px] w-[10px] border",
                  isDone ? "border-success bg-[rgba(92,194,129,0.35)]" : "border-line3",
                )}
              />
              <div className="min-w-0">
                <h3 className={cn("tele text-[12px] font-bold", isDone ? "text-dim" : "text-ink")}>
                  {t.title}
                </h3>
                <p className="mt-0.5 truncate text-[12px] text-faint">
                  {t.description}
                  {t.reward ? <span className="text-dim"> · {t.reward}</span> : null}
                </p>
              </div>
              <div className="col-span-full mt-2 h-[3px] w-full bg-[rgba(158,178,208,0.1)] sm:col-span-1 sm:col-start-3 sm:mt-0">
                <div
                  className={cn("h-full transition-[width] duration-500", isDone ? "bg-success" : "bg-red")}
                  style={{ width: `${share * 100}%` }}
                />
              </div>
              <p className="tnum col-start-3 row-start-1 text-right font-mono text-[12.5px] sm:col-start-4">
                <span className={isDone ? "text-success" : "text-ink"}>{t.progress}</span>
                <span className="text-faint">/{t.total}</span>
              </p>
            </article>
          );
          })}
        </div>
      </div>
    </section>
  );
}
