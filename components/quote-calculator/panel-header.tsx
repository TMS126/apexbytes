// components/quote-calculator/panel-header.tsx
"use client"

/* ============================================================
   PANEL HEADER — wordmark, live clock, theme toggle, title copy
   ============================================================ */

import Image from "next/image"
import { Sun, Moon } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface PanelHeaderProps {
  clockLabel: string
  isDark: boolean
  onToggleTheme: () => void
  hasItems: boolean
  titleAccent: string
  embedded?: boolean
}

export function PanelHeader({ clockLabel, isDark, onToggleTheme, hasItems, titleAccent, embedded = false }: PanelHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-2 shrink-0" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="" width={32} height={32} className="size-8 object-contain dark:invert" />
          
        </div>
        <div className="flex items-center gap-2">
          {clockLabel && (
            <span className="text-[0.78rem] font-medium uppercase tracking-widest text-muted-foreground tabular-nums" aria-label="Current time">
              {clockLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="abh-press abh-icon-chip w-8 h-8 rounded-full flex items-center justify-center bg-[var(--surface-modal-control)] text-foreground hover:bg-[var(--surface-modal-control-hover)] transition-colors"
          >
            {isDark ? <Sun size={16} weight="bold" aria-hidden="true" /> : <Moon size={16} weight="bold" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={cn("shrink-0 border-b border-border px-5 pb-4", embedded ? "text-left" : "text-center")}>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-blue-text)]">{embedded ? "QUOTE CALCULATOR" : "ApexBytesHub"}</p>
        <h3 className={cn("mt-1 font-heading text-xl font-semibold leading-snug", embedded && "text-3xl tracking-tight md:text-4xl")} style={{ color: embedded ? "var(--foreground)" : titleAccent }}>
          {embedded ? "Build your quote" : hasItems ? "Looking good so far" : "What can we help you with today?"}
        </h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {embedded ? "Choose a hub, add a service, and review it on the right." : hasItems ? "Add more, or send it through whenever you're ready." : "Tap a hub below and let's put your quote together."}
        </p>
      </div>
    </>
  )
}
