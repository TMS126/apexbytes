// app/gallery/page.tsx
import { GalleryPage } from "@/components/gallery-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"

export const metadata = {
  title: "Portfolio — ApexbytesHub",
  description: "Real clients', sample and practice projects from ApexbytesHub and real clients across all five hubs.",
}

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
