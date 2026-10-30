// components/contact/location-map.tsx
"use client"

import "leaflet/dist/leaflet.css"

import { MapPin, NavigationArrow } from "@phosphor-icons/react"
import { useMap } from "react-leaflet"
import { MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet"
import L from "leaflet"
import { BIZ } from "@/lib/brand"

const center: [number, number] = [BIZ.lat, BIZ.lng]

const markerIcon = L.divIcon({
  className: "apexbytes-map-marker",
  html: '<span aria-hidden="true">+</span>',
  iconSize: [46, 46],
  iconAnchor: [23, 23],
})

function RecenterButton() {
  const map = useMap()

  return (
    <button
      type="button"
      onClick={() => map.flyTo(center, 15, { duration: 0.65 })}
      className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 rounded-full bg-card/88 px-3.5 py-2.5 text-xs font-bold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95"
      aria-label="Reset map to ApexbytesHub in Kgotsong, Bothaville"
    >
      <NavigationArrow size={15} weight="bold" aria-hidden="true" />
      {BIZ.location}
    </button>
  )
}

export function LocationMap() {
  return (
    <div className="relative min-h-[360px] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
      <MapContainer
        center={center}
        zoom={15}
        minZoom={4}
        scrollWheelZoom
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
        aria-label={`Interactive map showing ${BIZ.address}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomleft" />
        <Marker position={center} icon={markerIcon} alt={`ApexbytesHub at ${BIZ.address}`} />
        <RecenterButton />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex items-center gap-2 rounded-full bg-card/88 px-3 py-2 text-xs font-semibold text-foreground shadow-lg backdrop-blur-xl">
        <MapPin size={15} weight="fill" className="text-brand-orange" aria-hidden="true" />
        ApexbytesHub
      </div>
    </div>
  )
}
