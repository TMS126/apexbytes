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
      aria-label="Scroll down"
      onClick={() => window.scrollBy({ top: Math.max(window.innerHeight * 0.78, 480), behavior: "smooth" })}
      className={`abh-site-scroll-down fixed bottom-5 right-4 z-[9991] inline-flex size-10 items-center justify-center rounded-full text-[var(--line-rule)] transition-[opacity,transform,color] duration-200 md:bottom-6 md:right-6 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
    >
      <ArrowDown size={19} weight="regular" aria-hidden="true" />
    </button>
  )
}
