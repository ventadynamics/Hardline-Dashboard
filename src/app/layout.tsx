import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter_Tight, JetBrains_Mono, Oswald } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import "./globals.css";

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

const display = Oswald({
  variable: "--font-display-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
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
OWN-WORLD: Redline, per the owner's binding brief: dark layered surfaces on a wet-asphalt substrate (#06080c), translucency as interface layers, red and blue as LIGHT (ambient washes, the hardline strip, edge glows, luminous rules) - never as button fill. Rectangular 0-6px geometry with the signature 45-degree cut, hairline seams, mono telemetry type (JetBrains Mono uppercase) against tall condensed poster display (Oswald), terminal green reserved for the live indicator.
STORY: A player opens a living system - live counts, clan operations - checks their stats and ratings, drills into match reports.
FIRST VIEWPORT: Cinematic dispatch hero: poster-scale condensed headline under the red/blue city light, operator card on the blue-lit flank, live telemetry running along the base.
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
