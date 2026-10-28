// components/contact/location-map.tsx
"use client"

import { ArrowSquareOut, GoogleLogo } from "@phosphor-icons/react"
import { BIZ } from "@/lib/brand"

export function LocationMap() {
  return (
    <div className="relative min-h-[360px] w-full overflow-hidden bg-background shadow-inner">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,color-mix(in_srgb,var(--brand-light-orange)_42%,transparent),transparent_34%),linear-gradient(145deg,color-mix(in_srgb,var(--brand-light-blue)_18%,var(--background)),var(--background))] dark:bg-[radial-gradient(circle_at_50%_38%,color-mix(in_srgb,var(--brand-orange)_20%,transparent),transparent_34%),linear-gradient(145deg,color-mix(in_srgb,var(--brand-blue)_16%,var(--background)),var(--background))]"
        role="img"
        aria-label={`Map area for ${BIZ.address}`}
      >
        <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(28deg,transparent_47%,color-mix(in_srgb,white_72%,transparent)_48%,color-mix(in_srgb,white_72%,transparent)_52%,transparent_53%),linear-gradient(112deg,transparent_47%,color-mix(in_srgb,white_58%,transparent)_48%,color-mix(in_srgb,white_58%,transparent)_52%,transparent_53%)] [background-size:180px_150px,240px_190px]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,white_0_1px,transparent_1.5px),radial-gradient(circle_at_80%_70%,white_0_1px,transparent_1.5px)] [background-size:14px_14px,19px_19px]" />
        <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-2xl font-light text-white shadow-[0_18px_36px_-10px_rgba(217,86,32,.7)] ring-[10px] ring-brand-orange/15">+</span>
          <span className="rounded-full bg-background/80 px-4 py-2 text-center text-xs font-semibold tracking-[0.08em] text-foreground shadow-lg backdrop-blur-xl">{BIZ.location}</span>
        </div>
      </div>
      <a
        href={BIZ.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="abh-google-action absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-background/78 px-4 py-2.5 text-xs font-bold text-foreground shadow-xl backdrop-blur-xl transition-all hover:-translate-y-0.5 active:scale-95"
      >
        <GoogleLogo size={15} weight="bold" aria-hidden="true" />
        Open in Google Maps
        <ArrowSquareOut size={14} weight="bold" />
      </a>
    </div>
  )
} 
