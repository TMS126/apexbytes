// components/contact/location-map.tsx
"use client"

import { ArrowSquareOut, GoogleLogo } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"

export function LocationMap() {
  const mapUrl = `https://www.google.com/maps?q=${BIZ.lat},${BIZ.lng}&z=15&output=embed`

  return (
    <div className="relative min-h-[360px] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <iframe
        title={`Real map showing ${BIZ.address}`}
        src={mapUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 left-2 rounded-full bg-white/85 px-2 py-1 text-[10px] text-zinc-700 shadow-sm backdrop-blur-sm dark:bg-zinc-900/85 dark:text-zinc-200">
        {BIZ.location}
      </span>
      <a
        href={BIZ.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="abh-google-action absolute bottom-4 right-4 flex items-center gap-1.5 rounded-[14px] px-3 py-2 text-xs font-medium transition-all active:scale-95"
      >
        <GoogleLogo size={15} weight="bold" aria-hidden="true" />
        Open in Google Maps
        <ArrowSquareOut size={14} weight="bold" />
      </a>
    </div>
  )
} 
