// lib/seo.ts
// ─────────────────────────────────────────────────────────────────────────
// One source of truth for per-page title, description, canonical URL and
// social previews. Without this, pages that only set title/description
// inherit the homepage's Open Graph copy and every share looks identical.
// ─────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next"
import { BIZ } from "@/lib/brand"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://apexbytes.vercel.app"

interface PageMetadataOptions {
  /** Page name without the brand suffix, e.g. "About Us". */
  title: string
  description: string
  /** Route path beginning with "/", e.g. "/about". */
  path: string
  /** Optional dedicated social image; defaults to the site OG generator. */
  image?: string
}

export function pageMetadata({ title, description, path, image = "/api/og" }: PageMetadataOptions): Metadata {
  const fullTitle = `${title} — ${BIZ.name}`
  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      url,
      siteName: BIZ.name,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  }
}
