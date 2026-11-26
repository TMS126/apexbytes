"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { ArrowDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

// One fixed fallback control for every route. The in-page editorial cues stay
// where they belong (inside the hero/content), but there is only ever one
// bottom-right scroll-to-bottom button mounted.
export function SiteScrollDownCue() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [bannerActive, setBannerActive] = useState(false)

  useEffect(() => {
    const update = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      setVisible(distanceToBottom > 600)
    }

    update()
    // The layout persists across route changes and page content can grow after
    // mount (accordions, image previews), so re-measure on the next frame and
    // whenever the document resizes.
    const frame = requestAnimationFrame(update)
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [pathname])

  // The maintenance notice is bottom-fixed and spans most of a phone screen.
  // Track its html class so the fallback control sits above it, not behind it.
  useEffect(() => {
    const sync = () => setBannerActive(document.documentElement.classList.contains("banner-active"))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  // The contact page has a sticky mobile WhatsApp bar; lift the control above
  // it on small screens and return to the normal corner on desktop.
  const bottomClass = bannerActive
    ? pathname === "/contact"
      ? "bottom-[calc(env(safe-area-inset-bottom,0px)+11rem)] md:bottom-6"
      : "bottom-[calc(env(safe-area-inset-bottom,0px)+8.5rem)] md:bottom-6"
    : pathname === "/contact"
      ? "bottom-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] md:bottom-6"
      : "bottom-6"

  return (
    <button
      type="button"
      data-no-lift="true"
      aria-label="Scroll to bottom"
      title="Scroll to bottom"
      onClick={() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
      }
      className={cn(
        "abh-fixed-scroll-cue fixed right-4 z-[9991] flex size-11 items-center justify-center rounded-full bg-zinc-950 text-white shadow-md transition-[opacity,transform,background-color] duration-200 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 md:right-6",
        bottomClass,
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <ArrowDown size={20} weight="bold" aria-hidden="true" />
    </button>
  )
}
