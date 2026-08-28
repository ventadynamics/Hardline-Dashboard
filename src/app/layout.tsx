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
THESIS: The official companion portal of the RTS Hardline: dense live telemetry of a police/crime war, engineered like an industrial print-terminal hybrid. Refuses the category default - dark SaaS dashboard of identical rounded cards.
OWN-WORLD: Tactical-telemetry brutalism on a deactivated-CRT substrate (#0b0c0d): phosphor ink, hazard-red structural accent (rules, strikes, alerts), police-blue reserved for data semantics, terminal green only on the live indicator. 90-degree geometry, visible 1-2px compartments, grid-seam dividers, mono telemetry type (JetBrains Mono uppercase) against macro display blocks (Unbounded), halftone-degraded imagery, CRT scanlines, mechanical noise.
STORY: A player opens a living system - live counts, clan operations - checks their stats and ratings, drills into match reports.
FIRST VIEWPORT: Print-poster hero: massive HARDLINE block type over a halftoned cruiser cutout, red structural rules, mono telemetry strip of live counters along the base.
SIGNATURE INTERACTION: GSAP entrance choreography plus live counters ticking in mono.
FORM: Direction pinned by the owner's brief fused with the industrial-brutalist-ui skill (Tactical Telemetry mode); concept roll skipped per brief-pinned rule.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
-->`,
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        <div className="grain-overlay" aria-hidden />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
