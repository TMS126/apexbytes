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
      // NEW — lets hooks/use-navbar.ts's useNavContrast exclude this
      // element the same way it already excludes <header>, so the
      // banner's own background never gets mistaken for page content
      // when deciding nav icon contrast.
      data-maintenance-banner="true"
      className="fixed inset-x-0 top-0 z-[10000] flex min-h-10 items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium shadow-[0_8px_24px_-14px_rgba(0,0,0,0.6)] animate-in fade-in duration-300 sm:gap-2.5 sm:px-4 sm:text-sm"
      style={{ color: "var(--maintenance-text)", background: "linear-gradient(105deg, var(--maintenance-bg-start) 0%, var(--maintenance-bg-end) 52%, var(--maintenance-bg-start) 100%)" }}
    >
      <Wrench size={14} weight="regular" className="hidden shrink-0 opacity-80 sm:block" aria-hidden="true" />
      <p className="min-w-0 text-center leading-tight">
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
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss notice"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-95"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  )
}
