// components/testimonials-section.tsx
"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Star, Quotes, WhatsappLogo, CaretLeft, CaretRight } from "@phosphor-icons/react"
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
    <div className="flex items-center justify-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          weight="fill"
          style={{ color: i < rating ? color : undefined }}
          className={i < rating ? "" : "text-zinc-200 dark:text-zinc-700"}
        />
      ))}
    </div>
  )
}

// Plays once when scrolled into view: the pill itself falls as a
// squeezed droplet, splats down, then grows sideways from its center
// out to its full width — one continuous liquid motion, no separate
// droplet element.
function DripReveal({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [dripped, setDripped] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el || dripped) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDripped(true)
          io.disconnect() // only once
        }
      },
      { threshold: 0.4 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [dripped])

  return (
    <div ref={wrapRef} className="relative flex justify-center">
      <div
        className={
          "rounded-full will-change-transform " +
          (dripped
            ? "animate-[abh-drip-pill_900ms_cubic-bezier(.4,0,.2,1)_forwards]"
            : "opacity-0 scale-x-[0.12] scale-y-[0.5] -translate-y-[110px]")
        }
        style={{ transformOrigin: "center" }}
      >
        {children}
      </div>

      <style>{`
        @keyframes abh-drip-pill {
          0%   { transform: translateY(-110px) scaleX(0.12) scaleY(0.5); opacity: 1; }
          55%  { transform: translateY(6px)    scaleX(0.12) scaleY(1.25); opacity: 1; }
          72%  { transform: translateY(-2px)   scaleX(0.55) scaleY(0.82); opacity: 1; }
          88%  { transform: translateY(1px)    scaleX(1.04) scaleY(1.04); opacity: 1; }
          100% { transform: translateY(0)      scaleX(1)    scaleY(1);   opacity: 1; }
        }
      `}</style>
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
  const n = reviews.length

  const [active, setActive] = useState(0)
  const [dragX, setDragX] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const goTo = useCallback((i: number) => setActive(((i % n) + n) % n), [n])
  const prev = useCallback(() => goTo(active - 1), [active, goTo])
  const next = useCallback(() => goTo(active + 1), [active, goTo])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    setDragX(e.touches[0].clientX - touchStartX.current)
  }
  const onTouchEnd = () => {
    if (Math.abs(dragX) > 60) {
      if (dragX < 0) next()
      else prev()
    }
    setDragX(0)
    touchStartX.current = null
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev() }
    if (e.key === "ArrowRight") { e.preventDefault(); next() }
  }

  const colorFor = (i: number) => {
    const c = HUB_COLORS[reviews[i].hubId as HubKey]
    return isDark ? c.accentDark : c.accentLight
  }
  const solidFor = (i: number) => {
    const c = HUB_COLORS[reviews[i].hubId as HubKey]
    return isDark ? c.accentDark : c.primary
  }
  const solidTextFor = () => isDark ? "var(--background)" : "var(--on-neutral-dark)"

  const slotStyle = (offset: number): React.CSSProperties => {
    const abs = Math.abs(offset)
    if (abs === 0) {
      return { transform: `translateX(${dragX}px) scale(1)`, opacity: 1, zIndex: 30, filter: "none" }
    }
    if (abs === 1) {
      return {
        transform: `translateX(${offset * 78 + dragX * 0.4}%) scale(0.88) rotate(color-mix(in srgb, ${offset * 2} 12%, transparent)g)`,
        opacity: 0.55, zIndex: 20, filter: "blur(1.5px)",
      }
    }
    return { transform: `translateX(${offset * 130}%) scale(0.78)`, opacity: 0, zIndex: 10, filter: "blur(2px)", pointerEvents: "none" }
  }

  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-[1300px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-12">
            <p className="text-[0.78rem] font-black uppercase tracking-[0.2em] text-muted-foreground dark:text-muted-foreground mb-2">
              Testimonials
            </p>
            <h2 className="font-sans font-black text-[1.8rem] md:text-[2.25rem] text-zinc-900 dark:text-zinc-50 mb-3">{title}</h2>
            <p className="text-[1.05rem] md:text-[1.2rem] font-medium text-muted-foreground dark:text-muted-foreground max-w-xl mx-auto mb-5">{subtitle}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-[0.78rem] font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-brand-green shrink-0" aria-hidden="true" />
              Real customers we&apos;ve helped, local and remotely.
            </div>
          </div>
        </ScrollBounce>

        <ScrollBounce delay={0.1}>
          <div
            ref={containerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="relative w-full max-w-[640px] mx-auto h-[440px] sm:h-[420px] focus:outline-none rounded-[20px] focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            style={{ ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: colorFor(active) }}
          >
            {reviews.map((r, i) => {
              let offset = i - active
              if (offset > n / 2) offset -= n
              if (offset < -n / 2) offset += n
              if (Math.abs(offset) > 2) return null

              const accent = colorFor(i)
              const solid = solidFor(i)
              const isActive = offset === 0

              return (
                <div
                  key={r.name + i}
                  aria-hidden={!isActive}
                  className="absolute inset-0 transition-[transform,opacity,filter] duration-500 ease-out"
                  style={slotStyle(offset)}
                >
                  <div
                    onClick={() => !isActive && goTo(i)}
                    className="h-full rounded-[20px] bg-card border border-border flex flex-col items-center justify-center text-center px-8 sm:px-12 py-6 overflow-hidden"
                    style={{
                      cursor: isActive ? "default" : "pointer",
                      boxShadow: isActive
                        ? `0 14px 30px -20px rgba(0,0,0,0.22), 0 0 0 1px color-mix(in srgb, ${accent} 12%, transparent)`
                        : "0 4px 12px -10px rgba(0,0,0,0.14)",
                    }}
                  >
                    <Quotes size={22} weight="fill" style={{ color: accent }} className="mb-3 opacity-40 shrink-0" />

                    <p className="text-[1.05rem] sm:text-[1.2rem] font-medium text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4 max-w-[46ch]">
                      {r.quote}
                    </p>

                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-[0.9rem] font-black mb-1.5 shrink-0"
                      style={{ backgroundColor: solid, color: solidTextFor() }}
                    >
                      {r.initials}
                    </div>

                    <p className="text-[1.05rem] font-black text-zinc-800 dark:text-zinc-200">{r.name}</p>

                    {/* Solid colored pill, white text, hub name only — matches the reference image, same treatment in every state */}
                    <span
                      className="text-[0.76rem] font-bold px-3.5 py-1.5 rounded-full mt-2"
                      style={{ backgroundColor: solid, color: solidTextFor() }}
                    >
                      {HUB_NAMES[r.hubId as HubKey]}
                    </span>

                    <div className="mt-2.5">
                      <Stars rating={r.rating} color={accent} />
                    </div>
                  </div>
                </div>
              )
            })}

            <button
              onClick={prev}
              aria-label="Previous testimonial"
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-40 w-9 h-9 rounded-full items-center justify-center bg-card border border-border abh-shadow-badge text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: colorFor(active) }}
            >
              <CaretLeft size={16} weight="bold" />
            </button>
            <button
              onClick={next}
              aria-label="Next testimonial"
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-40 w-9 h-9 rounded-full items-center justify-center bg-card border border-border abh-shadow-badge text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: colorFor(active) }}
            >
              <CaretRight size={16} weight="bold" />
            </button>
          </div>
        </ScrollBounce>

        <div role="tablist" aria-label="Choose testimonial" className="flex items-center justify-center gap-2 mt-6">
          {reviews.map((_, i) => {
            const isActive = i === active
            const accent = colorFor(i)
            return (
              <button
                key={i}
                role="tab"
                aria-selected={isActive}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => goTo(i)}
                className="h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ width: isActive ? "22px" : "8px", backgroundColor: isActive ? accent : undefined, ["--tw-ring-color" as unknown as keyof import("react").CSSProperties]: accent }}
              >
                <span className={isActive ? "sr-only" : "block h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"} aria-hidden="true" />
              </button>
            )
          })}
        </div>

        <div className="flex justify-center mt-8">
          <DripReveal>
            <a
              href={`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent("Hi ApexbytesHub! I'd like to share my experience with you.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-border bg-card text-[0.88rem] font-medium text-muted-foreground hover:border-brand-whatsapp hover:text-brand-whatsapp hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 abh-shadow-badge"
            >
              <WhatsappLogo size={16} weight="fill" className="text-brand-whatsapp" aria-hidden="true" />
              Share your experience on WhatsApp
            </a>
          </DripReveal>
        </div>
      </div>
    </section>
  )
        } 
