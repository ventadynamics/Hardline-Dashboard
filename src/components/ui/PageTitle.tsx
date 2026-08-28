import type { ReactNode } from "react";

/** Page header: slash kicker over poster-scale condensed type. */
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
      <p className="kicker">{kicker}</p>
      <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(44px,6vw,76px)] font-semibold text-ink">{title}</h1>
        {meta ? <div className="tele flex items-center gap-3 pb-2 text-[11px] text-dim">{meta}</div> : null}
      </div>
      {description ? (
        <p className="mt-2.5 max-w-[76ch] text-pretty text-[13.5px] leading-relaxed text-dim">
          {description}
        </p>
      ) : null}
      <div className="hardline-strip mt-5" aria-hidden />
    </div>
  );
}
