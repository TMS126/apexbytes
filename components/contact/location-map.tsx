// components/contact/location-map.tsx
"use client"

import "leaflet/dist/leaflet.css"

import { MapPinLine, Target } from "@phosphor-icons/react"
import { useEffect, useState } from "react"
import { CircleMarker, LayersControl, MapContainer, Marker, Polyline, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import { BIZ } from "@/lib/brand"

const center: [number, number] = [BIZ.lat, BIZ.lng]

type UserLocation = {
  latitude: number
  longitude: number
  accuracy: number
}

const markerIcon = L.divIcon({
  className: "apexbytes-map-marker",
  html: '<span aria-hidden="true"><i></i></span>',
  iconSize: [36, 44],
  iconAnchor: [18, 40],
})

function distanceInKm(from: [number, number], to: [number, number]) {
  const earthRadius = 6371
  const latDelta = ((to[0] - from[0]) * Math.PI) / 180
  const lngDelta = ((to[1] - from[1]) * Math.PI) / 180
  const lat1 = (from[0] * Math.PI) / 180
  const lat2 = (to[0] * Math.PI) / 180
  const haversine = Math.sin(latDelta / 2) ** 2 + Math.sin(lngDelta / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return earthRadius * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}

function formatDistance(distance: number) {
  return distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(distance < 10 ? 1 : 0)} km`
}

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

function RoutePreview({ userLocation }: { userLocation: UserLocation | null }) {
  const map = useMap()

  useEffect(() => {
    if (!userLocation) return
    map.flyToBounds(
      [
        [userLocation.latitude, userLocation.longitude],
        center,
      ],
      { padding: [72, 72], maxZoom: 15, duration: 0.75 },
    )
  }, [map, userLocation])

  if (!userLocation) return null

  return (
    <>
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={8}
        pathOptions={{ color: "#ffffff", weight: 3, fillColor: "#2563eb", fillOpacity: 1 }}
      />
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={Math.max(12, Math.min(userLocation.accuracy / 4, 40))}
        pathOptions={{ color: "#2563eb", weight: 1, fillColor: "#2563eb", fillOpacity: 0.12 }}
      />
      <Polyline
        positions={[
          [userLocation.latitude, userLocation.longitude],
          center,
        ]}
        pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.82, dashArray: "9 10", lineCap: "round" }}
      />
    </>
  )
}

function DirectionsButton({ onLocation }: { onLocation: (location: UserLocation) => void }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const findDirections = () => {
    if (!navigator.geolocation) {
      setMessage("Location is not available in this browser.")
      return
    }

    setLoading(true)
    setMessage("")
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const location = {
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        }
        onLocation(location)
        setMessage(`Your route to ApexbytesHub is shown on the map · ${formatDistance(distanceInKm([location.latitude, location.longitude], center))} away`)
        setLoading(false)
      },
      (error) => {
        setLoading(false)
        setMessage(error.code === error.PERMISSION_DENIED ? "Allow location access to find your route from here." : "We could not find your location yet. Try again.")
      },
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    )
  }

  return (
    <div className="absolute inset-x-4 bottom-4 z-[1000]">
      <div className="mb-2 flex justify-end">
        {message && <p role="status" className="max-w-[min(100%,28rem)] rounded-xl bg-card/95 px-3 py-2 text-right text-xs font-medium leading-relaxed text-muted-foreground shadow-md backdrop-blur-xl">{message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={findDirections}
          disabled={loading}
          className="abh-map-action inline-flex h-12 min-w-0 w-full items-center justify-center gap-2 rounded-full bg-card/95 px-3 text-sm font-semibold text-foreground shadow-xl backdrop-blur-xl transition-transform hover:-translate-y-0.5 active:scale-95 disabled:cursor-wait disabled:opacity-60"
        >
          <MapPinLine size={16} weight="bold" aria-hidden="true" />
          <span className="truncate">{loading ? "Finding you…" : "Get directions"}</span>
        </button>
        <RecenterButton />
      </div>
    </div>
  )
}

export function LocationMap() {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)

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
        <RoutePreview userLocation={userLocation} />
        <DirectionsButton onLocation={setUserLocation} />
      </MapContainer>
      <div className="pointer-events-none absolute inset-0 z-[500] bg-gradient-to-t from-black/15 via-transparent to-transparent" aria-hidden="true" />
    </div>
  )
}
