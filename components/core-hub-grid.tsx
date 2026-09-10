// components/core-hub-grid.tsx
// Landing-page-only "Core Service Hubs" section. Presentation grouping
// ONLY — no changes to lib/data, HUB_COLORS, the Services page, or the
// Contact form's hub dropdown. Under the hood there are still 5 real
// hubs (Print, Doc, Design, E-Service, Tech); this component just
// displays them as 4 marketing-facing categories, per the landing-page
// restructure plan. Print + Docu are merged into one card visually, but
// still route to their own separate /services?hub=X pages, since they
// remain genuinely separate hubs everywhere else in the app.

import { Printer, FileText, PaintBrush, Globe, Desktop, ArrowUpRight } from "@phosphor-icons/react"
import { HUB_COLORS } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

// Real services + real prices, taken directly from your pasted price
// list — not generated or guessed. Each hub shows 3 representative
// items so visitors get a concrete sense of pricing before clicking in.
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
            <h2 id="core-hubs-title" className="font-sans font-black text-3xl md:text-4xl tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              What We Can Help With
            </h2>
            <p className="abh-tagline max-w-lg mx-auto">
              Four categories, five hubs, one place to sort it all out.
            </p>
          </div>
        </ScrollBounce>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATEGORY_DATA.map((category, index) => {
            const CategoryIcon = category.icon
            // Accent comes from the FIRST underlying hub in this
            // category (e.g. Print for the merged Print & Document
            // card) — categories with one hub just use that hub's
            // color directly.
            const primaryHub = category.hubs[0].hubId
            const accentLight = HUB_COLORS[primaryHub].accentLight
            const accentDark = HUB_COLORS[primaryHub].accentDark

            return (
              <ScrollBounce key={category.id} delay={index * 0.08}>
                <div
                  className="group/hubcat relative flex flex-col h-full rounded-[14px] bg-white dark:bg-zinc-950 abh-shadow-card p-6 md:p-7 transition-all duration-300 hover:-translate-y-1"
                  style={{ ["--hub-accent" as any]: accentLight, ["--hub-accent-dark" as any]: accentDark }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0 transition-colors duration-300"
                      style={{ backgroundColor: `${accentLight}15`, color: accentLight }}
                    >
                      <CategoryIcon size={26} weight="fill" aria-hidden="true" />
                    </div>
                    <h3 className="font-sans font-black text-xl text-zinc-900 dark:text-zinc-50">
                      {category.label}
                    </h3>
                  </div>

                  <p className="abh-body text-[0.92rem] mb-5">{category.blurb}</p>

                  {/* Real service highlights, grouped per underlying
                      hub when a category spans more than one (Print &
                      Document). */}
                  <div className="flex flex-col gap-4 mb-6 flex-1">
                    {category.hubs.map((hub) => (
                      <div key={hub.hubId}>
                        {category.hubs.length > 1 && (
                          <p className="text-[0.68rem] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1.5">
                            {hub.name}
                          </p>
                        )}
                        <ul className="flex flex-col gap-1">
                          {hub.highlights.map((item) => (
                            <li
                              key={item.name}
                              className="flex items-center justify-between gap-3 text-[0.86rem] text-zinc-600 dark:text-zinc-400"
                            >
                              <span className="truncate">{item.name}</span>
                              <span className="font-black text-zinc-800 dark:text-zinc-200 shrink-0">{item.price}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* One link per underlying hub — a merged category
                      (Print & Document) gets two separate pills rather
                      than one link picking a "winner" hub, since both
                      remain fully distinct hubs on the actual Services
                      page. */}
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {category.hubs.map((hub) => (
                      <a
                        key={hub.hubId}
                        href={`/services?hub=${hub.hubId}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-[10px] text-[0.84rem] font-black text-white transition-all duration-200 active:scale-95 hover:-translate-y-0.5"
                        style={{ backgroundColor: HUB_COLORS[hub.hubId].accentLight }}
                      >
                        {category.hubs.length > 1 ? `Explore ${hub.name}` : "Explore Services"}
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
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
