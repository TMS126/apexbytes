"use client"

import { Wrench } from "@phosphor-icons/react"
import { useState } from "react"

export function ComingSoonTool() {
  const [open, setOpen] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setOpen((value) => !value)}
      aria-describedby={open ? "coming-soon-tooltip" : undefined}
      aria-label="Coming Soon"
      className="group flex min-h-24 w-full items-center justify-center rounded-[14px] p-5 text-center transition-transform duration-150 active:translate-y-px"
    >
      <span className="relative flex flex-col items-center gap-2">
        <span className="flex size-12 items-center justify-center rounded-[14px] bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Wrench weight="regular" className="size-7" aria-hidden="true" />
        </span>
        <span className="text-sm font-bold text-foreground">Coming soon</span>
        {open && (
          <span id="coming-soon-tooltip" role="tooltip" className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-[14px] bg-foreground px-3 py-1.5 text-xs font-bold text-background shadow-md">
            Coming Soon
          </span>
        )}
      </span>
    </button>
  )
}
