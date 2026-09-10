// components/logo-marquee.tsx
"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play, Pause, ImageSquare } from "@phosphor-icons/react"

// ─── PLACEHOLDER SLOTS ────────────────────────────────────────────────────
// 6 placeholder entries — swap `src: null` for a real image path/Cloudinary
// URL once you have the logo files, e.g. `src: "/partners/client-1.png"`.
// Nothing else needs to change; the render below already branches on
// whether `src` is set.
type PartnerLogo = { id: string; name: string; src: string | null }

const PARTNER_LOGOS: PartnerLogo[] = [
  { id: "p1", name: "Client 1", src: null },
  { id: "p2", name: "Client 2", src: null },
  { id: "p3", name: "Client 3", src: null },
  { id: "p4", name: "Client 4", src: null },
  { id: "p5", name: "Client 5", src: null },
  { id: "p6", name: "Client 6", src: null },
]

// ─── COMPONENT ────────────────────────────────────────────────────────────
// Sits directly below the existing "Our services" marquee in hero-section.tsx.
// Same horizontal-scroll mechanic (reuses the sitewide `.animate-marquee`
// keyframe already declared in globals.css) but visually quieter: smaller,
// greyscale by default, so it doesn't compete with the services marquee
// above it. Logos gently regain color on hover/focus as a small reward —
// remove the `grayscale-0` hover class below if you'd rather they stay
// fully greyscale always.
export function LogoMarquee() {
  const [paused, setPaused] = useState(false)

  return (
    <div
      role="group"
      aria-label="Trusted by"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { e.stopPropagation(); setPaused((p) => !p) }}
      className="relative w-full max-w-[1400px] mx-auto mt-4 py-3 overflow-hidden select-none group/logo-marquee bg-transparent [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
    >
      <p className="text-center text-[0.65rem] font-black uppercase tracking-widest text-muted-foreground mb-2">
        Trusted by
      </p>

      <button
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        aria-label={paused ? "Play logo scroll" : "Pause logo scroll"}
        className="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground bg-background/90 border border-border transition-colors"
      >
        {paused ? <Play size={10} weight="fill" aria-hidden="true" /> : <Pause size={10} weight="fill" aria-hidden="true" />}
      </button>

      <div
        className="flex items-center whitespace-nowrap w-max animate-marquee"
        style={{ animationPlayState: paused ? "paused" : "running", animationDuration: "28s" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1 ? "true" : undefined}>
            {PARTNER_LOGOS.map((logo) => (
              <div
                key={`${copy}-${logo.id}`}
                className="flex items-center justify-center mx-6 sm:mx-8 h-10 w-28 sm:h-12 sm:w-32 shrink-0 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 focus-visible:grayscale-0 focus-visible:opacity-100 transition-all duration-300"
              >
                {logo.src ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      fill
                      sizes="128px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  // Placeholder slot — dashed outline + icon + name, so it
                  // visibly reads as "logo goes here" rather than a blank
                  // gap or a broken image.
                  <div
                    className="flex flex-col items-center justify-center gap-1 w-full h-full rounded-[10px] border border-dashed border-border"
                    title={`${logo.name} — placeholder, swap src in PARTNER_LOGOS`}
                  >
                    <ImageSquare size={16} weight="regular" aria-hidden="true" />
                    <span className="text-[0.55rem] font-bold uppercase tracking-wide leading-none">
                      {logo.name}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
