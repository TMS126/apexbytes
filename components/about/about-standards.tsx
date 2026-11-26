// components/about/about-standards.tsx
"use client"

import { ABOUT_STANDARDS } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
import { renderIcon } from "@/components/about/about-icons"

export function AboutStandards({ neutralColor }: { neutralColor: string }) {
  return (
    <section className="py-14 md:py-16 px-4 md:px-8 bg-zinc-50/60 dark:bg-zinc-900/20 border-t border-zinc-100 dark:border-zinc-800/60" aria-labelledby="standards-title">
      <div className="max-w-[980px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10">
            <h2 id="standards-title" className="abh-section-heading text-3xl md:text-4xl mb-3">Our Everyday Toolkit</h2>
            <p className="abh-tagline max-w-md mx-auto text-center">
              Professional accuracy, hand-finished local care — how we actually do the work.
            </p>
            <div className="abh-divider" style={{ maxWidth: "120px" }} />
          </div>
        </ScrollBounce>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-5" aria-label="Standards">
          {ABOUT_STANDARDS.map((item, index) => {
            return (
              <ScrollBounce as="li" key={item.id} delay={index * 0.1} className="group abh-card abh-card-rule flex h-full flex-col rounded-[14px] p-6">
                  <div
                    className="abh-icon-chip mb-5 flex h-11 w-11 shrink-0 items-center justify-center bg-background text-muted-foreground transition-colors group-hover:text-[var(--about-accent)]"
                    style={{ ["--about-accent" as string]: neutralColor }}
                    aria-hidden="true"
                  >
                    {renderIcon(item.iconName, "w-5 h-5")}
                  </div>
                  <h3 className="abh-card-heading text-base mb-2">{item.title}</h3>
                  <p className="abh-body text-sm leading-relaxed grow">{item.description}</p>
              </ScrollBounce>
            )
          })}
        </ul>
      </div>
    </section>
  )
} 
