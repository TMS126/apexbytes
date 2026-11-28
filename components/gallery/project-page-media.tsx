"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { LikeButton, ShareButton } from "./like-share-buttons"
import { ZoomOverlay } from "./zoom-overlay"

const LIKES_STORAGE_KEY = "apexbytes-gallery-likes"

export function ProjectPageMedia({ id, title, images }: { id: string; title: string; images: readonly string[] }) {
  const [liked, setLiked] = useState(false)
  const [zoom, setZoom] = useState<number | null>(null)
  useEffect(() => {
    try {
      const ids: string[] = JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || "[]")
      const frame = requestAnimationFrame(() => setLiked(ids.includes(id)))
      return () => cancelAnimationFrame(frame)
    } catch { return }
  }, [id])
  const toggleLike = () => {
    try {
      const ids = new Set<string>(JSON.parse(localStorage.getItem(LIKES_STORAGE_KEY) || "[]"))
      if (ids.has(id)) ids.delete(id); else ids.add(id)
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify([...ids]))
      setLiked(ids.has(id))
    } catch { setLiked((current) => !current) }
  }
  const closeZoom = useCallback(() => setZoom(null), [])
  const url = typeof window === "undefined" ? `/gallery/${id}` : `${window.location.origin}/gallery/${id}`
  return <>
    <div className="mt-5 flex gap-2"><LikeButton liked={liked} onToggle={toggleLike} /><ShareButton url={url} title={title} /></div>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">{images.map((src, index) => <button type="button" key={src} onClick={() => setZoom(index)} aria-label={`View ${title}, image ${index + 1}`} className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-muted"><Image src={src} alt="" fill sizes="(max-width: 640px) 100vw, 50vw" className="object-contain" /></button>)}</div>
    {zoom !== null && <ZoomOverlay images={[...images]} startIndex={zoom} onClose={closeZoom} title={title} />}
  </>
}
