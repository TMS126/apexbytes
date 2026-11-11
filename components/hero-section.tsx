// components/hero-section.tsx
"use client"

import React, { useState, useEffect } from "react"
import {
  ArrowUpRight, ArrowDown, Play, Pause,
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudRain, CloudLightning, Snowflake,
} from "@phosphor-icons/react"
import { MARQUEE_ITEMS, WEATHER_THEME } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { getWeatherSnapshot, type WeatherCategory } from "@/lib/weather"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { HomeNoticeStack } from "@/components/home-notice-stack"
import { HOME_NOTICES } from "@/lib/home-notices"

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

const HERO_SUBHEAD = "Friendly print, design and tech support in Bothaville."

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [marqueePaused, setMarqueePaused] = useState(false)
  const [status, setStatus] = useState<BusinessStatus | null>(null)
  const [weatherCategory, setWeatherCategory] = useState<WeatherCategory | null>(null)
  const showBackToTop = useBackToTop()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true)
      setStatus(getBusinessStatus())
    })
    const id = setInterval(() => setStatus(getBusinessStatus()), 60_000)
    return () => {
      cancelAnimationFrame(frame)
      clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (!status?.isHoliday) return
    getWeatherSnapshot().then((snapshot) => { if (snapshot) setWeatherCategory(snapshot.category) })
  }, [status?.isHoliday])

  const showHolidayBanner = mounted && status?.isHoliday
  const displayCategory = weatherCategory ?? (status ? fallbackCategory(status.greeting) : "clear-day")
  const { Icon: WeatherIcon, color: weatherIconColor } = WEATHER_ICON_MAP[displayCategory]

  const [quoteLabel, setQuoteLabel] = useState("Start with a Quote")
  const handleCtaClick = () => {
    setQuoteLabel("Opening quote…")
    window.dispatchEvent(new CustomEvent("abh:open-quote-calculator"))
    window.setTimeout(() => setQuoteLabel("Start with a Quote"), 900)
  }
  return (
    <section
      aria-label="Hero"
      className="abh-home-hero relative min-h-[100svh] w-full flex flex-col items-center justify-center px-4 md:px-8 pt-[calc(var(--nav-h)+24px)] pb-20 md:pb-24 overflow-hidden"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center">

        {/* Homepage-only update notices — single notice expands inline,
            more than one opens a modal with one card per notice. */}
        <div className="mb-3 flex w-full justify-center">
          <HomeNoticeStack notices={HOME_NOTICES} />
        </div>

        <div className="mb-6 flex w-full max-w-[980px] flex-col items-center text-center md:mb-8">

            {showHolidayBanner && status && (
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-3">
                <WeatherIcon size={16} weight="regular" style={{ color: weatherIconColor }} aria-hidden="true" />
                Tech, Design &amp; E-Service are closed today for {status.holidayName} — Print &amp; Docu is open as usual
              </p>
            )}



            <p className="mb-3 text-sm font-medium text-muted-foreground md:text-base">
              {HERO_SUBHEAD}
            </p>

            <h1 className="abh-home-title mb-5 text-foreground">
              <span className="block">Design, print &amp; tech,</span>
              <span className="block">without the hassle.</span>
            </h1>


            <div className="mb-7 mt-7 flex flex-col items-center gap-3">
              <ScrollBounce>
                <button
                  onClick={handleCtaClick}
                  className="abh-pill-action group/quote inline-flex items-center gap-2 bg-muted/80 px-5 py-2.5 font-sans text-sm font-medium text-foreground transition-colors hover:bg-muted active:brightness-95"
                >
                  <span className="transition-opacity duration-150 group-active/quote:opacity-70">{quoteLabel}</span>
                  <ArrowUpRight weight="bold" className="w-4 h-4" aria-hidden="true" />
                </button>
              </ScrollBounce>

              <a
                href="#core-hubs-title"
                aria-label="Explore our services"
                className="flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>

        </div>

        <div
          role="group"
          aria-label="Our services"
          onMouseEnter={() => setMarqueePaused(true)}
          onMouseLeave={() => setMarqueePaused(false)}
          onTouchStart={(e) => { e.stopPropagation(); setMarqueePaused((p) => !p) }}
          className="relative w-full max-w-[1400px] overflow-hidden select-none group/marquee bg-transparent py-4 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
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
                    <span className="inline-flex items-center px-5 font-heading text-lg font-medium uppercase tracking-tight text-foreground transition-opacity duration-300 group-hover/marquee:opacity-70 hover:!opacity-100 md:text-2xl">
                      {item}
                    </span>
                    <span className="shrink-0 font-heading text-lg leading-none text-muted-foreground md:text-2xl" aria-hidden="true">/</span>
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
