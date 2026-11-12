"use client"

import { useState } from "react"
import React from "react"
import { Pause, Play } from "@phosphor-icons/react"
import { MARQUEE_ITEMS } from "@/lib/brand"

export function HomeServiceMarquee() {
  const [paused, setPaused] = useState(false)

  return (
    <section
      role="group"
      aria-label="Our services"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        event.stopPropagation()
        setPaused((value) => !value)
      }}
      className="relative w-full overflow-hidden bg-transparent py-4 select-none group/marquee [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]"
    >
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? "Play scrolling services list" : "Pause scrolling services list"}
        className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-muted-foreground transition-colors hover:text-foreground"
      >
        {paused ? <Play size={11} weight="fill" aria-hidden="true" /> : <Pause size={11} weight="fill" aria-hidden="true" />}
      </button>
      <div className="flex w-max whitespace-nowrap animate-marquee" style={{ animationPlayState: paused ? "paused" : "running" }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? "true" : undefined}>
            {MARQUEE_ITEMS.map((item, index) => (
              <React.Fragment key={index}>
                <span className="inline-flex px-5 font-heading text-lg font-medium uppercase tracking-tight text-foreground transition-opacity duration-300 group-hover/marquee:opacity-70 hover:!opacity-100 md:text-2xl">
                  {item}
                </span>
                <span className="shrink-0 font-heading text-lg leading-none text-muted-foreground md:text-2xl" aria-hidden="true">/</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}
