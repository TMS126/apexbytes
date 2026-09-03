// components/strip-section.tsx
"use client"

import { Rocket, CurrencyDollar, HandHeart, MapPin, WhatsappLogo } from "@phosphor-icons/react"
import { WA, STRIP_ITEMS } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

export function StripSection() {
  return (
    <section aria-label="Why choose us" className="bg-background py-12 md:py-16 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-[1080px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10">
            <p className="text-[0.78rem] font-black uppercase tracking-[0.2em] text-muted-foreground dark:text-muted-foreground mb-2">
              Why ApexbytesHub
            </p>
            <h2 className="font-sans font-black text-2xl md:text-3xl text-foreground">
              Fast, Friendly &amp; Local
            </h2>
          </div>
        </ScrollBounce>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {STRIP_ITEMS.map((item, index) => (
            <ScrollBounce key={index} delay={index * 0.08} className="h-full">
              <StripCard item={item} />
            </ScrollBounce>
          ))}
        </div>
      </div>
    </section>
  )
}

function StripCard({ item }: { item: (typeof STRIP_ITEMS)[number] }) {
  return (
    <div
      tabIndex={0}
      aria-label={item.title}
      className="relative rounded-[14px] border p-6 transition-transform duration-300 hover:-translate-y-1 group overflow-hidden h-full abh-shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      <div className="relative z-10">
        <div className="mb-5 text-foreground">
          {item.iconName === "Rocket" && <Rocket weight="regular" className="w-6 h-6" aria-hidden="true" />}
          {item.iconName === "CurrencyDollar" && <CurrencyDollar weight="regular" className="w-6 h-6" aria-hidden="true" />}
          {item.iconName === "HandHeart" && <HandHeart weight="regular" className="w-6 h-6" aria-hidden="true" />}
          {item.iconName === "MapPin" && <MapPin weight="regular" className="w-6 h-6" aria-hidden="true" />}
        </div>
        <div>
          <h3 className="font-sans font-semibold text-base mb-1 text-foreground">
            {item.title}
          </h3>
          <p className="text-base leading-relaxed text-muted-foreground">
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  )
}

export function CtaBar({
  title,
  description,
  buttonText,
  buttonHref,
  onButtonClick,
  badgeText = "Get In Touch",
}: {
  title: string
  description: string
  buttonText: string
  buttonHref?: string
  onButtonClick?: () => void
  /** Defaults to "Get In Touch" — Home/Services keep their existing text
   *  unless a caller (e.g. Gallery) needs different framing. */
  badgeText?: string
}) {
  const ctaBlue = "var(--cta-badge-bg)"
  const ctaTextOnBlue = "var(--cta-badge-text)"

  return (
    <section aria-label="Call to action" className="px-4 md:px-8 py-16 transition-colors duration-300 bg-background">
      <ScrollBounce className="max-w-[750px] mx-auto">
        <div className="abh-card px-10 py-14 text-center bg-brand-blue/10 border-brand-blue/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue rounded-full blur-[100px] opacity-20 -mr-32 -mt-32" aria-hidden="true" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-brand-blue rounded-full blur-[100px] opacity-10 -ml-28 -mb-28" aria-hidden="true" />

          <span
            className="text-[0.84rem] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block relative z-10"
            style={{ backgroundColor: ctaBlue, color: ctaTextOnBlue }}
          >
            {badgeText}
          </span>

          <h2 className="abh-section-heading text-3xl mb-4 relative z-10">{title}</h2>
          <p className="abh-body text-xl max-w-[500px] mx-auto mb-10 relative z-10">{description}</p>
          <div className="flex justify-center relative z-10">
            <a
              href={buttonHref || WA.general}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onButtonClick}
              className="abh-wa-btn text-lg px-8 py-4 shadow-xl hover:scale-[1.04] hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
            >
              <WhatsappLogo weight="fill" className="w-6 h-6 shrink-0" aria-hidden="true" />
              {buttonText}
            </a>
          </div>
        </div>
      </ScrollBounce>
    </section>
  )
}
