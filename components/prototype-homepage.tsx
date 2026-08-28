"use client"

import {
  ClipboardText,
  FileText,
  Gear,
  Globe,
  Laptop,
  PaintBrush,
  Palette,
  Printer,
  Wrench,
} from "@phosphor-icons/react"
import { BRAND_HEX, BIZ } from "@/lib/brand"

type HubKey = "print" | "doc" | "design" | "eservice" | "tech"

const HUBS: Array<{
  key: HubKey
  label: string
  color: string
  icons: React.ElementType[]
}> = [
  { key: "print", label: "PRINT", color: BRAND_HEX.support, icons: [Printer] },
  { key: "doc", label: "DOCU", color: BRAND_HEX.support, icons: [ClipboardText] },
  { key: "design", label: "DESIGN", color: BRAND_HEX.cta, icons: [Palette, PaintBrush] },
  { key: "eservice", label: "E-SERVICE", color: BRAND_HEX.highlight, icons: [Globe, FileText] },
  { key: "tech", label: "TECH", color: BRAND_HEX.highlight, icons: [Laptop, Wrench, Gear] },
]

const TICKER = "PRINT & COPY WHILE YOU WAIT  •  CVS THAT HELP YOU GET HIRED  •  DESIGN THAT FEELS LIKE YOU  •  ONLINE HELP WITHOUT THE GUESSWORK"

function HubNode({ hub }: { hub: (typeof HUBS)[number] }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center" data-hub={hub.key}>
      <div
        className="flex min-h-14 min-w-14 items-center justify-center gap-1 rounded-2xl bg-white/10 px-3 text-white"
        style={{ color: hub.color }}
        aria-label={`${hub.label} hub`}
      >
        {hub.icons.map((Icon, index) => <Icon key={`${hub.key}-${index}`} size={22} weight="bold" aria-hidden="true" />)}
      </div>
      <span className="text-[0.62rem] font-bold tracking-[0.2em] text-white/65">{hub.label}</span>
    </div>
  )
}

export function PrototypeHomepage() {
  return (
    <>
      <section className="prototype-hero bg-background px-5 pb-12 pt-20 md:px-10 md:pb-20 md:pt-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
          <div className="max-w-2xl">
            <p className="mb-5 text-xs font-bold tracking-[0.2em] text-brand-orange">• YOUR LOCAL TECH &amp; PRINT PARTNER</p>
            <h1 className="font-heading text-5xl font-bold leading-[0.96] tracking-[-0.05em] text-foreground sm:text-7xl lg:text-[6.3rem]">
              Design.<br />Print.<br />Upgrade.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              Everyday digital and print work, handled with clarity, care and a little more confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a href="#quote" className="inline-flex items-center rounded-full bg-brand-orange px-6 py-3.5 font-bold text-white transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight focus-visible:ring-offset-2">
                Start with a quote ↗
              </a>
              <a href="#services" className="font-bold text-foreground underline decoration-brand-orange decoration-2 underline-offset-8 transition-colors hover:text-brand-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight">
                See all services ↓
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
              <span>✓ Local &amp; human</span><span>•</span><span>✓ Clear pricing</span><span>•</span><span>✓ Fast turnaround</span>
            </div>
          </div>

          <div className="rounded-[28px] bg-brand-surface p-6 text-white md:p-8">
            <div className="flex items-start justify-between text-[0.64rem] font-bold tracking-[0.18em] text-white/55">
              <span>APEXBYTESHUB / KGOTSONG</span>
              <span className="flex items-baseline gap-2 text-brand-orange"><strong className="font-heading text-6xl leading-none">05</strong><span>HUBS</span></span>
            </div>
            <div className="grid grid-cols-2 gap-6 py-16 sm:grid-cols-3 sm:gap-8">
              {HUBS.map((hub) => <HubNode key={hub.key} hub={hub} />)}
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-5 text-[0.62rem] font-bold tracking-[0.18em] text-white/55">
              <span>ONE LOCAL PARTNER</span><span>LOCAL / DIGITAL / PRINT</span>
            </div>
          </div>
        </div>
      </section>

      <div className="overflow-hidden bg-brand-support py-3 text-[0.68rem] font-bold tracking-[0.16em] text-white" aria-label="Service ticker">
        <div className="whitespace-nowrap text-center">{TICKER}</div>
      </div>

      <section id="services" className="bg-background px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs font-bold tracking-[0.2em] text-brand-orange">• THE HUB SYSTEM</p>
          <h2 className="font-heading text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-6xl">One place. Five ways.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {HUBS.map((hub) => (
              <a key={hub.key} href="/services" className="group rounded-2xl bg-card p-6 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1" style={{ color: hub.color }}>
                    {hub.icons.map((Icon, index) => <Icon key={`${hub.key}-card-${index}`} size={24} weight="bold" aria-hidden="true" />)}
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">0{HUBS.indexOf(hub) + 1}</span>
                </div>
                <h3 className="mt-10 font-heading text-xl font-bold text-foreground">{hub.label === "DOCU" ? "Docu Hub" : `${hub.label.charAt(0)}${hub.label.slice(1).toLowerCase()} Hub`}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{BIZ.tagline}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
