import Link from "next/link"
import { EditorialScrollCue } from "@/components/editorial-scroll-cue"
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react/dist/ssr"
import { HUB_COLORS, HubKey } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { HubIcon } from "./shared"
import { serviceRouteFor } from "./lib"

export function ServiceHubRoutePage({ hubId }: { hubId: HubId }) {
  const hub = HUBS[hubId]
  const accent = HUB_COLORS[hubId as HubKey].accentLight

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="abh-editorial-hero">
        <Link href="/services" aria-label="Back to all services" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground shadow-sm transition-[background-color,box-shadow,transform] hover:-translate-y-0.5 hover:bg-card hover:shadow-[var(--shadow-card-lift)]">All</span>
          <ArrowLeft size={15} aria-hidden="true" />
        </Link>
        <span className="mb-5 inline-flex items-center text-muted-foreground" title={`${hub.title} icon`} aria-label={hub.title}>
          <HubIcon id={hubId} size={34} color={accent} weight="fill" />
        </span>
        <h1 className="abh-page-title mb-5">{hub.title}</h1>
        <p className="abh-tagline max-w-2xl text-base md:text-lg">{hub.desc}</p>
        <div className="abh-divider" />
        <EditorialScrollCue />
      </header>

      <div className="mx-auto flex max-w-[1248px] flex-col gap-14 px-4 md:px-8">
        <p className="text-center text-sm text-muted-foreground">{hub.sections.length} service categories · {hub.turnaround}</p>
        {hub.sections.map((section, sectionIndex) => (
          <section key={section.title} aria-labelledby={`section-${sectionIndex}`}>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em]" style={{ color: accent }}>{hub.title}</p>
                <h2 id={`section-${sectionIndex}`} className="font-heading text-3xl font-medium tracking-tight text-foreground md:text-4xl">{section.title}</h2>
                {section.desc && <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">{section.desc}</p>}
              </div>
              <span className="hidden shrink-0 text-sm text-muted-foreground sm:block">{section.items.length} services</span>
            </div>

            <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item, itemIndex) => (
                <li key={item.name}>
                  <Link
                    href={serviceRouteFor(hubId, section.title, item.name)}
                    className="group flex h-full min-h-48 flex-col rounded-[14px] border border-border/50 bg-card/60 p-5 transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:bg-card hover:shadow-[var(--shadow-card-lift)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{String(itemIndex + 1).padStart(2, "0")}</span>
                      <span className="text-base font-medium" style={{ color: accent }}>{item.price}</span>
                    </div>
                    <h3 className="font-heading text-xl font-medium leading-snug tracking-tight text-foreground md:text-2xl">{item.name}</h3>
                    <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground">{item.description || "View service details and what to bring."}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-base font-medium text-foreground">
                      View service
                      <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  )
}
