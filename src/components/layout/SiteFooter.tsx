import Link from "next/link";
import { LiveDot } from "@/components/ui/badges";

/** Daily edition number: real derived data, ticks at 00:00 UTC. */
export function editionNumber(): number {
  return Math.floor(Date.now() / 86_400_000) - 20_320;
}

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Разделы",
    links: [
      { href: "/players", label: "Личный состав" },
      { href: "/leaderboards", label: "Рейтинг" },
      { href: "/clans", label: "Кланы" },
      { href: "/matches", label: "Матчи" },
    ],
  },
  {
    title: "Игра",
    links: [
      { href: "/maps", label: "Карты" },
      { href: "/units", label: "Юниты" },
      { href: "/statistics", label: "Статистика" },
      { href: "/profile", label: "Моё досье" },
    ],
  },
];

/** Broadcast credits: opaque band, honest chrome, no marketing. */
export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line2 bg-carbon1">
      <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr_1fr_1.2fr]">
          <div>
            <span className="wordmark-plate display text-[18px] font-black leading-none">HARDLINE</span>
            <p className="mt-4 max-w-[300px] text-pretty text-[13px] leading-relaxed text-dim">
              Официальный портал Hardline - статистика, рейтинги, кланы и
              матч-репорты войны за город.
            </p>
            <p className="tech-label mt-3">Прототип на мок-данных</p>
          </div>
          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="tech-label mb-3">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[13px] text-dim transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <p className="tech-label mb-3">Сервер</p>
            <div className="space-y-2 font-mono text-[11.5px] text-dim">
              <p className="flex items-center gap-2">
                <LiveDot /> ОНЛАЙН
              </p>
              <p>BUILD 0.4.2-MOCK</p>
              <p>EU-WEST · 24 МС</p>
            </div>
            <p className="tech-label mb-3 mt-6">Сообщество</p>
            <a href="#" className="ctrl pressable">
              DISCORD
            </a>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          <p className="tele text-[10.5px] text-faint">ЭФИР № {editionNumber()}</p>
          <p className="font-mono text-[11px] text-faint">© 2026 HARDLINE · все данные тестовые</p>
        </div>
      </div>
    </footer>
  );
}
