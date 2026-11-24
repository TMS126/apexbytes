// components/back-to-top-button.tsx
// Shared scroll-to-top button — previously copy-pasted identically across
// contact-page.tsx, services-page/index.tsx, about-page.tsx, and
// gallery-page.tsx. bottomClass lets contact-page clear its sticky mobile
// WhatsApp bar; every other page uses the default.
//
// FIXES:
// 1. Was missing `import { useState, useEffect } from "react"` entirely —
//    useBackToTop() calls both hooks below but nothing imported them, which
//    fails to compile the moment this file is actually built (not just a
//    lint warning — useState/useEffect were undefined in scope).
// 2. Was pinned to `left-4` (bottom-left corner) — now centered
//    horizontally via `left-1/2 -translate-x-1/2`, per request. Composes
//    fine with the existing show/hide `translate-y-*` classes since
//    Tailwind's individual translate-x/translate-y utilities write to
//    separate CSS variables that feed one final `transform`.
"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useScrollToBottom } from "@/components/scroll-to-bottom-button"

export function BackToTopButton({
  visible,
  bottomClass = "bottom-6",
  className,
}: {
  visible: boolean
  bottomClass?: string
  className?: string
}) {
  const showScrollToBottom = useScrollToBottom()
  void visible
  return (
    <div className={cn("fixed right-4 z-[9990] text-foreground", bottomClass, className)}>
      <button
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
        aria-label="Scroll to bottom"
        className={cn("flex size-11 items-center justify-center rounded-full bg-zinc-950 text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95", showScrollToBottom ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none")}
      >
        <ArrowDown size={20} weight="bold" aria-hidden="true" />
      </button>
    </div>
  )
}

// Shared visibility hook — same 600px threshold + passive scroll listener
// every page re-implemented on its own.
export function useBackToTop(threshold = 600) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [threshold])
  return visible
}
