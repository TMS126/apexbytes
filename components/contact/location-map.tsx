// components/contact/location-map.tsx
"use client"

import { ArrowSquareOut, GoogleLogo } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"

export function LocationMap() {
  return (
    <div className="relative w-full min-h-[360px] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <div className="absolute inset-0 bg-[#dfe9e2] dark:bg-[#16231f]" role="img" aria-label={`Map area for ${BIZ.address}`}>
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(28deg,transparent_47%,rgba(255,255,255,.8)_48%,rgba(255,255,255,.8)_52%,transparent_53%),linear-gradient(112deg,transparent_47%,rgba(255,255,255,.7)_48%,rgba(255,255,255,.7)_52%,transparent_53%)] [background-size:180px_150px,240px_190px]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-orange text-2xl text-white shadow-xl ring-8 ring-brand-orange/20">+</span>
        </div>
      </div>
      <a
        href={BIZ.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="abh-google-action absolute bottom-4 right-4 flex items-center gap-1.5 rounded-[14px] px-3 py-2 text-xs font-bold transition-all active:scale-95"
      >
        <GoogleLogo size={15} weight="bold" aria-hidden="true" />
        Open in Google Maps
        <ArrowSquareOut size={14} weight="bold" />
      </a>
    </div>
  )
} 
