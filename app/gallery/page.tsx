// app/gallery/page.tsx
import { GalleryPage } from "@/components/gallery-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "Portfolio",
  description: "Real client work, samples and practice projects from ApexBytesHub across all five hubs.",
  path: "/gallery",
})

export default function GalleryRoute() {
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
