import type { ReactNode } from "react";

/** Page header: mono kicker over macro block type, meta on the baseline. */
export function PageTitle({
  title,
  kicker = "HARDLINE / РАЗДЕЛ",
  description,
  meta,
}: {
  title: string;
  kicker?: string;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <div>
      <p className="tech-label">{kicker}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(32px,4.5vw,52px)] font-black text-ink">{title}</h1>
        {meta ? <div className="tele flex items-center gap-3 pb-1.5 text-[11px] text-dim">{meta}</div> : null}
      </div>
      {description ? (
        <p className="mt-2.5 max-w-[76ch] text-pretty text-[13px] leading-relaxed text-dim">{description}</p>
      ) : null}
      <div className="rule-blue mt-4" aria-hidden />
    </div>
  );
}
