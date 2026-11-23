"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Clock } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { HUB_COLORS, HubKey } from "@/lib/brand"
import { HUBS, sortItemsByPrice } from "@/lib/data"
import { HubIcon } from "./shared"
import { getTurnaround, serviceRouteFor, type SelectedService } from "./lib"
import { ServiceDetailModal } from "./service-detail-modal"

export function ServiceDetailPage({ service }: { service: SelectedService }) {
  const [requestOpen, setRequestOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const hub = HUBS[service.hubId]
  const colors = HUB_COLORS[service.hubId as HubKey]
  const accent = resolvedTheme === "dark" ? colors.accentDark : colors.accentLight
  const turnaround = service.turnaround ?? getTurnaround(service.sectionTitle, service.name)
  const relatedServices = sortItemsByPrice(
    hub.sections.find((section) => section.title === service.sectionTitle)?.items.filter((item) => item.name !== service.name) ?? [],
  )

  return (
    <main id="main-content" className="min-h-screen bg-background pb-24">
      <header className="abh-editorial-hero abh-service-detail-hero">
        <Link href={`/services/${service.hubId}`} aria-label={`Back to ${hub.title}`} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <span className="inline-flex size-10 items-center justify-center text-muted-foreground">
            <HubIcon id={service.hubId} size={20} color="currentColor" />
          </span>
          <ArrowLeft size={15} aria-hidden="true" className="text-muted-foreground transition-colors hover:text-[var(--hub-accent)]" style={{ ["--hub-accent" as string]: accent }} />
        </Link>
        <span className="abh-eyebrow mb-2">
          {hub.title}
        </span>
        <h1 className="abh-page-title mb-5">{service.name}</h1>
        <p className="abh-tagline max-w-2xl text-base md:text-lg">{service.desc || `Professional ${service.name.toLowerCase()} from the ${hub.title}.`}</p>
        <div className="abh-divider" />
      </header>

      <div id="service-actions" className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-10 md:px-8">
        <span className="font-heading text-3xl font-medium tracking-tight md:text-4xl" style={{ color: accent }}>{service.price}</span>
        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Clock size={16} aria-hidden="true" />{turnaround}</span>
        <button
          type="button"
          onClick={() => setRequestOpen(true)}
          className="abh-service-request-cta inline-flex min-h-11 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-[color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          Request this service
          <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div id="service-details" className="mx-auto grid max-w-[1080px] scroll-mt-24 gap-5 px-4 md:grid-cols-2 md:px-8">
        <section className="abh-service-info-card abh-card-rule p-6 md:p-8" aria-labelledby="service-requirements">
          <p className="abh-eyebrow mb-3">Before you visit</p>
          <h2 id="service-requirements" className="font-heading text-2xl font-medium tracking-tight text-foreground">What to bring</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {(service.requirements.length ? service.requirements : ["Bring your file, document or USB drive — we’ll guide you through the rest."]).map((requirement) => (
              <li key={requirement} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} aria-hidden="true" />
                {requirement}
              </li>
            ))}
          </ul>
        </section>

        <section className="abh-service-info-card abh-card-rule p-6 md:p-8" aria-labelledby="service-overview">
          <p className="abh-eyebrow mb-3">Service overview</p>
          <h2 id="service-overview" className="font-heading text-2xl font-medium tracking-tight text-foreground">How it works</h2>
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">Bring the listed items and we&apos;ll walk through {service.name.toLowerCase()} with you. We&apos;ll confirm the details before getting started. Typical turnaround: {turnaround}.</p>
          {service.tips?.length ? (
            <div className="mt-6 border-t border-border/60 pt-5">
              <h3 className="text-sm font-medium text-foreground">Helpful tips</h3>
              <ul className="mt-3 flex flex-col gap-2">
                {service.tips.map((tip) => <li key={tip} className="text-sm leading-relaxed text-muted-foreground">{tip}</li>)}
              </ul>
            </div>
          ) : null}
          <button type="button" onClick={() => setRequestOpen(true)} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground">
            Start a request <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </section>
      </div>

      {relatedServices.length > 0 && (
        <section className="mx-auto mt-10 max-w-[1080px] border-t border-[var(--line-rule)] px-4 pt-7 md:px-8" aria-labelledby="related-services-heading">
          <p className="abh-eyebrow">More in this category</p>
          <h2 id="related-services-heading" className="mt-2 font-heading text-2xl font-medium tracking-tight text-foreground">
            More {service.sectionTitle}
          </h2>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 md:justify-start">
            {relatedServices.map((item) => (
              <Link
                key={item.name}
                href={serviceRouteFor(service.hubId, service.sectionTitle, item.name)}
                className="group inline-flex items-center rounded-[14px] px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--line-rule)]/50"
              >
                <span>{item.name}</span>
                <span className="ml-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100" style={{ color: accent }}>↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <ServiceDetailModal svc={requestOpen ? service : null} onClose={() => setRequestOpen(false)} />
    </main>
  )
}
