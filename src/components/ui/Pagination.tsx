import Link from "next/link";
import { cn } from "@/lib/cn";

/** Prev/next pager driven by the `page` search param. */
export function Pagination({
  page,
  pageSize,
  total,
  basePath,
  params,
}: {
  page: number;
  pageSize: number;
  total: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return q ? `${basePath}?${q}` : basePath;
  };
  if (pages <= 1) return null;
  const btn =
    "display inline-flex items-center border px-3 py-[6px] text-[12px] font-semibold tracking-wider transition-colors";
  return (
    <nav className="mt-4 flex items-center justify-between gap-4" aria-label="Страницы">
      <span className="font-mono text-[11.5px] text-faint">
        стр. {page} из {pages} · {total} записей
      </span>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          href={href(Math.max(1, page - 1))}
          className={cn(btn, page <= 1 ? "pointer-events-none border-line text-faint" : "border-line2 text-dim hover:border-line3 hover:text-ink")}
        >
          НАЗАД
        </Link>
        <Link
          aria-disabled={page >= pages}
          tabIndex={page >= pages ? -1 : undefined}
          href={href(Math.min(pages, page + 1))}
          className={cn(btn, page >= pages ? "pointer-events-none border-line text-faint" : "border-line2 text-dim hover:border-line3 hover:text-ink")}
        >
          ВПЕРЁД
        </Link>
      </div>
    </nav>
  );
}
