// components/quote-calculator/panel-header.tsx
"use client"

/* ============================================================
   PANEL HEADER — wordmark, live clock, theme toggle, title copy
   ============================================================ */

import { Sun, Moon } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"

interface PanelHeaderProps {
  clockLabel: string
  isDark: boolean
  onToggleTheme: () => void
  hasItems: boolean
  titleAccent: string
}

export function PanelHeader({ clockLabel, isDark, onToggleTheme, hasItems, titleAccent }: PanelHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between px-5 pb-2 shrink-0" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <span className="font-sans font-black text-sm tracking-tight" style={{ color: titleAccent }}>{BIZ.name}</span>
        <div className="flex items-center gap-2">
          {clockLabel && (
            <span className="text-[0.62rem] font-bold uppercase tracking-widest text-muted-foreground tabular-nums" aria-label="Current time">
              {clockLabel}
            </span>
          )}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="abh-press w-8 h-8 rounded-full flex items-center justify-center bg-[var(--surface-modal-control)] text-foreground hover:bg-[var(--surface-modal-control-hover)] transition-colors"
          >
            {isDark ? <Sun size={16} weight="bold" aria-hidden="true" /> : <Moon size={16} weight="bold" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="px-5 pb-3 text-center shrink-0 border-b border-zinc-100 dark:border-white/10">
        <h3 className="font-sans font-black text-xl leading-snug" style={{ color: titleAccent }}>
          {hasItems ? "Looking good so far" : "What can we help you with today?"}
        </h3>
        <p className="text-[0.78rem] font-medium text-muted-foreground mt-1">
          {hasItems ? "Add more, or send it through whenever you're ready 🙂" : "Tap a hub below and let's put your quote together ✨"}
        </p>
      </div>
    </>
  )
}
