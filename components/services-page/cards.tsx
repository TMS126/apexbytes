// components/services-page/cards.tsx
"use client"

import { ArrowRight, CaretRight } from "@phosphor-icons/react"
import { HUBS, HubId } from "@/lib/data"
import { ServiceIcon } from "./shared"

// ============================================================
// CLOSING TAGLINE
// ============================================================
export function ClosingTagline() {
  return (
    <div className="mt-2 mb-4 text-center px-6 py-6">
      <p className="abh-eyebrow text-muted-foreground mb-3">Why ApexbytesHub</p>
      <p className="font-sans font-medium text-2xl md:text-3xl text-foreground leading-snug max-w-2xl mx-auto">
        From your first CV to your next big idea — one hub does it all, right here in Bothaville.
      </p>
      <div className="abh-divider" />
    </div>
  )
}

// ============================================================
// LEVEL 1 — SECTION CARD (desktop drill-down)
// ============================================================
export function SectionCard({
  section, accent, onClick,
}: {
  section: (typeof HUBS)[HubId]["sections"][number]
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ["--card-accent" as string]: accent }}
      className="group/sectioncard min-h-[190px] overflow-hidden rounded-[14px] border border-border bg-card p-6 text-left transition-[background-color,color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--card-accent)] hover:text-[var(--on-brand-blue)] hover:shadow-[var(--shadow-card-lift)] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="flex items-center gap-2 font-medium text-[1.08rem] text-foreground leading-tight break-words transition-colors group-hover/sectioncard:text-[var(--on-brand-blue)]">
          <ServiceIcon name={section.title} size={20} />
          <span>{section.title}</span>
        </h4>
      </div>

      {section.desc && (
        <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-5 transition-colors group-hover/sectioncard:text-[var(--on-brand-blue)]/80">
          {section.desc}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[0.82rem] font-semibold" style={{ color: accent }}>
          {section.items.length} service{section.items.length === 1 ? "" : "s"}
        </span>
        <CaretRight
          size={15}
          weight="bold"
          className="transition-transform duration-200 group-hover/sectioncard:translate-x-0.5"
          style={{ color: accent }}
          aria-hidden="true"
        />
      </div>
    </button>
  )
}

// ============================================================
// LEVEL 2 — SERVICE CARD (desktop drill-down)
// ============================================================
export function ServiceCard({
  item, accent, onClick,
}: {
  item: { name: string; price: string; description?: string }
  accent: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ["--card-accent" as string]: accent }}
      className="group/svccard min-h-[170px] flex flex-col overflow-hidden rounded-[14px] border border-border bg-card p-5 text-left transition-[background-color,color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-[var(--card-accent)] hover:text-[var(--on-brand-blue)] hover:shadow-[var(--shadow-card-lift)] active:scale-[0.98]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-foreground leading-snug flex items-start gap-2 min-w-0 transition-colors group-hover/svccard:text-[var(--on-brand-blue)]">
          <ServiceIcon name={item.name} size={19} />
          <span className="break-words">{item.name}</span>
        </span>
      </div>

      <p className="text-[0.88rem] text-muted-foreground leading-relaxed mb-4 flex-1 transition-colors group-hover/svccard:text-[var(--on-brand-blue)]/80">
        {item.description || "Tap to view full pricing and details."}
      </p>

      <span
        className="inline-flex items-center gap-1 text-[0.78rem] font-medium transition-colors duration-200"
        style={{ color: accent }}
      >
        View details
        <ArrowRight
          size={11}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/svccard:translate-x-0.5"
        />
      </span>
    </button>
  )
}
