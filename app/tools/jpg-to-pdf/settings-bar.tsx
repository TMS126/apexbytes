// app/tools/jpg-to-pdf/settings-bar.tsx
"use client"

import { useRef, useCallback, useState } from "react"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"
import { BRAND } from "@/lib/brand"
import { PAGE_SIZES, MODE_LABELS } from "./constants"
import { qualityLabel, formatBytes } from "./utils"
import type { ConvertMode, PageSize } from "./types"

const QUALITY_MIN = 0.4
const QUALITY_MAX = 0.95

// 60% blue / 30% green / 10% orange, blended smoothly rather than hard
// color-stop cuts — each color holds its "core" briefly then eases into
// the next over a short blend zone.
const TRACK_GRADIENT = `linear-gradient(90deg,
  ${BRAND.blue} 0%, ${BRAND.blue} 52%,
  ${BRAND.green} 68%, ${BRAND.green} 82%,
  ${BRAND.orange} 94%, ${BRAND.orange} 100%)`

function QualitySlider({
  quality, setQuality,
}: {
  quality: number
  setQuality: (q: number) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)

  const pct = ((quality - QUALITY_MIN) / (QUALITY_MAX - QUALITY_MIN)) * 100

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const raw = QUALITY_MIN + ratio * (QUALITY_MAX - QUALITY_MIN)
    // Snap to the nearest 0.05 step, same granularity as before.
    const stepped = Math.round(raw / 0.05) * 0.05
    setQuality(Math.min(QUALITY_MAX, Math.max(QUALITY_MIN, Number(stepped.toFixed(2)))))
  }, [setQuality])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    setDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return
    updateFromClientX(e.clientX)
  }
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    setDragging(false)
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault()
      setQuality(Math.max(QUALITY_MIN, Number((quality - 0.05).toFixed(2))))
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault()
      setQuality(Math.min(QUALITY_MAX, Number((quality + 0.05).toFixed(2))))
    }
  }

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Conversion quality"
      aria-valuemin={QUALITY_MIN}
      aria-valuemax={QUALITY_MAX}
      aria-valuenow={quality}
      aria-valuetext={qualityLabel(quality)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className="relative w-full h-6 flex items-center cursor-pointer touch-none select-none focus:outline-none"
    >
      {/* Track — smooth blue→green→orange gradient */}
      <div className="absolute inset-x-0 h-2 rounded-full" style={{ background: TRACK_GRADIENT }} />

      {/* Thumb — neutral (white/zinc), moves via left% with a transition
          that's disabled mid-drag (so it never lags the pointer) and
          re-enabled on release for a tiny smoothing snap. No native
          input jank across browsers since this is fully custom. */}
      <div
        aria-hidden="true"
        className="absolute w-5 h-5 rounded-full bg-white dark:bg-zinc-100 border-2 border-white dark:border-zinc-200"
        style={{
          left: `calc(${pct}% - 10px)`,
          transition: dragging ? "none" : "left 120ms cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: "0 2px 6px -1px rgba(0,0,0,0.28), 0 1px 3px -1px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  )
}

export function SettingsBar({
  mode, setMode, pageSize, setPageSize, quality, setQuality, originalBytes, estimatedBytes, accentColor,
}: {
  mode: ConvertMode
  setMode: (m: ConvertMode) => void
  pageSize: PageSize
  setPageSize: (p: PageSize) => void
  quality: number
  setQuality: (q: number) => void
  originalBytes: number | null
  estimatedBytes: number | null
  accentColor: string
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* ─── OUTPUT / SIZE DROPDOWNS ────────────────────────────────────── */}
      <div className="flex flex-wrap justify-center lg:justify-start gap-2">
        <SimpleDropdown
          label="Output" value={mode} accentColor={accentColor}
          onChange={(v) => setMode(v as ConvertMode)}
          options={(Object.keys(MODE_LABELS) as ConvertMode[]).map((key) => ({ value: key, label: MODE_LABELS[key] }))}
        />
        <SimpleDropdown
          label="Size" value={pageSize} accentColor={accentColor}
          onChange={(v) => setPageSize(v as PageSize)}
          options={(Object.keys(PAGE_SIZES) as PageSize[]).map((key) => ({ value: key, label: PAGE_SIZES[key].label }))}
        />
      </div>

      {/* ─── QUALITY SLIDER ─────────────────────────────────────────────── */}
      <div className="rounded-[14px] bg-secondary/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">Quality</span>
          <span className="text-sm font-bold" style={{ color: accentColor }}>{qualityLabel(quality)}</span>
        </div>

        <QualitySlider quality={quality} setQuality={setQuality} />

        <div className="flex justify-between text-[0.7rem] text-muted-foreground mt-1">
          <span>Smaller file</span>
          <span>High quality</span>
        </div>
        {originalBytes !== null && (
          <p className="text-xs text-muted-foreground mt-2.5 text-center" aria-live="polite">
            Original {formatBytes(originalBytes)} → Estimated {estimatedBytes !== null ? formatBytes(estimatedBytes) : "…"}
          </p>
        )}
      </div>
    </div>
  )
}
