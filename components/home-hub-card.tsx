// components/home-hub-card.tsx
"use client"

import Link from "next/link"
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

export function HomeHubCard({ hubId }: { hubId: HubId }) {
  const hub = HUBS[hubId]
  const Icon = HUB_ICON[hubId]
  const serviceCount = hub.sections.reduce((total, section) => total + section.items.length, 0)
  const card = (
    <Link
      href={hubRouteFor(hubId)}
      className="group/hub-icon relative flex min-h-[120px] w-full flex-col items-center justify-center gap-3 rounded-[14px] px-3 py-5 text-center transition-[background-color,box-shadow] duration-200 ease-out hover:bg-[color-mix(in_srgb,var(--hub-primary)_6%,transparent)] hover:shadow-md focus-visible:outline-none sm:min-h-[148px] sm:px-5 sm:py-6"
      aria-label={`Explore ${hub.title}`}
    >
      <span className="flex size-12 items-center justify-center sm:size-14">
        <Icon size={38} weight="regular" aria-hidden="true" className="text-muted-foreground transition-colors duration-200 group-hover/hub-icon:text-[var(--hub-primary)] sm:size-11" />
      </span>
      <span aria-hidden="true" className="absolute bottom-3 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[var(--hub-primary)] transition-[width] duration-200 ease-out group-hover/hub-icon:w-14 group-focus-visible/hub-icon:w-14" />
      <span className="font-heading text-base font-semibold leading-tight text-foreground sm:text-lg md:text-xl">{CLIENT_TITLE[hubId]}</span>
      <span className="text-xs font-medium text-muted-foreground">{serviceCount} services</span>
    </Link>
  )

  const description = (
    <div className="flex min-h-[120px] flex-col items-start justify-center px-1 py-5 text-left sm:min-h-[148px] sm:px-4 sm:py-6 md:px-8">
      <p className="mt-3 max-w-2xl text-[1.125rem] leading-7 text-muted-foreground sm:mt-4 sm:leading-8">{BLURB[hubId]}</p>
      <Link href={hubRouteFor(hubId)} className="group/cta relative mt-7 w-fit px-0 py-1.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:text-[var(--hub-primary)] focus-visible:text-[var(--hub-primary)] sm:text-base">
        Explore hub
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--hub-primary)] transition-transform duration-250 ease-out group-hover/cta:scale-x-100 group-focus-visible/cta:scale-x-100" />
      </Link>
    </div>
  )

  return (
    <div
      style={{
        ["--hub-primary" as string]: HUB_COLORS[hubId].primary,
      }}
        className="grid grid-cols-[minmax(116px,34%)_1fr] items-center gap-3 md:grid-cols-[minmax(190px,240px)_1fr] md:gap-5"
    >
      {card}{description}
    </div>
  )
}
