import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, Tektur } from "next/font/google";
import { ChannelSwitch } from "@/components/fx/ChannelSwitch";
import { CityGrid } from "@/components/fx/CityGrid";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const display = Tektur({
  variable: "--font-display-face",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "900"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HARDLINE — оперативный портал",
    template: "%s — HARDLINE",
  },
  description:
    "Официальный companion-портал тактической RTS Hardline: статистика, рейтинги, кланы, матчи, карты и юниты.",
};

export const viewport: Viewport = {
  themeColor: "#05070b",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col bg-carbon0">
        <span
          hidden
          aria-hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: The official companion portal of the RTS Hardline as the war's LIVE BROADCAST: every page is production chrome around a running signal. Refuses the category default - dark SaaS dashboard of identical rounded cards.
OWN-WORLD: EFIR 10-33 (On-Air Split Broadcast). One identity device - the ON-AIR SEAM: a 78-degree frontier where the blue police light-field and the red hazard light-field collide, core always ink-white. LIGHT LAW: blue enters left, red enters right, always. Instrument chrome around it: carbon substrate, translucent plates with clipped corners, faction rails, Tektur 900 broadcast numerals over IBM Plex Mono telemetry, authored city linework under the fold, step-after charts, unit-patch avatars. Green only on the live square; amber rationed to records and deadlines.
STORY: A player tunes in - the ticker runs, the featured match burns in the scorebug - checks their dossier and ratings, drills into the transmission report of any match.
FIRST VIEWPORT: Ticker with the daily edition chip, then the poster-scale scorebug: two faction light-fields colliding on the seam, D1 scores riding each side, the map plate on the frontier, live telemetry along the base.
SIGNATURE INTERACTION: the one-second SIGNAL ACQUISITION on home - fields wipe in from their edges, the seam strikes, numerals rise; everything after is disciplined instrument motion.
FORM: Winning concept of a 4-way judged design panel (ui-skills: frontend-design, taste, high-end-visual, emil-design-eng, web-design-guidelines), synthesized under the owner's binding brief.
FINISH: unreviewed and undocumented is unfinished.
-->`,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <div className="stage-light" aria-hidden />
        <CityGrid />
        <div className="grain" aria-hidden />
        <SiteHeader />
        <main className="relative flex-1">
          <ChannelSwitch>{children}</ChannelSwitch>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
