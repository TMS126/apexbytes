// components/contact/location-map.tsx
"use client"

import { ArrowSquareOut } from "@phosphor-icons/react"
import { BRAND, TOKEN, BIZ } from "@/lib/brand"

export function LocationMap() {
  return (
    <div className="relative w-full min-h-[360px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <div className="absolute inset-0 bg-[#dfe9e2] dark:bg-[#16231f]" role="img" aria-label={`Map area for ${BIZ.address}`}>
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(28deg,transparent_47%,rgba(255,255,255,.8)_48%,rgba(255,255,255,.8)_52%,transparent_53%),linear-gradient(112deg,transparent_47%,rgba(255,255,255,.7)_48%,rgba(255,255,255,.7)_52%,transparent_53%)] [background-size:180px_150px,240px_190px]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-2xl text-white shadow-xl ring-8 ring-brand-orange/20">+</span>
          <span className="rounded-lg bg-white/90 px-3 py-1.5 text-center text-xs font-bold text-zinc-900 shadow-lg dark:bg-zinc-950/90 dark:text-white">{BIZ.name}<br /><span className="font-normal">{BIZ.address}</span></span>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-950/90">
        <div className="min-w-0">
          <p className="whitespace-normal break-words text-sm font-bold text-zinc-900 dark:text-zinc-100">{BIZ.address}</p>
          <p className="abh-muted mt-0.5">Walk-in or by appointment</p>
        </div>

      <a
        href={BIZ.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-transform active:scale-95 hover:-translate-y-0.5"
        style={{ backgroundColor: BRAND.blue, color: TOKEN.onBrandBlue }}
      >
        Open in Google Maps
        <ArrowSquareOut size={14} weight="bold" />
      </a>
      </div>
    </div>
  )
} 
