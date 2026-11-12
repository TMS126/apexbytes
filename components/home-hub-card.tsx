// components/home-hub-card.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HUB_ON_COLOR } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { HUB_ICON } from "@/components/services-page/mobile-hub-card"
import { hubRouteFor } from "@/components/services-page/lib"

const CLIENT_TITLE: Record<HubId, string> = {
  print: "Print what matters",
  doc: "Get your documents sorted",
  design: "Make your idea look the part",
  eservice: "Get official tasks done",
  tech: "Get your tech working again",
}

const BLURB: Record<HubId, string> = {
  print: "Fast printing, copying and photo prints — ready while you wait. Bring us a page, a project or a full batch and leave with something you can use.",
  doc: "CVs, typing, scanning and laminating — sorted the same day. We make the admin side feel simple, clear and ready to submit.",
  design: "Logos, business cards, flyers and social media — custom-made. Start with a rough idea and we will help turn it into something people notice.",
  eservice: "SASSA, SARS, NSFAS and other official applications — done for you. We help you navigate the details, upload the right documents and move forward.",
  tech: "PC setup, virus removal and Windows installs — sorted properly. Practical help for the everyday tech problems that slow you down.",
}

export function HomeHubCard({ hubId, flip = false }: { hubId: HubId; flip?: boolean }) {
  const hub = HUBS[hubId]
  const Icon = HUB_ICON[hubId]
  const serviceCount = hub.sections.reduce((total, section) => total + section.items.length, 0)
  const card = (
    <Link
      href={hubRouteFor(hubId)}
      className="group flex aspect-square min-h-[180px] w-full flex-col items-center justify-center rounded-[14px] p-6 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none"
      style={{ backgroundColor: "var(--hub-fill)", color: "var(--hub-on)" }}
      aria-label={`Explore ${hub.title}`}
    >
      <Icon size={54} weight="fill" aria-hidden="true" className="mb-4 transition-transform duration-200 group-hover:scale-105" />
      <span className="font-heading text-xl font-semibold leading-tight md:text-2xl">{hub.title}</span>
      <span className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] opacity-80">{serviceCount} services</span>
    </Link>
  )

  const description = (
    <div className="flex min-h-[180px] flex-col justify-center rounded-[14px] border border-border bg-card px-6 py-7 md:px-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{CLIENT_TITLE[hubId]}</p>
      <h3 className="font-heading text-xl font-semibold leading-tight text-card-foreground md:text-2xl">{hub.title}</h3>
      <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground md:text-base">{BLURB[hubId]}</p>
      <Link href={hubRouteFor(hubId)} className="abh-line-cta mt-5 w-fit px-1 py-2 text-sm font-semibold">Explore {hub.title}</Link>
    </div>
  )

  return (
    <div
      style={{
        ["--hub-fill" as string]: HUB_COLORS[hubId].primary,
        ["--hub-on" as string]: HUB_ON_COLOR[hubId],
      }}
      className={cn("grid gap-4 md:grid-cols-[minmax(180px,260px)_1fr] md:items-stretch", flip && "md:grid-cols-[1fr_minmax(180px,260px)]")}
    >
      {flip ? <>{description}{card}</> : <>{card}{description}</>}
    </div>
  )
}
