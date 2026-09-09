// hooks/use-scroll-hide.ts
"use client"

// Shared scroll-hide behavior for floating widget triggers (WhatsApp FAB,
// Search FAB, Quote Calculator FAB). Returns `true` while the page is
// actively being scrolled, so each widget's closed-state trigger can fade
// out of the way of content and reappear a short beat after scrolling
// settles. Skips entirely for prefers-reduced-motion users, who never lose
// the trigger to begin with.

import { useEffect, useRef, useState } from "react"

const IDLE_DELAY = 600 // ms of no scroll before the trigger reappears

export function useScrollHide() {
  const [isScrolling, setIsScrolling] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const reduceMotion = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const onScroll = () => {
      setIsScrolling(true)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIsScrolling(false), IDLE_DELAY)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return isScrolling
}
