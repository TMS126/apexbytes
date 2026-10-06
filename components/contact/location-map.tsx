// components/contact/location-map.tsx
"use client"

import { ArrowSquareOut } from "@phosphor-icons/react"
import { BRAND, TOKEN, BIZ } from "@/lib/brand"

export function LocationMap() {
  return (
    <div className="relative w-full h-[320px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <iframe
        title={`Map showing ${BIZ.address}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(BIZ.address)}&t=m&z=15&output=embed`}
        className="absolute inset-0 h-full w-full border-0 grayscale-[15%] dark:invert-[.9] dark:hue-rotate-180"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-xl border border-white/40 bg-white/90 px-4 py-3 shadow-lg backdrop-blur dark:border-zinc-700/60 dark:bg-zinc-950/90">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">{BIZ.address}</p>
          <p className="abh-muted mt-0.5">Walk-in or by appointment</p>
        </div>

      <a
        href={BIZ.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[1.05rem] font-medium transition-transform active:scale-95 hover:-translate-y-0.5"
        style={{ backgroundColor: BRAND.blue, color: TOKEN.onBrandBlue }}
      >
        Open in Google Maps
        <ArrowSquareOut size={14} weight="bold" />
      </a>
      </div>
    </div>
  )
} 
