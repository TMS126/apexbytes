// app/sitemap.ts
import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'

// Bump this date only when you actually change page content —
// not on every deploy. Keeps crawlers from seeing every page as
// "modified today" forever, which dilutes the signal's value.
const LAST_CONTENT_UPDATE = new Date('2026-08-23')

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: '',                     priority: 1.0, freq: 'weekly'  },
    { path: '/services',            priority: 0.9, freq: 'weekly'  },
    { path: '/pricing',              priority: 0.8, freq: 'monthly' },
    { path: '/about',               priority: 0.8, freq: 'monthly' },
    { path: '/gallery',             priority: 0.7, freq: 'monthly' },
    { path: '/contact',             priority: 0.8, freq: 'monthly' },
    { path: '/tools/jpg-to-pdf',    priority: 0.6, freq: 'monthly' },
    { path: '/privacy',             priority: 0.3, freq: 'yearly'  },
  ].map(({ path, priority, freq }) => ({
    url:             `${SITE_URL}${path}`,
    lastModified:    LAST_CONTENT_UPDATE,
    changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
    priority,
  }))

  return routes
} 
