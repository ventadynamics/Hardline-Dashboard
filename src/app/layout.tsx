import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Golos_Text, Martian_Mono, Tektur } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const body = Golos_Text({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const display = Tektur({
  variable: "--font-display-face",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "900"],
});

const mono = Martian_Mono({
  variable: "--font-mono-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "HARDLINE — оперативный портал",
    template: "%s — HARDLINE",
  },
  description:
    "Официальный companion-портал тактической RTS Hardline: статистика, рейтинги, кланы, матчи, карты и юниты.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={`${body.variable} ${display.variable} ${mono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-bg0">
        <span
          hidden
          aria-hidden
          dangerouslySetInnerHTML={{
            __html: `<!--
THESIS: The official companion portal of the RTS Hardline: dense live telemetry of a police/crime war at night, lit by the city itself. Refuses the category default - dark SaaS dashboard of identical rounded cards.
OWN-WORLD: Night Dispatch, per the owner's binding brief: dark layered surfaces on a cold asphalt substrate (#090b0f), translucency as interface layers, red and blue as LIGHT (ambient washes, luminous rules, the active-nav strike) - never as button fill. Rectangular 0-6px geometry, hairline seams, mono telemetry type (Martian Mono uppercase) against macro display blocks (Tektur), terminal green reserved for the live indicator.
STORY: A player opens a living system - live counts, clan operations - checks their stats and ratings, drills into match reports.
FIRST VIEWPORT: Split console under ambient red/blue light: command column with the operator card and live telemetry, data stream of operations and matches to the right.
SIGNATURE INTERACTION: GSAP entrance choreography plus live counters ticking in mono.
FORM: Direction pinned by the owner's brief (Battlefield Hardline atmosphere + Battlelog density + modern tactical web UI), implemented under the ui-skills baseline (compositor-only motion, tabular numerals, layered translucency).
FINISH: unreviewed and undocumented is unfinished.
-->`,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <div className="ambient-light" aria-hidden />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
