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
  const btn = "ctrl pressable inline-flex items-center px-3 py-[6px] text-[11px] font-medium";
  return (
    <nav className="mt-4 flex items-center justify-between gap-4" aria-label="Страницы">
      <span className="tnum font-mono text-[11.5px] text-faint">
        стр. {page} из {pages} · {total} записей
      </span>
      <div className="flex items-center gap-2">
        <Link
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
          href={href(Math.max(1, page - 1))}
          className={cn(btn, page <= 1 && "pointer-events-none opacity-40")}
        >
          НАЗАД
        </Link>
        <Link
          aria-disabled={page >= pages}
          tabIndex={page >= pages ? -1 : undefined}
          href={href(Math.min(pages, page + 1))}
          className={cn(btn, page >= pages && "pointer-events-none opacity-40")}
        >
          ВПЕРЁД
        </Link>
      </div>
    </nav>
  );
}
