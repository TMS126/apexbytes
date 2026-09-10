// components/core-hub-grid.tsx
// Landing-page-only "Core Service Hubs" section. Presentation grouping
// ONLY — no changes to lib/data, HUB_COLORS, the Services page, or the
// Contact form's hub dropdown.
//
// ACCENT PASS: icon tiles and the "Explore" link are neutral at rest —
// hub color only appears once the card is hovered/focused, using the
// same --hub-accent CSS-variable + group-hover pattern already used in
// services-page/index.tsx, so this stays consistent with the rest of
// the site rather than inventing a new convention. The small arrow icon
// is the one minimal "seal orange" accent, always visible, matching the
// reference screenshot.

import { Printer, FileText, PaintBrush, Globe, Desktop, ArrowUpRight } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { HUB_COLORS, TOKEN } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

const CATEGORY_DATA = [
  {
    id: "print-doc",
    label: "Print & Document",
    blurb: "Fast printing, copying, typing, and laminating — while you wait.",
    icon: Printer,
    hubs: [
      {
        hubId: "print" as const,
        name: "Print Hub",
        highlights: [
          { name: "B&W Print", price: "R5/page" },
          { name: "Colour Print", price: "R8/page" },
          { name: "Glossy Photo (A4)", price: "R40" },
        ],
      },
      {
        hubId: "doc" as const,
        name: "Docu Hub",
        highlights: [
          { name: "CV from Scratch", price: "R30" },
          { name: "Laminating A4", price: "R20" },
          { name: "Scan to Digital", price: "R5/page" },
        ],
      },
    ],
  },
  {
    id: "design",
    label: "Design & Content",
    blurb: "Logos, business cards, flyers, and social media — custom-made.",
    icon: PaintBrush,
    hubs: [
      {
        hubId: "design" as const,
        name: "Design Hub",
        highlights: [
          { name: "Logo (Standard)", price: "R500" },
          { name: "Business Card (Double Side)", price: "R180" },
          { name: "Flyer (Custom)", price: "R250" },
        ],
      },
    ],
  },
  {
    id: "eservice",
    label: "Administrative & Compliance",
    blurb: "SASSA, SARS, NSFAS, and other official applications — done for you.",
    icon: Globe,
    hubs: [
      {
        hubId: "eservice" as const,
        name: "E-Service Hub",
        highlights: [
          { name: "SASSA SRD Application", price: "R40" },
          { name: "SARS New Taxpayer / eFiling", price: "R70" },
          { name: "NSFAS Application", price: "R80" },
        ],
      },
    ],
  },
  {
    id: "tech",
    label: "Tech & Support",
    blurb: "PC setup, virus removal, and Windows installs — sorted properly.",
    icon: Desktop,
    hubs: [
      {
        hubId: "tech" as const,
        name: "Tech Hub",
        highlights: [
          { name: "PC Setup", price: "R250" },
          { name: "Virus / Malware Removal", price: "R200" },
          { name: "Windows Install + Activation", price: "R350" },
        ],
      },
    ],
  },
]

export function CoreHubGrid() {
  return (
    <section className="px-4 md:px-8 py-14 md:py-20" aria-labelledby="core-hubs-title">
      <div className="max-w-[1240px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10 md:mb-12">
            <h2 id="core-hubs-title" className="abh-section-heading text-center mt-0">
              What We Can Help With
            </h2>
            <p className="abh-tagline max-w-lg mx-auto mt-3">
              Four categories, five hubs, one place to sort it all out.
            </p>
          </div>
        </ScrollBounce>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATEGORY_DATA.map((category, index) => {
            const CategoryIcon = category.icon
            const primaryHub = category.hubs[0].hubId
            const primaryAccent = HUB_COLORS[primaryHub].accentLight

            return (
              <ScrollBounce key={category.id} delay={index * 0.08}>
                <div
                  className="group/hubcat abh-card flex flex-col h-full p-6 md:p-7 transition-transform duration-300 hover:-translate-y-1"
                  style={{ ["--hub-accent" as any]: primaryAccent }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {/* Neutral at rest, hub-colored on hover — matches the
                        reference: plain outline icon until interacted with. */}
                    <div className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 bg-secondary text-muted-foreground transition-colors duration-200 group-hover/hubcat:text-[var(--hub-accent)]">
                      <CategoryIcon size={26} weight="regular" aria-hidden="true" />
                    </div>
                    <h3 className="font-heading font-medium text-xl text-card-foreground">
                      {category.label}
                    </h3>
                  </div>

                  <p className="abh-body text-[0.92rem] mb-5">{category.blurb}</p>

                  <div className="flex flex-col gap-4 mb-6 flex-1">
                    {category.hubs.map((hub) => (
                      <div key={hub.hubId}>
                        {category.hubs.length > 1 && (
                          <p className="text-[0.68rem] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
                            {hub.name}
                          </p>
                        )}
                        <ul className="flex flex-col gap-1">
                          {hub.highlights.map((item) => (
                            <li
                              key={item.name}
                              className="flex items-center justify-between gap-3 text-[0.86rem]"
                            >
                              <span className="truncate text-muted-foreground">{item.name}</span>
                              <span className="font-black text-card-foreground shrink-0">{item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Minimal "Explore" treatment: plain neutral text, no
                      border/tinted-fill pill. Hub color only on hover of
                      the card (via --hub-accent), same as the icon tile
                      above. The arrow alone stays a fixed, minimal seal-
                      orange accent — always visible, matching the
                      reference screenshot's small orange arrow. */}
                  <div className="flex flex-wrap gap-4 mt-auto">
                    {category.hubs.map((hub) => (
                      <a
                        key={hub.hubId}
                        href={`/services?hub=${hub.hubId}`}
                        className={cn(
                          "inline-flex items-center gap-1.5 text-[0.84rem] font-black text-muted-foreground transition-colors duration-200",
                          "group-hover/hubcat:text-[var(--hub-accent)]"
                        )}
                      >
                        {category.hubs.length > 1 ? `Explore ${hub.name}` : "Explore Services"}
                        <ArrowUpRight size={14} weight="bold" style={{ color: TOKEN.orangeText }} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                </div>
              </ScrollBounce>
            )
          })}
        </div>
      </div>
    </section>
  )
                  } 
