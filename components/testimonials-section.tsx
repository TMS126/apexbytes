// components/testimonials-section.tsx
"use client"

import { Star, Quotes, WhatsappLogo } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { HUB_COLORS, HUB_NAMES, HubKey, BIZ } from "@/lib/brand"
import { HubId } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"

interface Review {
  name: string
  initials: string
  hubId: HubId
  serviceUsed: string
  rating: number
  quote: string
}

export const SAMPLE_REVIEWS: Review[] = [
  {
    name: "Sethembiso",
    initials: "SM",
    hubId: "doc",
    serviceUsed: "CV Writing & Design",
    rating: 5,
    quote: "They got my CV finished quickly and made sure it was ready before I even needed it. I'm really happy with how it turned out.",
  },
  {
    name: "Tseleng",
    initials: "TL",
    hubId: "doc",
    serviceUsed: "CV Printing",
    rating: 5,
    quote: "Quick and easy — my CV was printed and ready with no fuss at all. Thanks a lot for the help!",
  },
  {
    name: "Phumzile",
    initials: "PS",
    hubId: "doc",
    serviceUsed: "CV Job Seeker Package",
    rating: 5,
    quote: "The job seeker package came out sharp, exactly what I needed. Really happy with it, thank you!",
  },
]

function Stars({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex items-center justify-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          weight="fill"
          style={{ color: i < rating ? color : undefined }}
          className={i < rating ? "" : "text-zinc-200 dark:text-zinc-700"}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export function TestimonialsSection({
  reviews = SAMPLE_REVIEWS,
  title = "What Our Clients Say",
  subtitle = "Real people, real services — here's how we've helped the communities local and remotely.",
}: {
  reviews?: Review[]
  title?: string
  subtitle?: string
}) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const colorFor = (review: Review) => {
    const colors = HUB_COLORS[review.hubId as HubKey]
    return isDark ? colors.accentDark : colors.accentLight
  }
  const solidFor = (review: Review) => {
    const colors = HUB_COLORS[review.hubId as HubKey]
    return isDark ? colors.tagBgDark : colors.primary
  }

  return (
    <section className="px-4 py-16 md:px-8">
      <div className="mx-auto max-w-[1300px]">
        <ScrollBounce>
          <div className="mb-12 text-center">
            <p className="mb-2 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-muted-foreground dark:text-muted-foreground">
              Testimonials
            </p>
            <h2 className="mb-3 font-sans text-[1.8rem] font-medium text-zinc-900 dark:text-zinc-50 md:text-[2.25rem]">{title}</h2>
            <p className="mx-auto mb-5 max-w-xl text-[1.05rem] font-medium text-muted-foreground dark:text-muted-foreground md:text-[1.2rem]">{subtitle}</p>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-[0.78rem] font-medium text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full bg-brand-green" aria-hidden="true" />
              Real customers we&apos;ve helped, local and remotely.
            </div>
          </div>
        </ScrollBounce>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {reviews.map((review, index) => {
            const accent = colorFor(review)
            const solid = solidFor(review)
            return (
              <ScrollBounce key={review.name + index} delay={index * 0.08} className="h-full">
                <article className="abh-card flex h-full min-h-[360px] flex-col items-center justify-center overflow-hidden px-7 py-8 text-center transition-transform duration-200 hover:-translate-y-1">
                  <Quotes size={22} weight="fill" style={{ color: accent }} className="mb-4 shrink-0 opacity-50" aria-hidden="true" />
                  <p className="mb-6 max-w-[32ch] text-[1.05rem] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">{review.quote}</p>
                  <div className="mt-auto flex flex-col items-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-[0.9rem] font-medium text-white" style={{ backgroundColor: solid }}>
                      {review.initials}
                    </div>
                    <p className="text-[1.05rem] font-medium text-zinc-800 dark:text-zinc-200">{review.name}</p>
                    <span className="mt-2 rounded-full px-3.5 py-1.5 text-[0.76rem] font-medium" style={{ backgroundColor: solid, color: "var(--text-on-hub-tag)" }}>
                      {HUB_NAMES[review.hubId as HubKey]}
                    </span>
                    <div className="mt-2.5"><Stars rating={review.rating} color={accent} /></div>
                  </div>
                </article>
              </ScrollBounce>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent("Hi ApexbytesHub! I'd like to share my experience with you.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-5 py-2.5 text-[0.88rem] font-medium text-muted-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-whatsapp hover:text-brand-whatsapp active:translate-y-0 active:scale-95"
          >
            <WhatsappLogo size={16} weight="fill" className="text-brand-whatsapp" aria-hidden="true" />
            Share your experience on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
