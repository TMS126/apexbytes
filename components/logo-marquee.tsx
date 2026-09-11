// components/logo-marquee.tsx
"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Play, Pause } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"

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

// ─── PLACEHOLDER LOGOMARKS ────────────────────────────────────────────────
// 6 distinct abstract marks (not photos) so an unfilled slot still reads as
// "a logo" rather than "a missing image". All draw with currentColor, so a
// single CSS var swap (--mark-accent, set per-item below) handles the
// grey → brand-color hover transition — same technique already used for
// the hero collage tiles and project carousel (--hub-accent).
function MarkOrbit() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="20" cy="20" r="14" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MarkTriangleCircle() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 8 L32 30 L8 30 Z" strokeLinejoin="round" />
      <circle cx="20" cy="24" r="7" strokeOpacity="0.5" />
    </svg>
  )
}
function MarkDiamondDot() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 L34 20 L20 34 L6 20 Z" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MarkAscendingBars() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="currentColor">
      <rect x="6" y="22" width="6" height="12" rx="1.5" />
      <rect x="17" y="14" width="6" height="20" rx="1.5" opacity="0.75" />
      <rect x="28" y="6" width="6" height="28" rx="1.5" opacity="0.5" />
    </svg>
  )
}
function MarkInterlockingRings() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="16" cy="20" r="10" />
      <circle cx="26" cy="20" r="10" strokeOpacity="0.55" />
    </svg>
  )
}
function MarkPeak() {
  return (
    <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
      <path d="M5 30 L15 14 L22 24 L28 16 L35 30 Z" />
      <circle cx="30" cy="10" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const PLACEHOLDER_MARKS = [MarkOrbit, MarkTriangleCircle, MarkDiamondDot, MarkAscendingBars, MarkInterlockingRings, MarkPeak]

// Cycled per placeholder so the hover-color reveal feels like an actual
// varied brand roster rather than one repeated tint.
const PLACEHOLDER_ACCENTS = [BRAND.blue, BRAND.green, BRAND.orange, BRAND.teal, BRAND.blueMid, BRAND.orangeDark]

// ─── COMPONENT ────────────────────────────────────────────────────────────
// Sits below the existing "Our services" marquee, as its own section further
// down the homepage. Same horizontal-scroll mechanic (reuses the sitewide
// `.animate-marquee` keyframe already declared in globals.css) but visually
// quieter: smaller, greyscale by default. Real photo logos desaturate via
// the `grayscale` filter class; placeholder logomarks (no filter needed,
// they're already single-color) transition color via the --mark-accent var.
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
            {PARTNER_LOGOS.map((logo, i) => {
              const Mark = PLACEHOLDER_MARKS[i % PLACEHOLDER_MARKS.length]
              const accent = PLACEHOLDER_ACCENTS[i % PLACEHOLDER_ACCENTS.length]
              return (
                <div
                  key={`${copy}-${logo.id}`}
                  className="group flex items-center justify-center mx-6 sm:mx-8 h-10 w-28 sm:h-12 sm:w-32 shrink-0"
                  style={{ ["--mark-accent" as any]: accent }}
                >
                  {logo.src ? (
                    <div className="relative w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100 transition-all duration-300">
                      <Image src={logo.src} alt={logo.name} fill sizes="128px" className="object-contain" />
                    </div>
                  ) : (
                    <div
                      className="flex flex-col items-center justify-center gap-1 text-zinc-400 dark:text-zinc-600 group-hover:text-[var(--mark-accent)] group-focus-visible:text-[var(--mark-accent)] transition-colors duration-300"
                      title={`${logo.name} — placeholder, swap src in PARTNER_LOGOS`}
                    >
                      <Mark />
                      <span className="text-[0.55rem] font-bold uppercase tracking-wide leading-none opacity-70">
                        {logo.name}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
        } 
