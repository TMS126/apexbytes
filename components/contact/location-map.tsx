// components/contact/location-map.tsx
"use client"

import { MapPin, ArrowSquareOut } from "@phosphor-icons/react"
import { BRAND, TOKEN, BIZ } from "@/lib/brand"

export function LocationMap() {
  return (
    <div className="w-full h-[260px] flex flex-col items-center justify-center gap-3 bg-zinc-50 dark:bg-zinc-900 text-center px-6">
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.blue}15` }}>
        <MapPin size={28} weight="fill" style={{ color: BRAND.blue }} aria-hidden="true" />
      </div>

      <div>
        <p className="text-[1.05rem] font-medium text-zinc-800 dark:text-zinc-100">{BIZ.address}</p>
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
  )
} 
