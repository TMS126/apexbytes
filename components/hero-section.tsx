// components/hero-section.tsx — full file, paste over the current one
"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowRight, Play, Pause,
  Printer, FileText, PaintBrush, Globe, Wrench,
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake,
} from "@phosphor-icons/react"
import { BRAND, BIZ, MARQUEE_ITEMS } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
import { ClassicTagline } from "@/components/classic-tagline"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { getWeatherSnapshot, type WeatherCategory } from "@/lib/weather"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

// ─── COLOR HELPERS ───────────────────────────────────────────────────────────
function hexToRgbLocal(hex: string) {
  const clean = hex.replace("#", "")
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean
  const bigint = parseInt(full, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}
function relativeLuminanceLocal({ r, g, b }: { r: number; g: number; b: number }) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}
function getArrowIconColor(bgHex: string) {
  const lum = relativeLuminanceLocal(hexToRgbLocal(bgHex))
  const contrastWhite = 1.05 / (lum + 0.05)
  const contrastDark = (lum + 0.05) / 0.062
  return contrastWhite >= contrastDark ? "#ffffff" : "#14202b"
}

// ─── REDUCED MOTION ───────────────────────────────────────────────────────────
// Only the marquee is animated now that the icon collage is gone, but the
// marquee's play/pause still needs to respect this preference.
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  )
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

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

// ─── HUB SHOWCASE CARD — flat icons, replaces the old 3D icon collage ───────
// Reference layout has 4 corner icon-circles + 1 center mark, but
// ApexbytesHub has 5 hubs — per your call, Tech Hub takes the center slot
// where the reference's logo mark sat. Card is intentionally dark in BOTH
// site themes (matches the reference screenshot's own behavior) so it's
// built straight from BRAND's dark-tier tokens rather than switching on
// `isDark`. No new hex added — every color here is an existing BRAND token.
const CARD_ICONS: { icon: React.ElementType; position: string; size?: "lg" }[] = [
  { icon: Printer, position: "top-0 left-0" },
  { icon: Globe, position: "top-[6%] right-0" },
  { icon: FileText, position: "bottom-0 left-[8%]" },
  { icon: PaintBrush, position: "bottom-[2%] right-[2%]" },
  { icon: Wrench, position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", size: "lg" },
]

function CardIcon({ icon: Icon, position, size }: { icon: React.ElementType; position: string; size?: "lg" }) {
  const dims = size === "lg" ? "w-16 h-16 md:w-20 md:h-20" : "w-12 h-12 md:w-14 md:h-14"
  const iconSize = size === "lg" ? 26 : 20
  return (
    <div
      className={`absolute ${position} ${dims} rounded-full flex items-center justify-center border`}
      style={{ backgroundColor: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.16)" }}
    >
      <Icon size={iconSize} weight="regular" color={BRAND.white} />
    </div>
  )
}

function HubShowcaseCard() {
  return (
    <div
      className="relative w-full aspect-square sm:aspect-auto sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: BRAND.blueDark }}
    >
      <span
        className="absolute top-5 left-6 md:top-7 md:left-8 text-[0.65rem] font-bold uppercase tracking-widest"
        style={{ color: BRAND.techGreyDark }}
      >
        {BIZ.name} / Bothaville
      </span>

      <div className="absolute top-5 right-6 md:top-7 md:right-8 text-right">
        <span className="block font-black text-4xl md:text-5xl leading-none" style={{ color: BRAND.orange }}>
          {String(BIZ.hubCount).padStart(2, "0")}
        </span>
        <span className="block text-[0.65rem] font-bold uppercase tracking-widest mt-1" style={{ color: BRAND.techGreyDark }}>
          Hubs
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[68%] h-[68%] max-w-[260px] max-h-[260px]">
          {CARD_ICONS.map(({ icon, position, size }, i) => (
            <CardIcon key={i} icon={icon} position={position} size={size} />
          ))}
        </div>
      </div>

      <span
        className="absolute bottom-5 left-6 md:bottom-7 md:left-8 text-[0.65rem] font-bold uppercase tracking-widest"
        style={{ color: BRAND.techGreyDark }}
      >
        Your Local Partner
      </span>

      <span
        className="absolute bottom-5 right-6 md:bottom-7 md:right-8 text-[0.65rem] font-bold uppercase tracking-widest text-right"
        style={{ color: BRAND.white }}
      >
        Print / Design / Tech
      </span>
    </div>
  )
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export function HeroSection() {
  const router = useRouter()
  const { resolvedTheme } = useTheme()
  // FIX: was a lazy `useState(() => typeof window !== "undefined")` — that
  // evaluates true on the client's very first render (hydration also runs
  // in the browser, where `window` already exists), while the server
  // rendered `false`. That's a real hydration mismatch. Back to the safe
  // pattern: start false everywhere, flip true only after mount.
  const [mounted, setMounted] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [status, setStatus] = useState<BusinessStatus | null>(null)
  const [weatherCategory, setWeatherCategory] = useState<WeatherCategory | null>(null)
  const showBackToTop = useBackToTop()
  const prefersReducedMotion = usePrefersReducedMotion()

  const ctaBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
    setStatus(getBusinessStatus())
    const id = setInterval(() => setStatus(getBusinessStatus()), 60_000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!status?.isHoliday) return
    getWeatherSnapshot().then((snapshot) => {
      if (snapshot) setWeatherCategory(snapshot.category)
    })
  }, [status?.isHoliday])

  const isDark = mounted && resolvedTheme === "dark"

  const STROKE_COLOR = BRAND.blue
  const CTA_FILL_COLOR = BRAND.blue
  const REST_COLOR = isDark ? BRAND.lightBlue : BRAND.blue

  const activeCircleColor = CTA_FILL_COLOR
  const activeArrowIconColor = getArrowIconColor(activeCircleColor)

  const showHolidayBanner = mounted && status?.isHoliday
  const displayCategory = weatherCategory ?? (status ? fallbackCategory(status.greeting) : "clear-day")
  const { Icon: WeatherIcon, color: weatherIconColor } = WEATHER_ICON_MAP[displayCategory]

  const handleNavigate = (path: string) => router.push(path)
  const handleCtaClick = () => handleNavigate("/quote")
  const handleServicesClick = () => handleNavigate("/services")

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

      <div className="max-w-[1240px] mx-auto flex flex-col items-center relative z-10 w-full mb-6">

        <div className="w-full max-w-[1100px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-10 md:mb-14">

          {/* Left column — text + CTA */}
          <div className="text-center md:text-left">

            {showHolidayBanner && status && (
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
                <WeatherIcon size={16} weight="fill" style={{ color: weatherIconColor }} aria-hidden="true" />
                Tech, Design &amp; E-Service are closed today for {status.holidayName} — Print &amp; Docu is open as usual
              </p>
            )}

            {/* Proposed new headline copy — swap the three words below if you want different wording */}
            <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] mb-4 transition-colors duration-300">
              <span className="block text-zinc-900 dark:text-zinc-50">Print.</span>
              <span className="block text-zinc-400 dark:text-zinc-600">Design.</span>
              <span className="block text-zinc-900 dark:text-zinc-50">Sorted.</span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-zinc-600 dark:text-zinc-400 max-w-[480px] md:max-w-none mx-auto md:mx-0 leading-relaxed mb-6">
              {BIZ.tagline}
            </p>

            <div className="mb-8 md:mb-10">
              <ClassicTagline />
            </div>

            <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-6">
              <ScrollBounce>
                <button
                  ref={ctaBtnRef}
                  onClick={handleCtaClick}
                  style={{ borderColor: STROKE_COLOR }}
                  className="group relative z-30 flex items-center w-[300px] sm:w-[320px] px-5 sm:px-7 py-5 rounded-full font-sans font-black overflow-hidden border-2 transition-all duration-150 active:duration-75 touch-manipulation hover:-translate-y-1 active:translate-y-0 active:scale-[0.94] shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_6px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_12px_36px_rgba(0,0,0,0.7)] active:shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:active:shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 origin-bottom scale-y-0 transition-transform duration-150 ease-out group-hover:scale-y-100 group-active:scale-y-100"
                    style={{ backgroundColor: CTA_FILL_COLOR }}
                  />
                  <span className="relative z-10 w-8 h-8 shrink-0" aria-hidden="true" />
                  <span
                    className="relative z-10 flex-1 flex items-center justify-center whitespace-nowrap transition-colors duration-150"
                    style={{ color: REST_COLOR }}
                  >
                    <span className="group-hover:text-white group-active:text-white transition-colors duration-150 text-xl sm:text-2xl">
                      Start with a Quote
                    </span>
                  </span>
                  <span className="relative z-10 w-8 h-8 shrink-0 rounded-full shadow-sm overflow-hidden" aria-hidden="true">
                    <span
                      className="absolute inset-0 rounded-full inline-flex items-center justify-center transition-opacity duration-150 group-active:opacity-0"
                      style={{ backgroundColor: activeCircleColor }}
                    >
                      <ArrowRight weight="bold" style={{ color: activeArrowIconColor }} className="w-4 h-4 transition-all duration-300 group-hover:translate-x-0.5" />
                    </span>
                    <span className="absolute inset-0 rounded-full inline-flex items-center justify-center bg-white opacity-0 transition-opacity duration-150 group-active:opacity-100">
                      <ArrowRight weight="bold" style={{ color: BRAND.orange }} className="w-4 h-4 group-active:translate-x-0.5" />
                    </span>
                  </span>
                </button>
              </ScrollBounce>

              {/* Plain text link, desktop only — no pill */}
              <button
                onClick={handleServicesClick}
                className="hidden md:inline-flex items-center gap-1.5 font-bold text-base hover:underline underline-offset-4 transition-colors duration-150"
                style={{ color: STROKE_COLOR }}
              >
                See Our Services
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Right column — flat-icon hub showcase card */}
          <ScrollBounce delay={0.1} className="w-full">
            <HubShowcaseCard />
          </ScrollBounce>
        </div>

        {/* Marquee */}
        <div
          role="group"
          aria-label="Our services"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onTouchStart={(e) => { e.stopPropagation(); setMarqueePaused((p) => !p) }}
          className="relative w-full max-w-[1240px] py-4 overflow-hidden select-none group/marquee rounded-[14px] bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
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
