// components/hero-section.tsx
"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ArrowUpRight, Play, Pause, CheckCircle,
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake,
} from "@phosphor-icons/react"
import { BIZ, MARQUEE_ITEMS, TOKEN, WEATHER_THEME } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { getWeatherSnapshot, type WeatherCategory } from "@/lib/weather"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

// ─── WEATHER ICON MAP (drives the holiday-banner icon) ──────────────────────
const WEATHER_ICON_MAP: Record<WeatherCategory, { Icon: React.ElementType; color: string }> = {
  "clear-day": { Icon: Sun, color: WEATHER_THEME.sun.light },
  "clear-night": { Icon: Moon, color: WEATHER_THEME.moon.light },
  "partly-cloudy-day": { Icon: CloudSun, color: WEATHER_THEME.sun.light },
  "partly-cloudy-night": { Icon: CloudMoon, color: WEATHER_THEME.moon.dark },
  cloudy: { Icon: Cloud, color: WEATHER_THEME.cloud.light },
  fog: { Icon: CloudFog, color: WEATHER_THEME.cloud.light },
  rain: { Icon: CloudRain, color: WEATHER_THEME.rain.light },
  thunderstorm: { Icon: CloudLightning, color: WEATHER_THEME.storm.light },
  snow: { Icon: Snowflake, color: WEATHER_THEME.snow.light },
}
function fallbackCategory(greeting: BusinessStatus["greeting"]): WeatherCategory {
  return greeting === "morning" || greeting === "afternoon" ? "clear-day" : "clear-night"
}

// ─── HERO SERVICES ILLUSTRATION ──────────────────────────────────────────────
function HubIconField({ isDark }: { isDark: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[560px] aspect-square">
      <Image
        src={isDark ? "/Hpl-transparent.png" : "/Hpd-transparent.png"}
        alt="Isometric printer, CV clipboard, design tools, globe with shield, laptop, and PC representing ApexbytesHub services"
        fill
        priority
        sizes="(max-width: 767px) 90vw, 560px"
        className="object-contain"
      />
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

  const showHolidayBanner = mounted && status?.isHoliday
  const displayCategory = weatherCategory ?? (status ? fallbackCategory(status.greeting) : "clear-day")
  const { Icon: WeatherIcon, color: weatherIconColor } = WEATHER_ICON_MAP[displayCategory]

  // "Start with a Quote" now opens the on-page quote calculator widget
  // (see components/quote-calculator/index.tsx) instead of navigating to
  // a /quote route, via a window event the widget listens for.
  const [quoteLabel, setQuoteLabel] = useState("Start with a Quote")
  const handleCtaClick = () => {
    setQuoteLabel("Opening quote…")
    window.dispatchEvent(new CustomEvent("abh:open-quote-calculator"))
    window.setTimeout(() => setQuoteLabel("Start with a Quote"), 900)
  }
  const handleServicesClick = () => router.push("/services")

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[calc(100vh-var(--nav-h))] w-full flex flex-col items-center justify-center px-4 md:px-8 pt-[calc(var(--nav-h)+56px)] md:pt-[104px] pb-10 md:pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' result='noise'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23000' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </div>

      {/* NOTE: max-widths bumped here (1240→1400 / 1100→1280) to take more
          width as asked. A true whole-site width increase needs the shared
          page container/layout component, which wasn't part of this file. */}
      <div className="max-w-[1400px] mx-auto flex flex-col items-center relative z-10 w-full mb-6">

        <div className="w-full max-w-[1280px] mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-10 md:mb-14">

          {/* Left column — everything marked in the screenshot, verbatim */}
          <div className="text-center md:text-left">

            {showHolidayBanner && status && (
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground dark:text-muted-foreground mb-3">
                <WeatherIcon size={16} weight="regular" style={{ color: weatherIconColor }} aria-hidden="true" />
                Tech, Design &amp; E-Service are closed today for {status.holidayName} — Print &amp; Docu is open as usual
              </p>
            )}

            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-3 text-brand-orange-text">
              <span aria-hidden="true">•</span> {BIZ.tagline.replace(/\.$/, "")}
            </p>

            <h1 className="font-sans font-black text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95] mb-4">
              <span className="block text-foreground">Design.</span>
              <span className="block text-muted-foreground">Print.</span>
              <span className="block text-foreground">Upgrade.</span>
            </h1>

            <p className="text-lg md:text-xl font-medium text-muted-foreground max-w-[480px] md:max-w-none mx-auto md:mx-0 leading-relaxed mb-8">
              {HERO_SUBHEAD}
            </p>

            <div className="flex flex-col sm:flex-row items-center md:items-center gap-4 sm:gap-6 mb-8 md:mb-9">
              <ScrollBounce>
              <button
                onClick={handleCtaClick}
                className="group/quote flex items-center justify-center gap-2 px-7 py-4 rounded-[14px] font-sans font-black text-lg sm:text-xl transition-all duration-150 active:scale-[0.94] active:brightness-95 hover:-translate-y-0.5 abh-shadow-badge"
                  style={{ backgroundColor: "var(--home-cta-bg)", color: "var(--home-cta-text)" }}
                >
                  <span className="min-w-[10.5rem] transition-opacity duration-150 group-active/quote:opacity-70">{quoteLabel}</span>
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
                className="group/services-cta flex items-center gap-2 px-6 py-4 rounded-[14px] font-sans font-black text-lg sm:text-xl bg-background text-foreground transition-all duration-150 active:scale-[0.94] active:brightness-95 hover:-translate-y-0.5 hover:bg-secondary hover:text-[var(--brand-blue)] dark:hover:text-[var(--brand-light-blue)]"
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
                <span key={hint} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground dark:text-muted-foreground">
                  <CheckCircle size={15} weight="regular" style={{ color: TOKEN.brandBlue }} aria-hidden="true" />
                  {hint}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — flat-icon hub field, card box removed */}
          <ScrollBounce delay={0.1} className="w-full">
            <HubIconField isDark={mounted && resolvedTheme === "dark"} />
          </ScrollBounce>
        </div>

        {/* Marquee */}
        <div
          role="group"
          aria-label="Our services"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onTouchStart={(e) => { e.stopPropagation(); setMarqueePaused((p) => !p) }}
          className="relative w-full max-w-[1400px] py-4 overflow-hidden select-none group/marquee border-y border-border bg-transparent [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
        >
          <button
            onClick={() => setMarqueePaused((p) => !p)}
            aria-pressed={marqueePaused}
            aria-label={marqueePaused ? "Play scrolling services list" : "Pause scrolling services list"}
            className="absolute top-1/2 right-2 -translate-y-1/2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground bg-background/90 border border-border transition-colors"
          >
            {marqueePaused ? <Play size={11} weight="fill" aria-hidden="true" /> : <Pause size={11} weight="fill" aria-hidden="true" />}
          </button>
          <div
            className="flex whitespace-nowrap w-max animate-marquee"
            style={{ animationPlayState: marqueePaused ? "paused" : "running" }}
          >
            {[0, 1].map((copy) => (
              <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1 ? "true" : undefined}>
                {MARQUEE_ITEMS.map((item, idx) => (
                  <React.Fragment key={idx}>
                    <span className="inline-flex items-center px-5 font-semibold text-base text-zinc-600 dark:text-muted-foreground transition-opacity duration-300 group-hover/marquee:opacity-70 hover:!opacity-100">
                      {item}
                    </span>
                    <span className="font-black text-lg leading-none shrink-0 text-zinc-300 dark:text-muted-foreground" aria-hidden="true">•</span>
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
