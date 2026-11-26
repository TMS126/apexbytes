// app/gallery/page.tsx
import { GalleryPage } from "@/components/gallery-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { redirect } from "next/navigation"
import { PROJECTS } from "@/lib/data"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Portfolio",
  description: "Real client work, samples and practice projects from ApexBytesHub across all five hubs.",
  path: "/gallery",
})

export default async function GalleryRoute({ searchParams }: { searchParams: Promise<{ project?: string | string[] }> }) {
  const { project } = await searchParams
  if (typeof project === "string" && PROJECTS.some((item) => item.id === project)) redirect(`/gallery/${project}`)
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="gallery" />
      <main id="main-content">
        <GalleryPage />
      </main>
      <Footer />
    </div>
  )
} 
