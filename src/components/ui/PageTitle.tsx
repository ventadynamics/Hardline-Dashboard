import type { ReactNode } from "react";

/**
 * Data-page masthead: D2 display headline left, mono meta right, one
 * hairline below. Max 80px tall — no hero on data pages.
 */
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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display text-[clamp(40px,5vw,72px)] font-bold text-ink">
          <span className="g-init">{title}</span>
        </h1>
        {meta ? <div className="tele flex items-center gap-3 pb-2 text-[11.5px] text-dim">{meta}</div> : null}
      </div>
      {description ? (
        <p className="mt-2 max-w-[76ch] text-pretty text-[13.5px] leading-relaxed text-dim">
          {description}
        </p>
      ) : null}
      <div className="mt-4 border-t border-line2" aria-hidden />
    </div>
  );
}
