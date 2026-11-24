// components/quote-calculator/panel-header.tsx
"use client"

/* ============================================================
   PANEL HEADER — wordmark, live clock, theme toggle, title copy
   ============================================================ */

import { Sun, Moon } from "@phosphor-icons/react"

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
      <div className="flex items-center justify-end px-5 pb-2 pt-3 shrink-0 md:hidden" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
        <div className="flex items-center gap-2">
          {clockLabel && (
            <span className="text-[0.72rem] font-medium uppercase tracking-widest text-muted-foreground tabular-nums" aria-label="Current time">
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

      {!embedded && (
        <div className="shrink-0 border-b border-border px-5 pb-5 pt-3 text-center md:pt-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-blue-text)]">ApexBytesHub</p>
          <h3 className="mt-1 font-heading text-xl font-semibold leading-snug" style={{ color: titleAccent }}>
            {hasItems ? "Looking good so far" : "What can we help you with today?"}
          </h3>
          <p className="mt-1 text-sm font-medium text-muted-foreground">
            {hasItems ? "Add more, or send it through whenever you're ready." : "Tap a hub below and let's put your quote together."}
          </p>
        </div>
      )}
    </>
  )
}
