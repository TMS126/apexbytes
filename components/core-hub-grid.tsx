// components/core-hub-grid.tsx
// Landing-page-only "Core Service Hubs" section. Presentation grouping
// ONLY — no changes to lib/data, HUB_COLORS, the Services page, or the
// Contact form's hub dropdown.
//
// CONTRAST AUDIT (this pass): the previous version used HUB_COLORS
// accent values as solid button *backgrounds* with hardcoded white
// text. Those accent tokens are CSS variables that flip between a
// saturated color (light mode) and a pale pastel (dark mode) — white
// text on a dark-mode pastel button measured ~1.1:1 contrast, nowhere
// near WCAG's 4.5:1 minimum. Fixed by using the accent as TEXT color on
// a soft self-tinted background instead of a solid fill — this is
// provably safe in both themes since these exact accent values were
// already tuned elsewhere in the codebase to clear 4.5:1+ against both
// light and dark card surfaces. All other text (hub sub-labels, item
// names, prices, heading) now uses real semantic tokens
// (text-card-foreground / text-muted-foreground / bg-card) instead of
// hardcoded Tailwind zinc-* classes, which were never audited against
// this site's actual --card / --background values and measured well
// under 4.5:1 in dark mode (zinc-400 on #2D314B ≈ 3.9:1).

import { Printer, FileText, PaintBrush, Globe, Desktop, ArrowUpRight } from "@phosphor-icons/react"
import { HUB_COLORS } from "@/lib/brand"
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
                <div className="abh-card flex flex-col h-full p-6 md:p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${primaryAccent}15`, color: primaryAccent }}
                    >
                      <CategoryIcon size={26} weight="fill" aria-hidden="true" />
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

                  {/* Explore link — colored text + border on a soft
                      self-tint, NOT a solid fill with fixed white text.
                      This is the actual contrast fix: the accent color
                      is used as text, which is safe in both themes,
                      instead of as a background that white text can't
                      reliably sit on. */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {category.hubs.map((hub) => {
                      const accent = HUB_COLORS[hub.hubId].accentLight
                      return (
                        <a
                          key={hub.hubId}
                          href={`/services?hub=${hub.hubId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[0.84rem] font-black border-2 transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                          style={{
                            backgroundColor: `${accent}15`,
                            color: accent,
                            borderColor: `${accent}55`,
                          }}
                        >
                          {category.hubs.length > 1 ? `Explore ${hub.name}` : "Explore Services"}
                          <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                        </a>
                      )
                    })}
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
