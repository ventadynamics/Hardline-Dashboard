"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { Search } from "lucide-react";

/**
 * Filter strip on the broadcast chrome. State lives in the URL, so
 * filtered views are shareable and server components re-query on change.
 */

export interface FilterField {
  type: "search" | "select";
  name: string;
  label: string;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

export function FilterBar({ fields }: { fields: FilterField[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // resync the input when the URL query changes externally (render-time adjust)
  const q = params.get("q") ?? "";
  const [prevQ, setPrevQ] = useState(q);
  if (prevQ !== q) {
    setPrevQ(q);
    setSearch(q);
  }

  function apply(name: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
      {fields.map((f) =>
        f.type === "search" ? (
          <label key={f.name} className="flex min-w-[200px] flex-1 flex-col gap-1 sm:max-w-[280px]">
            <span className="tech-label">{f.label}</span>
            <span className="relative">
              <Search size={13} strokeWidth={1.5} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" />
              <input
                type="search"
                value={search}
                placeholder={f.placeholder}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (debounce.current) clearTimeout(debounce.current);
                  const v = e.target.value;
                  debounce.current = setTimeout(() => apply(f.name, v), 350);
                }}
                className="h-[36px] w-full rounded-sm border border-line2 bg-[color:var(--layer-1)] pl-8 pr-2.5 text-[13px] text-ink outline-none transition-colors placeholder:text-faint focus:border-[rgba(47,123,255,0.6)]"
              />
            </span>
          </label>
        ) : (
          <label key={f.name} className="flex flex-col gap-1">
            <span className="tech-label">{f.label}</span>
            <select
              value={params.get(f.name) ?? ""}
              onChange={(e) => apply(f.name, e.target.value)}
              className="h-[36px] min-w-[136px] cursor-pointer rounded-sm border border-line2 bg-[color:var(--layer-1)] px-2.5 font-mono text-[12px] uppercase tracking-[0.06em] text-ink outline-none transition-colors focus:border-[rgba(47,123,255,0.6)]"
            >
              {(f.options ?? []).map((o) => (
                <option key={o.value} value={o.value} className="bg-carbon1 text-ink">
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ),
      )}
    </div>
  );
}
