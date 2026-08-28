import Link from "next/link";
import { Btn } from "@/components/ui/Btn";

const COLS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Разделы",
    links: [
      { href: "/players", label: "Игроки" },
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
      { href: "/profile", label: "Мой профиль" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line2 bg-bg1">
      <div className="mx-auto max-w-[1360px] px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="flex h-[16px] items-end gap-[3px]">
                <span className="h-full w-[4px] rounded-[1px] bg-blue shadow-[0_0_8px_rgba(76,154,255,0.55)]" />
                <span className="h-[10px] w-[4px] rounded-[1px] bg-red shadow-[0_0_8px_rgba(255,59,48,0.55)]" />
              </span>
              <span className="display text-[17px] font-bold text-ink">HARDLINE</span>
            </div>
            <p className="mt-3 max-w-[300px] text-[13px] leading-relaxed text-dim">
              Оперативный портал тактической RTS Hardline: статистика, рейтинги,
              кланы и матч-репорты в одном месте.
            </p>
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
            <p className="tech-label mb-3">Сообщество</p>
            <p className="mb-3 text-[13px] leading-relaxed text-dim">
              Обсуждение тактик, поиск клана и новости разработки — в нашем Discord.
            </p>
            <Btn href="#" variant="primary">
              ПРИСОЕДИНИТЬСЯ К DISCORD
            </Btn>
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-faint">
            © 2026 HARDLINE. Прототип companion-портала — все данные тестовые.
          </p>
          <p className="tele text-[10.5px] text-faint">build 0.1.0 / mock data / api-ready</p>
        </div>
      </div>
    </footer>
  );
}
