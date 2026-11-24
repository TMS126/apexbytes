// components/maintenance-banner.tsx
"use client"

import { useEffect, useState } from "react"
import { Wrench, X } from "@phosphor-icons/react"
import { MAINTENANCE_BANNER } from "@/lib/brand"

const DISMISS_KEY = `abh-maintenance-dismissed-v${MAINTENANCE_BANNER.version}`

export function MaintenanceBanner() {
  // Keep the first client render identical to the server render. Browser-only
  // dismissal state is loaded after hydration in the effect below.
  const [mounted, setMounted] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setDismissed(localStorage.getItem(DISMISS_KEY) === "1")
      } catch {
        // localStorage unavailable (private browsing, etc.) — default to showing the banner
      } finally {
        setMounted(true)
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const visible = MAINTENANCE_BANNER.active && mounted && !dismissed

  useEffect(() => {
    document.documentElement.classList.toggle("banner-active", visible)
    return () => { document.documentElement.classList.remove("banner-active") }
  }, [visible])

  if (!visible) return null

  const handleDismiss = () => {
    setDismissed(true)
    try {
      localStorage.setItem(DISMISS_KEY, "1")
    } catch {
      // ignore — worst case the banner just reappears next visit
    }
  }

  return (
    <div
      role="region"
      aria-label="Site notice"
      data-maintenance-banner="true"
      className="fixed bottom-4 left-4 z-[10000] w-[min(22rem,calc(100vw-2rem))] rounded-[14px] px-4 pb-4 pt-5 shadow-[0_18px_46px_-18px_rgba(0,0,0,0.7)] animate-in slide-in-from-bottom-3 fade-in duration-300 sm:bottom-6 sm:left-6"
      style={{ color: "var(--maintenance-text)", background: "linear-gradient(135deg, var(--maintenance-bg-start) 0%, var(--maintenance-bg-end) 100%)" }}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notice"
        data-no-lift="true"
        className="abh-close-chip abh-maintenance-close-chip absolute left-1/2 top-0 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X size={15} weight="bold" />
      </button>
      <div className="flex items-start gap-3">
        <Wrench size={18} weight="regular" className="mt-0.5 shrink-0 opacity-90" aria-hidden="true" />
        <p className="min-w-0 text-left text-sm leading-relaxed">
        {MAINTENANCE_BANNER.message}{" "}
        <a
          href={MAINTENANCE_BANNER.linkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="whitespace-nowrap font-semibold underline decoration-white/60 underline-offset-2 transition-opacity hover:opacity-80"
          style={{ color: "var(--maintenance-text)" }}
        >
          {MAINTENANCE_BANNER.linkText}
        </a>
        </p>
      </div>
    </div>
  )
}
