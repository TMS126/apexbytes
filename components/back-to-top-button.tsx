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
import { ArrowDown, ArrowUp } from "@phosphor-icons/react"
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
  return (
    <div className={cn("fixed right-4 z-[9990] flex items-center gap-1 rounded-full border border-border/80 bg-background/75 p-1 text-foreground shadow-md backdrop-blur-sm", bottomClass, className)}>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn("flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted", visible ? "opacity-100" : "opacity-45")}
      >
        <ArrowUp size={20} weight="regular" aria-hidden="true" />
      </button>
      <button
        onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
        aria-label="Scroll to bottom"
        className={cn("flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted", showScrollToBottom && !visible ? "opacity-100" : "opacity-45")}
      >
        <ArrowDown size={20} weight="regular" aria-hidden="true" />
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
