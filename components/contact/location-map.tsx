// components/contact/location-map.tsx
"use client"

import "leaflet/dist/leaflet.css"

import { MapPinLine, NavigationArrow } from "@phosphor-icons/react"
import { useState } from "react"
import { useMap } from "react-leaflet"
import { LayersControl, MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet"
import L from "leaflet"
import { BIZ } from "@/lib/brand"

const center: [number, number] = [BIZ.lat, BIZ.lng]

const markerIcon = L.divIcon({
  className: "apexbytes-map-marker",
  html: '<span aria-hidden="true"><i></i></span>',
  iconSize: [36, 44],
  iconAnchor: [18, 40],
})

function RecenterButton() {
  const map = useMap()

  return (
    <button
      type="button"
      onClick={() => map.flyTo(center, 15, { duration: 0.65 })}
      className="absolute bottom-4 right-4 z-[1000] flex items-center gap-2 rounded-full bg-card/88 px-3.5 py-2.5 text-xs font-bold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95"
      aria-label="Reset map to ApexbytesHub"
    >
      <NavigationArrow size={15} weight="bold" aria-hidden="true" />
      ApexbytesHub
    </button>
  )
}

function DirectionsButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const openDirections = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not available in this browser.")
      return
    }
    setLoading(true)
    setMessage("")
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const origin = `${coords.latitude},${coords.longitude}`
        const destination = `${BIZ.lat},${BIZ.lng}`
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`, "_blank", "noopener,noreferrer")
        setLoading(false)
      },
      () => {
        setLoading(false)
        setMessage("Allow location access to calculate your route.")
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  return (
    <div className="absolute bottom-4 left-12 z-[1000] flex max-w-[calc(100%-7rem)] flex-col items-start gap-1">
      <button
        type="button"
        onClick={openDirections}
        disabled={loading}
        className="flex items-center gap-2 rounded-full bg-card/90 px-3.5 py-2.5 text-xs font-bold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-60"
      >
        <MapPinLine size={15} weight="regular" aria-hidden="true" />
        {loading ? "Finding you…" : "Get directions"}
      </button>
      {message && <p role="status" className="rounded-lg bg-card/95 px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground shadow-md">{message}</p>}
    </div>
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
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Imagery &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <ZoomControl position="bottomleft" />
        <Marker position={center} icon={markerIcon} alt={`ApexbytesHub at ${BIZ.address}`} />
        <DirectionsButton />
        <RecenterButton />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden="true" />
    </div>
  )
}
