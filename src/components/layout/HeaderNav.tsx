"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
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
}

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "ГЛАВНАЯ" },
  { href: "/players", label: "ИГРОКИ" },
  { href: "/leaderboards", label: "РЕЙТИНГ" },
  { href: "/clans", label: "КЛАНЫ" },
  { href: "/matches", label: "МАТЧИ" },
  { href: "/maps", label: "КАРТЫ" },
  { href: "/units", label: "ЮНИТЫ" },
  { href: "/statistics", label: "СТАТИСТИКА" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-baseline gap-2" aria-label="HARDLINE — на главную">
      <span aria-hidden className="flex h-[15px] items-end gap-[3px] self-center">
        <span className="h-full w-[4px] bg-blue" />
        <span className="h-[10px] w-[4px] bg-red" />
      </span>
      <span className="display text-[17px] font-black leading-none text-ink">HARDLINE</span>
      <span aria-hidden className="font-mono text-[10px] text-faint">®</span>
    </Link>
  );
}

export function HeaderNav({ user }: { user: HeaderUser }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<"none" | "account" | "bell">("none");
  const rootRef = useRef<HTMLDivElement>(null);

  // close menus on navigation — state adjusted during render, not in an effect
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

  return (
    <header className="sticky top-0 z-50 border-b-2 border-inkline bg-bg0" ref={rootRef}>
      <div className="mx-auto flex h-[54px] max-w-[1400px] items-center gap-6 px-4 sm:px-6">
        <Wordmark />

        <nav className="hidden flex-1 items-stretch self-stretch lg:flex" aria-label="Основная навигация">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  "nav-item tele flex items-center px-2.5 text-[10.5px] font-medium transition-colors",
                  active ? "text-ink" : "text-dim hover:text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "bell" ? "none" : "bell")}
              className="pressable relative flex h-8 w-8 items-center justify-center border border-transparent text-dim transition-colors hover:border-line2 hover:text-ink"
              aria-label={`Уведомления${unread ? `, непрочитанных: ${unread}` : ""}`}
              aria-expanded={menu === "bell"}
            >
              <Bell size={14} strokeWidth={1.75} />
              {unread > 0 && (
                <span className="absolute right-[5px] top-[5px] h-[6px] w-[6px] bg-red" aria-hidden />
              )}
            </button>
            {menu === "bell" && (
              <div className="frame absolute right-0 top-[calc(100%+13px)] w-[320px] !bg-[color:var(--bg-1)]">
                <div className="flex items-center justify-between border-b border-line2 bg-raised px-3.5 py-2.5">
                  <span className="tech-label">Уведомления</span>
                  <span className="tnum font-mono text-[10.5px] text-faint">{unread} новых</span>
                </div>
                <ul>
                  {user.notifications.map((n) => (
                    <li key={n.id} className="flex gap-2.5 border-b border-line px-3.5 py-2.5 last:border-b-0">
                      <span
                        aria-hidden
                        className={cn("mt-[6px] h-[6px] w-[6px] shrink-0", n.unread ? "bg-red" : "bg-line3")}
                      />
                      <div className="min-w-0">
                        <p className="text-[12.5px] leading-snug text-ink">{n.text}</p>
                        <p className="mt-0.5 font-mono text-[10.5px] uppercase text-faint">{n.ago}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* account */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu(menu === "account" ? "none" : "account")}
              className="flex items-center gap-2.5 border border-transparent py-1 pl-1.5 pr-2 transition-colors hover:border-line2"
              aria-expanded={menu === "account"}
              aria-label="Меню аккаунта"
            >
              <span className="relative">
                <Avatar seed={user.playerId} tone={user.factionTone} size={24} />
                <span
                  className="live-dot absolute -bottom-[2px] -right-[2px] !h-[6px] !w-[6px]"
                  aria-hidden
                  title="В сети"
                />
              </span>
              <span className="hidden text-left sm:block">
                <span className="block font-mono text-[12px] font-bold leading-tight text-ink">
                  {user.username}
                  {user.clanTag ? (
                    <span className="ml-1.5 font-normal text-faint">[{user.clanTag}]</span>
                  ) : null}
                </span>
                <span className="tech-label block !text-[9px] leading-tight">
                  {user.rankTitle} / УР {user.level}
                </span>
              </span>
              <ChevronDown size={12} className="hidden text-faint sm:block" />
            </button>
            {menu === "account" && (
              <div className="frame absolute right-0 top-[calc(100%+13px)] w-[210px] !bg-[color:var(--bg-1)]">
                <Link href="/profile" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-ink transition-colors hover:bg-raised">
                  <UserRound size={13} strokeWidth={1.75} className="text-dim" /> Мой профиль
                </Link>
                <Link href="/settings" className="flex items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-ink transition-colors hover:bg-raised">
                  <Settings size={13} strokeWidth={1.75} className="text-dim" /> Настройки
                </Link>
                <div className="border-t border-line2" />
                <button
                  type="button"
                  disabled
                  className="flex w-full cursor-not-allowed items-center gap-2.5 px-3.5 py-2.5 text-[12.5px] text-faint"
                  title="Авторизация появится вместе с API игры"
                >
                  <LogOut size={13} strokeWidth={1.75} /> Выйти
                </button>
              </div>
            )}
          </div>

          {/* mobile burger */}
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center border border-transparent text-dim hover:border-line2 hover:text-ink lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-line2 bg-bg0 lg:hidden" aria-label="Мобильная навигация">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "tele block border-b border-line px-5 py-3 text-[11.5px] font-medium",
                isActive(item.href) ? "bg-raised text-ink" : "text-dim",
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
