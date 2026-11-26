// components/about/about-testimonials.tsx
"use client"

import { Quotes, Star, UserCircle } from "@phosphor-icons/react"
import { SAMPLE_REVIEWS } from "@/components/testimonials-section"
import { ScrollBounce } from "@/components/scroll-bounce"

function CompactTestimonials() {
  return (
    <ul className="grid auto-rows-fr grid-cols-1 items-stretch gap-5 sm:grid-cols-3" aria-label="What clients say">
      {SAMPLE_REVIEWS.map((r, i) => {
        return (
          <ScrollBounce as="li" key={r.name + i} delay={i * 0.1} className="abh-card abh-card-rule flex h-full min-w-0 flex-col items-center p-5 text-center">
              <Quotes size={16} weight="regular" className="mb-2 text-muted-foreground" aria-hidden="true" />
              <p className="text-[0.92rem] font-normal text-zinc-600 dark:text-zinc-300 leading-relaxed mb-3">{r.quote}</p>
              <div className="abh-icon-chip flex h-12 w-12 items-center justify-center mb-1.5 bg-background text-muted-foreground dark:text-muted-foreground" aria-hidden="true">
                <UserCircle size={30} weight="regular" />
              </div>
              <p className="abh-card-heading text-[0.9rem] truncate max-w-full">{r.name}</p>
              <div role="img" aria-label={`${r.rating} out of 5 stars`} className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <Star key={si} size={11} weight="regular" aria-hidden="true" className={si < r.rating ? "text-muted-foreground dark:text-muted-foreground" : "text-zinc-200 dark:text-zinc-700"} />
                ))}
              </div>
          </ScrollBounce>
        )
      })}
    </ul>
  )
}

export function AboutTestimonials() {
  return (
    <section className="py-14 md:py-16 px-4 md:px-8 border-t border-zinc-100 dark:border-zinc-800/60" aria-labelledby="about-testimonials-title">
      <div className="max-w-[980px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10">
            <h2 id="about-testimonials-title" className="abh-section-heading text-3xl md:text-4xl mb-3">What Our Clients Say</h2>
            <p className="abh-tagline max-w-md mx-auto text-center">
              Real people, real services — a few words from the community we serve.
            </p>
            <div className="abh-divider" style={{ maxWidth: "120px" }} />
          </div>
        </ScrollBounce>
        <CompactTestimonials />
      </div>
    </section>
  )
} 
