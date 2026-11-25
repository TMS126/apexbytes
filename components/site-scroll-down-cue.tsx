"use client"

import { useEffect, useState } from "react"
import { ArrowDown } from "@phosphor-icons/react"

export function SiteScrollDownCue() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const update = () => {
      const canScroll = document.documentElement.scrollHeight > window.innerHeight + 80
      const hasPageCue = Boolean(document.querySelector(".abh-editorial-scroll-cue"))
      setVisible(canScroll && !hasPageCue && window.scrollY < 140)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" })}
      className={`abh-site-scroll-down fixed bottom-28 left-1/2 z-[9991] inline-flex size-8 -translate-x-1/2 items-center justify-center rounded-full text-muted-foreground transition-[opacity,transform,color] duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:bottom-7 ${visible ? "translate-y-0 opacity-[0.62]" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowDown size={16} weight="regular" aria-hidden="true" />
    </button>
  )
}
