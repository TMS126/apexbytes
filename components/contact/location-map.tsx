// components/contact/location-map.tsx
"use client"

import "leaflet/dist/leaflet.css"

import { MapPinLine, Target } from "@phosphor-icons/react"
import { LayersControl, MapContainer, Marker, TileLayer, ZoomControl, useMap } from "react-leaflet"
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
      className="abh-map-action inline-flex h-12 min-w-0 w-full items-center justify-center gap-2 rounded-full bg-card/95 px-3 text-sm font-semibold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95"
      aria-label="Show ApexbytesHub on the map"
    >
      <Target size={16} weight="bold" aria-hidden="true" />
      <span className="truncate">ApexbytesHub</span>
    </button>
  )
}

function DirectionsButton() {
  const [message, setMessage] = useState("")

  const openDirections = () => {
    const params = new URLSearchParams({
      api: "1",
      destination: `${BIZ.lat},${BIZ.lng}`,
      travelmode: "driving",
    })
    const directionsUrl = `https://www.google.com/maps/dir/?${params.toString()}`
    const opened = window.open(directionsUrl, "_blank", "noopener,noreferrer")
    if (!opened) window.location.assign(directionsUrl)
    setMessage(`Opening directions to ${BIZ.name} in Google Maps…`)
  }

  return (
    <div className="absolute inset-x-4 bottom-4 z-[1000]">
      <div className="mb-2 flex justify-end">
        {message && <p role="status" className="max-w-[min(100%,28rem)] rounded-xl bg-card/95 px-3 py-2 text-right text-xs font-medium leading-relaxed text-muted-foreground shadow-md backdrop-blur-xl">{message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={openDirections}
          className="abh-map-action inline-flex h-12 min-w-0 w-full items-center justify-center gap-2 rounded-full bg-card/95 px-3 text-sm font-semibold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95"
          aria-label={`Open driving directions to ${BIZ.name} in Google Maps`}
        >
          <MapPinLine size={16} weight="bold" aria-hidden="true" />
          <span className="truncate">Get directions</span>
        </button>
        <RecenterButton />
      </div>
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
        aria-label={`Interactive map showing ${BIZ.name} at ${BIZ.address}`}
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
        <Marker position={center} icon={markerIcon} alt={`${BIZ.name} at ${BIZ.address}`} />
        <DirectionsButton />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden="true" />
    </div>
  )
}
