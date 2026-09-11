// components/logo-marquee.tsx
"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
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
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="20" cy="20" r="14" strokeOpacity="0.4" />
      <circle cx="20" cy="20" r="8" />
      <circle cx="20" cy="20" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MarkTriangleCircle() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 8 L32 30 L8 30 Z" strokeLinejoin="round" />
      <circle cx="20" cy="24" r="7" strokeOpacity="0.5" />
    </svg>
  )
}
function MarkDiamondDot() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 L34 20 L20 34 L6 20 Z" strokeLinejoin="round" />
      <circle cx="20" cy="20" r="3" fill="currentColor" stroke="none" />
    </svg>
  )
}
function MarkAscendingBars() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="currentColor">
      <rect x="6" y="22" width="6" height="12" rx="1.5" />
      <rect x="17" y="14" width="6" height="20" rx="1.5" opacity="0.75" />
      <rect x="28" y="6" width="6" height="28" rx="1.5" opacity="0.5" />
    </svg>
  )
}
function MarkInterlockingRings() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="16" cy="20" r="10" />
      <circle cx="26" cy="20" r="10" strokeOpacity="0.55" />
    </svg>
  )
}
function MarkPeak() {
  return (
    <svg viewBox="0 0 40 40" className="w-9 h-9 sm:w-10 sm:h-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
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
// down the homepage.
//
// FIX: swapped from a pure CSS-keyframe marquee to a scrollable track that
// auto-advances via rAF, so it can genuinely be swiped/dragged left-right —
// a CSS `transform: translateX` animation has no scroll position for the
// browser or a pointer-drag to hook into. This is the same manual-scroll
// pattern already used in ProjectCarousel (mouse drag + native touch scroll),
// reused here for consistency: native touch scrolling handles mobile swipe
// for free, and the mouse handlers replicate that behavior for desktop drag.
// The track is duplicated content (two copies back to back) and silently
// snaps scrollLeft back by half the total width once it passes the first
// copy, so the loop reads as infinite with no visible jump.
export function LogoMarquee() {
  const [paused, setPaused] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const isInteracting = useRef(false)
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragScrollStart = useRef(0)

  const SPEED_PX_PER_FRAME = 0.6

  const tick = useCallback(() => {
    const track = trackRef.current
    if (track && !paused && !isInteracting.current) {
      track.scrollLeft += SPEED_PX_PER_FRAME
      const half = track.scrollWidth / 2
      if (track.scrollLeft >= half) track.scrollLeft -= half
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [paused])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [tick])

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    isInteracting.current = true
    dragStartX.current = e.pageX
    dragScrollStart.current = trackRef.current?.scrollLeft ?? 0
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return
    trackRef.current.scrollLeft = dragScrollStart.current - (e.pageX - dragStartX.current)
  }
  const endDrag = () => {
    isDragging.current = false
    isInteracting.current = false
  }

  return (
    <div
      role="group"
      aria-label="Trusted by"
      onMouseEnter={() => { isInteracting.current = true; setPaused(true) }}
      onMouseLeave={() => { if (!isDragging.current) { isInteracting.current = false; setPaused(false) } }}
      className="relative w-full max-w-[1400px] mx-auto mt-4 py-3 overflow-hidden select-none group/logo-marquee bg-transparent"
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
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={() => { isInteracting.current = true }}
        onTouchEnd={() => { isInteracting.current = false }}
        className="flex items-center overflow-x-auto no-scrollbar whitespace-nowrap cursor-grab active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1 ? "true" : undefined}>
            {PARTNER_LOGOS.map((logo, i) => {
              const Mark = PLACEHOLDER_MARKS[i % PLACEHOLDER_MARKS.length]
              const accent = PLACEHOLDER_ACCENTS[i % PLACEHOLDER_ACCENTS.length]
              return (
                <div
                  key={`${copy}-${logo.id}`}
                  className="group flex items-center justify-center mx-7 sm:mx-10 h-14 w-36 sm:h-16 sm:w-44 shrink-0"
                  style={{ ["--mark-accent" as any]: accent }}
                >
                  {logo.src ? (
                    // FIX: dark mode was dark:opacity-60 with no theme-aware
                    // boost — bumped to dark:opacity-80 so real logo photos
                    // read clearly against the near-black background instead
                    // of looking washed out.
                    <div className="relative w-full h-full grayscale opacity-70 dark:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100 transition-all duration-300">
                      <Image src={logo.src} alt={logo.name} fill sizes="176px" className="object-contain" draggable={false} />
                    </div>
                  ) : (
                    // FIX: was `text-zinc-400 dark:text-zinc-600` — zinc-600
                    // is itself a *dark* grey, so on the site's near-black
                    // dark background it nearly disappeared. Swapped to the
                    // theme-aware `text-muted-foreground` token (already
                    // correctly tuned per-theme elsewhere in this file)
                    // instead of a hardcoded value that ignored dark mode.
                    <div
                      className="flex flex-col items-center justify-center gap-1.5 text-muted-foreground group-hover:text-[var(--mark-accent)] group-focus-visible:text-[var(--mark-accent)] transition-colors duration-300"
                      title={`${logo.name} — placeholder, swap src in PARTNER_LOGOS`}
                    >
                      <Mark />
                      <span className="text-[0.6rem] font-bold uppercase tracking-wide leading-none opacity-80">
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
