// components/quote-calculator/panel-header.tsx
"use client"

interface PanelHeaderProps {
  hasItems: boolean
  titleAccent: string
  embedded?: boolean
}

export function PanelHeader({ hasItems, titleAccent, embedded = false }: PanelHeaderProps) {
  return (
    <>
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
