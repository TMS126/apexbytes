"use client"

import type { CSSProperties } from "react"
import { TOKEN } from "@/lib/brand"

export type NoticeMarkerVariant = "success" | "info" | "warning" | "error" | "neutral"

const MARKER_COLORS: Record<NoticeMarkerVariant, string> = {
  success: TOKEN.greenText,
  info: TOKEN.blueText,
  warning: TOKEN.orangeText,
  error: TOKEN.errorText,
  neutral: "var(--muted-foreground)",
}

export function NoticeMarker({
  Icon,
  variant = "info",
  size = 18,
  className,
}: {
  Icon: React.ElementType
  variant?: NoticeMarkerVariant
  size?: number
  className?: string
}) {
  const color = MARKER_COLORS[variant]
  const style = { color } as CSSProperties

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
      style={style}
      aria-hidden="true"
    >
      <Icon size={size} weight="regular" />
      <span
        className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-background"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}
