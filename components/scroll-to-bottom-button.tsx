// components/scroll-to-bottom-button.tsx
// Repositioned — was fixed near the top of the viewport, floating on its
// own. Now stacks directly above BackToTopButton at the bottom, same
// horizontal center, so the pair reads as one matched control instead of
// two buttons in unrelated places. Any page using both should pass a
// `bottomClass` here that sits ~70px above whatever bottomClass it gives
// BackToTopButton (enough room for this button's own 48px height + a
// gap), matching them the same way contact-page.tsx does.
"use client"

import { useState, useEffect } from "react"
import { ArrowDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

export function ScrollToBottomButton({
  visible,
  bottomClass = "bottom-24",
  className,
}: {
  visible: boolean
  bottomClass?: string
  className?: string
}) {
  return (
    <button
      onClick={() =>
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })
      }
      aria-label="Scroll to bottom"
      className={cn(
        "group fixed left-1/2 -translate-x-1/2 z-[9990] w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-lg flex items-center justify-center transition-all duration-300 active:scale-95 hover:scale-105",
        bottomClass,
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none",
        className
      )}
    >
      <ArrowDown size={20} weight="bold" className="text-muted-foreground transition-colors duration-200 group-hover:text-brand-blue dark:group-hover:text-brand-light-blue" />
    </button>
  )
}

// Visible whenever there's more than `threshold` px left to scroll before
// hitting the bottom of the document — mirror of useBackToTop's condition.
export function useScrollToBottom(threshold = 600) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const distanceToBottom =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      setVisible(distanceToBottom > threshold)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [threshold])
  return visible
} 
