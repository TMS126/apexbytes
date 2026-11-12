"use client"

import { ArrowDown } from "@phosphor-icons/react"

export function EditorialScrollCue() {
  return (
    <button
      type="button"
      aria-label="Scroll down"
      className="abh-editorial-scroll-cue mt-8 inline-flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      onClick={() => window.scrollBy({ top: Math.max(window.innerHeight * 0.78, 480), behavior: "smooth" })}
    >
      <ArrowDown size={16} aria-hidden="true" />
    </button>
  )
}
