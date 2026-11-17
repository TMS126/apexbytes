// app/tools/jpg-to-pdf/settings-bar.tsx
"use client"

import { useRef, useCallback, useState } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"
import { PAGE_SIZES, MODE_LABELS, type PageSizeOption } from "./constants"
import { qualityLabel, formatBytes } from "./utils"
import type { ConvertMode, PageSize } from "./types"

const QUALITY_MIN = 0.4
const QUALITY_MAX = 0.95

const TRACK_GRADIENT = `linear-gradient(90deg,
  ${BRAND.blue} 0%, ${BRAND.blue} 52%,
  ${BRAND.green} 68%, ${BRAND.green} 82%,
  ${BRAND.orange} 94%, ${BRAND.orange} 100%)`

const OUTPUT_OPTIONS: { value: ConvertMode; label: string; description: string }[] = [
  { value: "merge", label: "One combined PDF", description: "All selected images become one ordered PDF." },
  { value: "separate", label: "Separate PDFs", description: "Download one PDF for each selected image." },
]

const QUALITY_OPTIONS = [
  { value: 0.55, label: "Small file", description: "Best for quick sharing" },
  { value: 0.75, label: "Balanced", description: "Good quality and size" },
  { value: 0.95, label: "Print-ready", description: "Keeps the most detail" },
]

function OptionCard({ selected, onClick, title, description, accentColor }: {
  selected: boolean
  onClick: () => void
  title: string
  description: string
  accentColor: string
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className="relative rounded-xl border px-3 py-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/5"
      style={selected ? { borderColor: accentColor, backgroundColor: `${accentColor}12`, boxShadow: `0 0 0 2px ${accentColor}24` } : undefined}
    >
      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
        <span className="flex size-4 items-center justify-center rounded-full border" style={{ borderColor: selected ? accentColor : "var(--border)" }} aria-hidden="true">
          {selected && <span className="size-2 rounded-full" style={{ backgroundColor: accentColor }} />}
        </span>
        {title}
      </span>
      <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{description}</span>
    </button>
  )
}

function QualitySlider({ quality, setQuality, accentColor }: { quality: number; setQuality: (q: number) => void; accentColor: string }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const [dragging, setDragging] = useState(false)
  const pct = ((quality - QUALITY_MIN) / (QUALITY_MAX - QUALITY_MIN)) * 100

  const updateFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width))
    const stepped = Math.round((QUALITY_MIN + ratio * (QUALITY_MAX - QUALITY_MIN)) / 0.05) * 0.05
    setQuality(Math.min(QUALITY_MAX, Math.max(QUALITY_MIN, Number(stepped.toFixed(2)))))
  }, [setQuality])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
    updateFromClientX(e.clientX)
  }
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromClientX(e.clientX)
  }
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
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
      className="relative flex h-8 w-full cursor-pointer touch-none select-none items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="absolute inset-x-0 h-2 rounded-full" style={{ background: TRACK_GRADIENT }} />
      <div
        aria-hidden="true"
        className="absolute flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-white shadow-md dark:border-zinc-200 dark:bg-zinc-100"
        style={{ left: `calc(${pct}% - 14px)`, transition: dragging ? "none" : "left 120ms cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <span className="size-3 rounded-full" style={{ backgroundColor: accentColor }} />
      </div>
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
  const [openSection, setOpenSection] = useState<"output" | "page-size" | null>("output")
  const sizeGroups: { label: string; options: PageSizeOption[] }[] = [
    { label: "Standard", options: Object.values(PAGE_SIZES).filter((option) => ["a4", "letter", "legal"].includes(option.value)) },
    { label: "ISO paper", options: Object.values(PAGE_SIZES).filter((option) => option.value.startsWith("a") && !["a4"].includes(option.value)) },
    { label: "Photo", options: Object.values(PAGE_SIZES).filter((option) => option.value.startsWith("photo")) },
  ]

  return (
    <div className="flex flex-col rounded-[18px] border border-border/70 bg-card p-4 shadow-[var(--shadow-card-lift)] md:p-5">
      <section aria-labelledby="pdf-output-heading" className="pb-5">
        <button
          type="button"
          onClick={() => setOpenSection((current) => (current === "output" ? null : "output"))}
          aria-expanded={openSection === "output"}
          aria-controls="pdf-output-content"
          className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/45 px-3 py-3 text-left transition-[background-color,border-color,box-shadow] hover:border-primary/40 hover:bg-secondary/55 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span>
            <span id="pdf-output-heading" className="block text-sm font-medium text-foreground">Output</span>
            <span className="mt-1 block text-xs text-muted-foreground">{MODE_LABELS[mode]}</span>
          </span>
          <CaretDown size={16} weight="regular" aria-hidden="true" className={`shrink-0 text-muted-foreground transition-transform duration-200 ${openSection === "output" ? "rotate-180" : ""}`} />
        </button>
        <div
          id="pdf-output-content"
          role="region"
          aria-labelledby="pdf-output-heading"
          aria-hidden={openSection !== "output"}
          inert={openSection !== "output"}
          className={`grid min-h-0 transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${openSection === "output" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="pt-3">
              <p className="mb-3 text-xs text-muted-foreground">Choose how your selected images become PDFs.</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {OUTPUT_OPTIONS.map((option) => (
                  <OptionCard key={option.value} selected={mode === option.value} onClick={() => setMode(option.value)} title={option.label} description={option.description} accentColor={accentColor} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pdf-size-heading" className="border-t border-border/60 py-5">
        <button
          type="button"
          onClick={() => setOpenSection((current) => (current === "page-size" ? null : "page-size"))}
          aria-expanded={openSection === "page-size"}
          aria-controls="pdf-size-content"
          className="group flex w-full items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/45 px-3 py-3 text-left transition-[background-color,border-color,box-shadow] hover:border-primary/40 hover:bg-secondary/55 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <span>
            <span id="pdf-size-heading" className="block text-sm font-medium text-foreground">Page size</span>
            <span className="mt-1 block text-xs text-muted-foreground">{PAGE_SIZES[pageSize].label}</span>
          </span>
          <CaretDown size={16} weight="regular" aria-hidden="true" className={`shrink-0 text-muted-foreground transition-transform duration-200 ${openSection === "page-size" ? "rotate-180" : ""}`} />
        </button>
        <div
          id="pdf-size-content"
          role="region"
          aria-labelledby="pdf-size-heading"
          aria-hidden={openSection !== "page-size"}
          inert={openSection !== "page-size"}
          className={`grid min-h-0 transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${openSection === "page-size" ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="space-y-3 pt-3">
              <p className="text-xs text-muted-foreground">Pick the paper size your PDF should use.</p>
              {sizeGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">{group.label}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {group.options.map((option) => (
                      <OptionCard key={option.value} selected={pageSize === option.value} onClick={() => setPageSize(option.value)} title={option.label} description={option.description} accentColor={accentColor} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="pdf-quality-heading" className="border-t border-border/60 pt-5">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 id="pdf-quality-heading" className="text-sm font-medium text-foreground">Quality</h2>
            <p className="mt-1 text-xs text-muted-foreground">Higher quality keeps more detail; lower quality creates a smaller file.</p>
          </div>
          <span className="text-sm font-medium" style={{ color: accentColor }}>{qualityLabel(quality)}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {QUALITY_OPTIONS.map((option) => (
            <OptionCard key={option.value} selected={quality === option.value} onClick={() => setQuality(option.value)} title={option.label} description={option.description} accentColor={accentColor} />
          ))}
        </div>
        <div className="mt-4">
          <QualitySlider quality={quality} setQuality={setQuality} accentColor={accentColor} />
          <div className="flex justify-between text-[0.7rem] text-muted-foreground"><span>Smaller file</span><span>High quality</span></div>
        </div>
        {originalBytes !== null && (
          <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
            Original {formatBytes(originalBytes)} → Estimated {estimatedBytes !== null ? formatBytes(estimatedBytes) : "…"}
          </p>
        )}
      </section>
    </div>
  )
}
