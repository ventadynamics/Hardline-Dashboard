import type { ReactNode } from "react";

/** Page header: macro block type under a structural rule, mono meta. */
export function PageTitle({
  title,
  description,
  meta,
}: {
  title: string;
  description?: string;
  meta?: ReactNode;
}) {
  return (
    <div>
      <div className="rule-ink" aria-hidden />
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(32px,4.5vw,52px)] font-black text-ink">{title}</h1>
        {meta ? <div className="tele flex items-center gap-3 pb-1.5 text-[11px] text-dim">{meta}</div> : null}
      </div>
      {description ? (
        <p className="mt-2.5 max-w-[76ch] text-[13px] leading-relaxed text-dim">{description}</p>
      ) : null}
    </div>
  );
}
