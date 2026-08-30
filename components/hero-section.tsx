// components/hero-section.tsx
"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowUpRight, Play, Pause, CheckCircle,
  Printer, FileText, PaintBrush, Globe, Desktop,
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake,
} from "@phosphor-icons/react"
import { BIZ, MARQUEE_ITEMS, TOKEN} from "@/lib/brand"
import { HUBS_DATA } from "@/lib/hero-data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { getWeatherSnapshot, type WeatherCategory } from "@/lib/weather"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

// ─── WEATHER ICON MAP (drives the holiday-banner icon) ──────────────────────
const WEATHER_ICON_MAP: Record<WeatherCategory, { Icon: React.ElementType; color: string }> = {
  "clear-day": { Icon: Sun, color: "#F59E0B" },
  "clear-night": { Icon: Moon, color: "#818CF8" },
  "partly-cloudy-day": { Icon: CloudSun, color: "#F0A93A" },
  "partly-cloudy-night": { Icon: CloudMoon, color: "#8B93D8" },
  cloudy: { Icon: Cloud, color: "#9CA3AF" },
  fog: { Icon: CloudFog, color: "#9CA3AF" },
  rain: { Icon: CloudRain, color: "#60A5FA" },
  thunderstorm: { Icon: CloudLightning, color: "#A78BFA" },
  snow: { Icon: Snowflake, color: "#7DD3FC" },
}
function fallbackCategory(greeting: BusinessStatus["greeting"]): WeatherCategory {
  return greeting === "morning" || greeting === "afternoon" ? "clear-day" : "clear-night"
}

// ─── REDUCED MOTION / HOVER CAPABILITY ───────────────────────────────────────
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}
function useCanHover() {
  const [canHover, setCanHover] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    setCanHover(mq.matches)
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return canHover
}

// ─── HUB ICON FIELD — flat icons, pentagon grouping (bug fix noted below) ───
const PENTAGON_ANGLES_DEG = [-90, -18, 54, 126, 198]
const ELLIPSE_RX_PCT = 30
const ELLIPSE_RY_PCT = 24
const HUB_ICON_MAP: Record<string, React.ElementType> = {
  print: Printer, doc: FileText, design: PaintBrush, eservice: Globe, tech: Desktop,
}
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
type IconEntry = { hub: (typeof HUBS_DATA)[number]; topPct: number; leftPct: number; z: number }
function toPositions(hubs: typeof HUBS_DATA): IconEntry[] {
  return hubs.map((hub, i) => {
    const rad = (PENTAGON_ANGLES_DEG[i] * Math.PI) / 180
    return { hub, topPct: 50 + ELLIPSE_RY_PCT * Math.sin(rad), leftPct: 50 + ELLIPSE_RX_PCT * Math.cos(rad), z: 10 + i * 10 }
  })
}

const SPIN_MS = 1100

function HubIconField({ isDark, canHover, prefersReducedMotion }: { isDark: boolean; canHover: boolean; prefersReducedMotion: boolean }) {
  // AUDIT FIX: the previous version built this arrangement with
  // Math.random() (shuffle order) directly inside a useState lazy
  // initializer, which runs during render on BOTH server and client —
  // producing two different random layouts and a real hydration
  // mismatch. Fixed by rendering a deterministic order on first paint
  // and shuffling only inside useEffect (client-only), same pattern
  // already used correctly elsewhere in this file for `mounted`.
  const [arrangement, setArrangement] = useState<IconEntry[]>(() => toPositions(HUBS_DATA))
  useEffect(() => { setArrangement(toPositions(shuffleArray(HUBS_DATA))) }, [])

  const [revealed, setRevealed] = useState(false)
  useEffect(() => { const t = setTimeout(() => setRevealed(true), 50); return () => clearTimeout(t) }, [])

  const [spinningId, setSpinningId] = useState<string | null>(null)
  const spinTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const triggerSpin = (hubId: string) => {
    if (prefersReducedMotion) return
    if (spinTimerRef.current) clearTimeout(spinTimerRef.current)
    setSpinningId(null)
    requestAnimationFrame(() => {
      setSpinningId(hubId)
      spinTimerRef.current = setTimeout(() => setSpinningId((cur) => (cur === hubId ? null : cur)), SPIN_MS)
    })
  }

  return (
    <div className="relative mx-auto w-full max-w-[360px] sm:max-w-[440px] md:max-w-none h-[380px] sm:h-[440px] md:h-[480px]">
      {arrangement.map(({ hub, topPct, leftPct, z }, i) => {
        const hubAccent = isDark ? hub.colorDark : hub.colorLight
        const Icon = HUB_ICON_MAP[hub.id]
        const isSpinning = spinningId === hub.id

        return (
          <div
            key={hub.id}
            className="absolute flex flex-col items-center transition-all duration-500 ease-out"
            style={{
              top: `${topPct}%`, left: `${leftPct}%`, zIndex: z,
              transform: `translate(-50%, -50%) scale(${revealed ? 1 : 0.7})`,
              opacity: revealed ? 1 : 0,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={hub.name}
              onMouseEnter={() => canHover && triggerSpin(hub.id)}
              onClick={() => triggerSpin(hub.id)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); triggerSpin(hub.id) } }}
              className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center cursor-pointer outline-none bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 abh-shadow-tile"
              style={{
                perspective: "600px",
                animationName: isSpinning ? "abh-coin-spin" : undefined,
                animationDuration: `${SPIN_MS}ms`,
                animationTimingFunction: "cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <Icon size={44} weight="duotone" color={hubAccent} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── TRUST HINTS — content mirrors the marked-up screenshot exactly ─────────
// New copy not yet in lib/brand.ts — worth moving there later so it lives
// alongside BIZ/MARQUEE_ITEMS as the single source of truth for site copy.
const HERO_SUBHEAD = "Everyday digital and print work, handled with clarity, care and a little more confidence."
const TRUST_HINTS = ["Local & human", "Clear pricing", "Fast turnaround"]

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeroSection() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [status, setStatus] = useState<BusinessStatus | null>(null)
  const [weatherCategory, setWeatherCategory] = useState<WeatherCategory | null>(null)
  const showBackToTop = useBackToTop()
  const prefersReducedMotion = usePrefersReducedMotion()
  const canHover = useCanHover()

  useEffect(() => {
    setMounted(true)
    setStatus(getBusinessStatus())
    const id = setInterval(() => setStatus(getBusinessStatus()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!status?.isHoliday) return
    getWeatherSnapshot().then((snapshot) => { if (snapshot) setWeatherCategory(snapshot.category) })
  }, [status?.isHoliday])

  const isDark = mounted && resolvedTheme === "dark"
  const showHolidayBanner = mounted && status?.isHoliday
  const displayCategory = weatherCategory ?? (status ? fallbackCategory(status.greeting) : "clear-day")
  const { Icon: WeatherIcon, color: weatherIconColor } = WEATHER_ICON_MAP[displayCategory]

  // "Start with a Quote" now opens the on-page quote calculator widget
  // (see components/quote-calculator/index.tsx) instead of navigating to
  // a /quote route, via a window event the widget listens for.
  const handleCtaClick = () => window.dispatchEvent(new CustomEvent("abh:open-quote-calculator"))
  const handleServicesClick = () => router.push("/services")

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[calc(100vh-var(--nav-h))] w-full flex flex-col items-center justify-center px-4 md:px-8 pt-[calc(var(--nav-h)+56px)] md:pt-[104px] pb-10 md:pb-16 overflow-hidden cursor-default bg-background transition-colors duration-300">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      <style>{`
        @keyframes abh-coin-spin {
          0%   { transform: rotateY(0deg); }
          100% { transform: rotateY(1080deg); }
        }
      `}</style>

      {/* NOTE: max-widths bumped here (1240→1400 / 1100→1280) to take more
          width as asked. A true whole-site width increase needs the shared
          page container/layout component, which wasn't part of this file. */}
      <div className="max-w-[1400px] mx-auto flex flex-col items-center relative z-10 w-full mb-6">

        <div className="w-full max-w-[1280px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-10 md:mb-14">

          {/* Left column — everything marked in the screenshot, verbatim */}
          <div className="text-center md:text-left">

            {showHolidayBanner && status && (
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                <WeatherIcon size={16} weight="fill" style={{ color: weatherIconColor }} aria-hidden="true" />
                Tech, Design &amp; E-Service are closed today for {status.holidayName} — Print &amp; Docu is open as usual
              </p>
            )}

            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3" style={{ color: BRAND.orange }}>
              <span aria-hidden="true">•</span> {BIZ.tagline.replace(/\.$/, "")}
            </p>

            <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] mb-4">
              <span className="block text-zinc-900 dark:text-zinc-50">Design.</span>
              <span className="block text-zinc-400 dark:text-zinc-600">Print.</span>
              <span className="block text-zinc-900 dark:text-zinc-50">Upgrade.</span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400 max-w-[480px] md:max-w-none mx-auto md:mx-0 leading-relaxed mb-8">
              {HERO_SUBHEAD}
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-center gap-4 sm:gap-6 mb-8 md:mb-9">
              <ScrollBounce>
                <button
                  onClick={handleCtaClick}
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-[14px] font-sans font-black text-lg sm:text-xl text-white transition-all duration-150 active:scale-[0.94] active:brightness-95 hover:-translate-y-0.5 abh-shadow-badge"
                  style={{ backgroundColor: BRAND.orange }}
                >
                  Start with a Quote
                  <ArrowUpRight weight="bold" className="w-4 h-4" aria-hidden="true" />
                </button>
              </ScrollBounce>

              {/* "See Our Services" — was a plain underline link, now a
                  standalone pill: fills with the page background so it
                  reads as a distinct morphed shape rather than flat text,
                  border + chip shadow token give it edges, and the accent
                  only appears on hover/press (matches the sitewide
                  "neutral until interacted with" rule). */}
              <button
                onClick={handleServicesClick}
                className="group/services-cta flex items-center gap-2 px-6 py-4 rounded-[14px] font-sans font-black text-lg sm:text-xl bg-background border border-[var(--border)] text-foreground abh-shadow-badge transition-all duration-150 active:scale-[0.94] active:brightness-95 hover:-translate-y-0.5 hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)]"
              >
                See Our Services
                <ArrowUpRight
                  weight="bold"
                  className="w-4 h-4 transition-transform duration-200 group-hover/services-cta:translate-x-0.5 group-hover/services-cta:-translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1.5">
              {TRUST_HINTS.map((hint) => (
                <span key={hint} className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  <CheckCircle size={15} weight="fill" style={{ color: TOKEN.brandblue }} aria-hidden="true" />
                  {hint}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — flat-icon hub field, card box removed */}
          <ScrollBounce delay={0.1} className="w-full">
            <HubIconField isDark={isDark} canHover={canHover} prefersReducedMotion={prefersReducedMotion} />
          </ScrollBounce>
        </div>

        {/* Marquee */}
        <div
          role="group"
          aria-label="Our services"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onTouchStart={(e) => { e.stopPropagation(); setMarqueePaused((p) => !p) }}
          className="relative w-full max-w-[1400px] py-4 overflow-hidden select-none group/marquee rounded-[14px] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
        >
          <button
            onClick={() => setMarqueePaused((p) => !p)}
            aria-pressed={marqueePaused}
            aria-label={marqueePaused ? "Play scrolling services list" : "Pause scrolling services list"}
            className="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-zinc-900/80 transition-colors"
          >
            {marqueePaused ? <Play size={11} weight="fill" aria-hidden="true" /> : <Pause size={11} weight="fill" aria-hidden="true" />}
          </button>
          <div
            className="flex whitespace-nowrap w-max animate-marquee"
            style={{ animationPlayState: marqueePaused || prefersReducedMotion ? "paused" : "running" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1 ? "true" : undefined}>
                {MARQUEE_ITEMS.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="inline-flex items-center px-5 font-semibold text-base text-zinc-600 dark:text-zinc-400 transition-opacity duration-300 group-hover/marquee:opacity-70 hover:!opacity-100">
                      {item}
                    </span>
                    <span className="font-black text-lg leading-none shrink-0 text-zinc-300 dark:text-zinc-600" aria-hidden="true">•</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BackToTopButton visible={showBackToTop} />
    </section>
  )
  }
