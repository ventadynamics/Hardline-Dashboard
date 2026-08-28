"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ServerClock } from "@/components/live/ServerClock";
import { cn } from "@/lib/cn";
import type { FactionColorToken, NotificationItem } from "@/types";

export interface HeaderUser {
  username: string;
  rankTitle: string;
  level: number;
  clanTag: string | null;
  factionTone: FactionColorToken;
  playerId: string;
  notifications: NotificationItem[];
  liveMatches: number;
}

/** Polls the live snapshot; a changed value re-arms the flash animation. */
function useLiveMatches(initial: number) {
  const [state, setState] = useState({ value: initial, tick: 0 });
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/live", { cache: "no-store" });
        if (!res.ok) return;
        const snap = (await res.json()) as { liveMatches: number };
        setState((prev) =>
          snap.liveMatches === prev.value ? prev : { value: snap.liveMatches, tick: prev.tick + 1 },
        );
      } catch {
        /* keep the last value */
      }
    }, 8000);
    return () => clearInterval(id);
  }, []);
  return state;
}

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "СВОДКА" },
  { href: "/players", label: "СОСТАВ" },
  { href: "/leaderboards", label: "РЕЙТИНГ" },
  { href: "/clans", label: "КЛАНЫ" },
  { href: "/matches", label: "МАТЧИ" },
  { href: "/maps", label: "КАРТЫ" },
  { href: "/units", label: "ЮНИТЫ" },
  { href: "/statistics", label: "СТАТИСТИКА" },
];

function Wordmark() {
  return (
    <Link href="/" aria-label="HARDLINE - на главную" className="shrink-0">
      <span className="wordmark-plate display text-[18px] font-black leading-none">HARDLINE</span>
    </Link>
  );
}

export function HeaderNav({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<"none" | "account" | "bell">("none");
  const rootRef = useRef<HTMLDivElement>(null);

  // close menus on navigation - state adjusted during render, not in an effect
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMobileOpen(false);
    setMenu("none");
  }

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenu("none");
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const unread = user.notifications.filter((n) => n.unread).length;
  const live = useLiveMatches(user.liveMatches);

  return (
    <header
      ref={rootRef}
      className="sticky top-0 z-[var(--z-sticky)] border-b border-line2 bg-[rgba(5,7,11,0.75)] backdrop-blur-md"
    >
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-5 px-4 sm:px-6">
        <Wordmark />

        <nav className="hidden flex-1 items-stretch self-stretch xl:flex" aria-label="Основная навигация">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  "nav-item tele flex items-center px-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-ink" : "text-dim hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {/* server clock + live chip */}
          <div className="hidden items-center gap-3 lg:flex">
            <ServerClock />
            <span className="relative h-[12px] w-[2px] -skew-x-[12deg] bg-ink" aria-hidden />
            <span className="flex items-center gap-1.5">
              <span className="live-dot" aria-hidden />
              <span className="tele text-[10.5px] font-medium text-dim">
                В ЭФИРЕ ·{" "}
                <span key={live.tick} className={cn("tnum", live.tick > 0 && "count-flash")}>
                  {live.value}
                </span>
              </span>
            </span>
          </div>

          {/* notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "bell" ? "none" : "bell")}
              className="pressable relative flex size-8 items-center justify-center rounded-sm border border-transparent text-dim transition-colors hover:border-line2 hover:text-ink"
              aria-label={`Уведомления${unread ? `, непрочитанных: ${unread}` : ""}`}
              aria-expanded={menu === "bell"}
            >
              <Bell size={15} strokeWidth={1.5} />
              {unread > 0 && (
                <span className="absolute right-[5px] top-[5px] size-[6px] bg-[color:var(--hazard)]" aria-hidden />
              )}
            </button>
            {menu === "bell" && (
              <div className="menu absolute right-0 top-[calc(100%+14px)] w-[320px]">
                <div className="flex items-center justify-between border-b border-line2 px-3.5 py-2.5">
                  <span className="tech-label">Уведомления</span>
                  <span className="tnum font-mono text-[10.5px] text-faint">{unread} новых</span>
                </div>
                <ul>
                  {user.notifications.map((n) => (
                    <li key={n.id} className="flex gap-2.5 border-b border-line px-3.5 py-2.5 last:border-b-0">
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[6px] size-[6px] shrink-0",
                          n.unread ? "bg-[color:var(--hazard)]" : "bg-[color:var(--line-2)]",
                        )}
                      />
                      <div className="min-w-0">
                        <p className="text-[12.5px] leading-snug text-ink">{n.text}</p>
                        <p className="tnum mt-0.5 font-mono text-[10.5px] uppercase text-faint">{n.ago}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* operator chip */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "account" ? "none" : "account")}
              className="flex items-center gap-2.5 rounded-sm border border-transparent py-1 pl-1.5 pr-2 transition-colors hover:border-line2 hover:bg-[color:var(--layer-1)]"
              aria-expanded={menu === "account"}
              aria-label="Меню аккаунта"
            >
              <Avatar seed={user.playerId} label={user.username} tone={user.factionTone} size={28} />
              <span className="hidden text-left sm:block">
                <span className="block font-mono text-[12px] font-bold leading-tight text-ink" translate="no">
                  {user.username}
                  {user.clanTag ? (
                    <span className="ml-1.5 font-normal text-faint">[{user.clanTag}]</span>
                  ) : null}
                </span>
                <span className="tech-label block !text-[9.5px] leading-tight">
                  {user.rankTitle} · ур {user.level}
                </span>
              </span>
              <ChevronDown size={12} className="hidden text-faint sm:block" />
            </button>
            {menu === "account" && (
              <div className="menu absolute right-0 top-[calc(100%+14px)] w-[210px]">
                <Link href="/profile" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-ink transition-colors hover:bg-[color:var(--layer-1)]">
                  <UserRound size={13} strokeWidth={1.5} className="text-dim" /> Моё досье
                </Link>
                <Link href="/settings" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-ink transition-colors hover:bg-[color:var(--layer-1)]">
                  <Settings size={13} strokeWidth={1.5} className="text-dim" /> Настройки
                </Link>
                <div className="border-t border-line2" />
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-faint"
                  title="Авторизация появится вместе с API игры"
                >
                  <LogOut size={13} strokeWidth={1.5} /> Выйти
                </button>
              </div>
            )}
          </div>

          {/* mobile burger */}
          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-sm border border-transparent text-dim hover:border-line2 hover:text-ink xl:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-line2 bg-[rgba(5,7,11,0.94)] xl:hidden"
          aria-label="Мобильная навигация"
          style={{ overscrollBehavior: "contain" }}
        >
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "tele block border-b border-line px-5 py-3 text-[11.5px] font-medium",
                isActive(item.href) ? "bg-[color:var(--layer-1)] text-ink" : "text-dim",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
