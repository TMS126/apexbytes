// components/home-hub-card.tsx
"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { HUB_COLORS } from "@/lib/brand"
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
      className="group/hub-icon flex min-h-[176px] w-full flex-col items-center justify-center gap-4 border border-transparent px-3 py-6 text-center transition-[border-color,background-color,transform] duration-250 ease-out hover:-translate-y-1 hover:border-[var(--hub-primary)] hover:bg-[color-mix(in_srgb,var(--hub-primary)_6%,transparent)] focus-visible:outline-none focus-visible:border-[var(--hub-primary)] sm:min-h-[204px] sm:px-5 sm:py-8"
      aria-label={`Explore ${hub.title}`}
    >
      <span className="flex h-16 w-16 items-center justify-center border border-transparent transition-[border-color,transform] duration-250 ease-out group-hover/hub-icon:border-[var(--hub-primary)] group-hover/hub-icon:-translate-y-1 group-hover/hub-icon:rotate-[-5deg] sm:h-20 sm:w-20">
        <Icon size={42} weight="regular" aria-hidden="true" className="text-muted-foreground transition-[color,transform] duration-250 ease-out group-hover/hub-icon:scale-110 group-hover/hub-icon:text-[var(--hub-primary)] sm:size-[52px]" />
      </span>
      <span className="font-heading text-lg font-semibold leading-tight text-foreground sm:text-xl md:text-2xl">{hub.title}</span>
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground sm:text-sm sm:tracking-[0.14em]">{serviceCount} services</span>
    </Link>
  )

  const description = (
    <div className="flex min-h-[176px] flex-col justify-center px-1 py-8 sm:min-h-[204px] sm:px-4 sm:py-10 md:px-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:text-sm">{CLIENT_TITLE[hubId]}</p>
      <h3 className="font-heading text-lg font-semibold leading-tight text-card-foreground sm:text-xl md:text-2xl">{hub.title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base sm:leading-8 md:text-[1.05rem]">{BLURB[hubId]}</p>
      <div className="mt-7 flex flex-col gap-3 rounded-[18px] border border-border/70 bg-card/35 px-4 py-3.5 transition-[border-color,background-color] duration-250 ease-out sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-sm">Explore the hub</span>
        <Link href={hubRouteFor(hubId)} className="group/cta relative w-fit px-0 py-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-[var(--hub-primary)] focus-visible:text-[var(--hub-primary)] sm:text-base">
          Explore {hub.title}
          <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--hub-primary)] transition-transform duration-250 ease-out group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100" />
        </Link>
      </div>
    </div>
  )

  return (
    <div
      style={{
        ["--hub-primary" as string]: HUB_COLORS[hubId].primary,
      }}
      className={cn("grid grid-cols-[minmax(116px,34%)_1fr] gap-4 md:grid-cols-[minmax(190px,260px)_1fr] md:items-stretch md:gap-8", flip && "grid-cols-[1fr_minmax(116px,34%)] md:grid-cols-[1fr_minmax(190px,260px)]")}
    >
      {flip ? <>{description}{card}</> : <>{card}{description}</>}
    </div>
  )
}
