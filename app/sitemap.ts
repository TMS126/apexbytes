// app/sitemap.ts
import { MetadataRoute } from 'next'
import { HUBS, PROJECTS } from '@/lib/data'
import { HUB_ORDER, serviceRouteFor, hubRouteFor } from '@/components/services-page/lib'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://apexbytes.vercel.app'

// This update adds the public tools and canonical service routes to the sitemap.
const LAST_CONTENT_UPDATE = new Date('2026-11-23')

type RouteConfig = {
  path: string
  priority: number
  freq: MetadataRoute.Sitemap[number]['changeFrequency']
}

export default function sitemap(): MetadataRoute.Sitemap {
  const coreRoutes: RouteConfig[] = [
    { path: '',                    priority: 1.0, freq: 'weekly' },
    { path: '/services',           priority: 0.9, freq: 'weekly' },
    { path: '/pricing',            priority: 0.8, freq: 'monthly' },
    { path: '/about',              priority: 0.8, freq: 'monthly' },
    { path: '/gallery',            priority: 0.7, freq: 'monthly' },
    { path: '/contact',            priority: 0.8, freq: 'monthly' },
    { path: '/tools',              priority: 0.7, freq: 'monthly' },
    { path: '/tools/jpg-to-pdf',   priority: 0.6, freq: 'monthly' },
    { path: '/tools/cv-writing',   priority: 0.6, freq: 'monthly' },
    { path: '/tools/intake-form',  priority: 0.6, freq: 'monthly' },
    { path: '/privacy',            priority: 0.3, freq: 'yearly' },
    { path: '/terms',              priority: 0.3, freq: 'yearly' },
  ]

  const serviceRoutes: RouteConfig[] = HUB_ORDER.flatMap((hubId) => {
    const hub = HUBS[hubId]
    const hubRoute: RouteConfig = {
      path: hubRouteFor(hubId),
      priority: 0.8,
      freq: 'weekly',
    }
    const itemRoutes = hub.sections.flatMap((section) =>
      section.items.map((item): RouteConfig => ({
        path: serviceRouteFor(hubId, section.title, item.name),
        priority: 0.6,
        freq: 'monthly',
      }))
    )
    return [hubRoute, ...itemRoutes]
  })

  const projectRoutes: RouteConfig[] = PROJECTS.map((project) => ({ path: `/gallery/${project.id}`, priority: 0.6, freq: 'monthly' }))

  return [...coreRoutes, ...serviceRoutes, ...projectRoutes].map(({ path, priority, freq }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: LAST_CONTENT_UPDATE,
    changeFrequency: freq,
    priority,
  }))
}
