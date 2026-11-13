// components/hero-section.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowDown, Cloud, CloudFog, CloudLightning, CloudMoon, CloudRain, CloudSun, Moon, Snowflake, Sun } from "@phosphor-icons/react"
import { WEATHER_THEME } from "@/lib/brand"
import { getBusinessStatus, type BusinessStatus } from "@/lib/sa-time"
import { getWeatherSnapshot, type WeatherCategory } from "@/lib/weather"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { HomeServiceMarquee } from "@/components/home-service-marquee"

const HERO_SUBHEAD = "Friendly print, design and tech support in Bothaville."

const WEATHER_ICON_MAP: Record<WeatherCategory, { Icon: typeof Sun; color: string }> = {
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

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [status, setStatus] = useState<BusinessStatus | null>(null)
  const [weatherCategory, setWeatherCategory] = useState<WeatherCategory | null>(null)
  const showBackToTop = useBackToTop()

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true)
      setStatus(getBusinessStatus())
    })
    const id = window.setInterval(() => setStatus(getBusinessStatus()), 60_000)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(id)
    }
  }, [])

  useEffect(() => {
    if (!status?.isHoliday) return
    getWeatherSnapshot().then((snapshot) => {
      if (snapshot) setWeatherCategory(snapshot.category)
    })
  }, [status?.isHoliday])

  const showHolidayBanner = mounted && status?.isHoliday
  const displayCategory = weatherCategory ?? (status ? fallbackCategory(status.greeting) : "clear-day")
  const { Icon: WeatherIcon, color: weatherIconColor } = WEATHER_ICON_MAP[displayCategory]
  const heroCtaClass = "group/hero-cta relative inline-flex h-12 w-full items-center justify-center rounded-full px-7 text-base font-bold text-foreground transition-colors hover:text-brand-blue focus-visible:outline-none sm:w-[170px]"

  return (
    <section
      aria-label="Hero"
      className="abh-home-hero relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-4 pb-20 pt-[calc(var(--nav-h)+24px)] md:px-8 md:pb-24"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-col items-center">
        <div className="flex max-w-[980px] flex-col items-center text-center">
          {showHolidayBanner && status && (
            <span className="sr-only">
              <WeatherIcon size={16} style={{ color: weatherIconColor }} aria-hidden="true" />
              Tech, Design &amp; E-Service are closed today for {status.holidayName} — Print &amp; Docu is open as usual
            </span>
          )}
          <p className="mb-4 text-sm font-medium text-muted-foreground md:text-base">{HERO_SUBHEAD}</p>
          <h1 className="abh-home-title text-foreground">
            <span className="block">Design. Print. Upgrade.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">Design, print &amp; tech, without the hassle.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("abh:open-quote-calculator"))}
              className={`${heroCtaClass} hover:text-brand-orange`}
            >
              Quote
              <span aria-hidden="true" className="absolute inset-x-7 bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-250 ease-out group-hover/hero-cta:scale-x-100 group-focus-visible/hero-cta:scale-x-100" />
            </button>
            <Link
              href="/services"
              className={heroCtaClass}
            >
              Services
              <span aria-hidden="true" className="absolute inset-x-7 bottom-1 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-250 ease-out group-hover/hero-cta:scale-x-100 group-focus-visible/hero-cta:scale-x-100" />
            </Link>
          </div>
          <a
            href="#core-hubs-title"
            aria-label="Explore our services"
            className="abh-scroll-cue mt-16 inline-flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowDown size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-5 md:bottom-8">
        <HomeServiceMarquee />
      </div>
      <BackToTopButton visible={showBackToTop} />
    </section>
  )
}
