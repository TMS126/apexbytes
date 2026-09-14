
// app/services/[[...slug]]/page.tsx
import { redirect } from "next/navigation"
import { Suspense } from "react"
import type { Metadata } from "next"
import { ServicesPage } from "@/components/services-page"
import { CtaBar } from "@/components/strip-section"
import { Navbar } from "@/components/navbar"
import { TestimonialsSection } from "@/components/testimonials-section"
import { Footer } from "@/components/footer"
import { HUBS } from "@/lib/data"
import { BIZ } from "@/lib/brand"
import { hubSlugToId, resolveServiceRoute, serviceRouteFor, hubRouteFor } from "@/components/services-page/lib"

export const dynamic = "force-dynamic"

// Same SITE_URL fallback pattern used everywhere else in the codebase.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://apexbytes.vercel.app"

type RouteParams = Promise<{ slug?: string[] }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  params,
}: {
  params: RouteParams
}): Promise<Metadata> {
  const { slug = [] } = await params

  if (slug.length === 3) {
    const resolved = resolveServiceRoute(slug[0], slug[1], slug[2])
    if (resolved) {
      const { hubId, sectionTitle, item } = resolved
      const title = `${item.name} — ${item.price} at ${BIZ.name}`
      const description = item.description || `${item.name} from the ${HUBS[hubId].title} at ${BIZ.name}. ${item.price}.`
      const ogUrl = `/api/og/service?hub=${encodeURIComponent(hubId)}&section=${encodeURIComponent(sectionTitle)}&service=${encodeURIComponent(item.name)}`
      const pageUrl = `${SITE_URL}${serviceRouteFor(hubId, sectionTitle, item.name)}`

      return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: { title, description, url: pageUrl, images: [{ url: ogUrl, width: 1200, height: 630, alt: title }] },
        twitter: { card: "summary_large_image", title, images: [ogUrl] },
      }
    }
  }

  if (slug.length === 1) {
    const hubId = hubSlugToId(slug[0])
    if (hubId) {
      const hub = HUBS[hubId]
      const title = `${hub.title} — ApexbytesHub`
      const description = hub.desc || `Explore ${hub.title} services and pricing at ${BIZ.name}.`
      const pageUrl = `${SITE_URL}${hubRouteFor(hubId)}`
      return {
        title,
        description,
        alternates: { canonical: pageUrl },
        openGraph: { url: pageUrl },
      }
    }
  }

  return {
    title: "Services — ApexbytesHub",
    description: "Printing, documents, design, government services and tech support — all in one place.",
    alternates: { canonical: `${SITE_URL}/services` },
    openGraph: { url: `${SITE_URL}/services` },
  }
}

export default async function ServicesRoute({
  params,
  searchParams,
}: {
  params: RouteParams
  searchParams: SearchParams
}) {
  const { slug = [] } = await params

  // ── Legacy query-string compatibility ──────────────────────────────
  // Old shared/bookmarked links used /services?hub=X&section=Y&service=Z
  // (or just ?hub=X). Redirect those to the new canonical path instead
  // of breaking them. Section/service were stored as raw titles/names in
  // the old query params, not slugs — so they're matched against the
  // real data directly here, not through resolveServiceRoute (which
  // expects slugs).
  if (slug.length === 0) {
    const sp = await searchParams
    const hubParam = typeof sp.hub === "string" ? sp.hub : undefined
    const sectionParam = typeof sp.section === "string" ? sp.section : undefined
    const serviceParam = typeof sp.service === "string" ? sp.service : undefined

    if (hubParam) {
      const hubId = hubSlugToId(hubParam)
      if (hubId) {
        if (sectionParam && serviceParam) {
          const section = HUBS[hubId].sections.find((s) => s.title === sectionParam)
          const item = section?.items.find((i) => i.name === serviceParam)
          if (section && item) redirect(serviceRouteFor(hubId, section.title, item.name))
        }
        redirect(hubRouteFor(hubId))
      }
    }
  }

  // ── Validate the route shape / resolve it, or bounce safely ────────
  // Only two slug lengths are meaningful: 1 (hub) and 3 (hub/section/
  // service). Anything else — including a 3-segment slug that doesn't
  // resolve to a real service (stale or mistyped link) — redirects to
  // the plain catalog instead of rendering a broken page.
  if (slug.length === 1 && !hubSlugToId(slug[0])) {
    redirect("/services")
  }
  if (slug.length === 3 && !resolveServiceRoute(slug[0], slug[1], slug[2])) {
    redirect("/services")
  }
  if (slug.length === 2 || slug.length > 3) {
    redirect("/services")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <Suspense fallback={null}>
          <ServicesPage />
        </Suspense>
        <TestimonialsSection />
        <CtaBar
          title="Not sure what you need?"
          description="Just WhatsApp us and we'll guide you in the right direction."
          buttonText="Chat With Us"
          buttonHref="https://wa.me/27753338260"
        />
      </div>
      <Footer />
    </div>
  )
}
