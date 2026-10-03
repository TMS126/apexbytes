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
      <p className="font-sans font-black text-2xl md:text-3xl text-foreground leading-snug max-w-2xl mx-auto">
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
      className="group/sectioncard text-left rounded-[14px] bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lift)] active:scale-[0.98] p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="flex items-center gap-2 font-black text-[1.02rem] text-foreground leading-tight break-words">
          <ServiceIcon name={section.title} size={20} />
          <span>{section.title}</span>
        </h4>
      </div>

      {section.desc && (
        <p className="text-[0.82rem] text-muted-foreground leading-snug mb-4">
          {section.desc}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[0.78rem] font-bold" style={{ color: accent }}>
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
      className="group/svccard text-left rounded-[14px] bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-lift)] active:scale-[0.98] p-4 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-foreground leading-snug flex items-start gap-2 min-w-0">
          <ServiceIcon name={item.name} size={19} />
          <span className="break-words">{item.name}</span>
        </span>
      </div>

      <p className="text-[0.8rem] text-muted-foreground leading-snug mb-3 flex-1">
        {item.description || "Tap to view full pricing and details."}
      </p>

      <span
        className="inline-flex items-center gap-1 text-[0.78rem] font-black transition-colors duration-200"
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
