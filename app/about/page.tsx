// app/about/page.tsx
import { AboutPage } from "@/components/about-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { pageMetadata } from "@/lib/seo"

export const metadata = pageMetadata({
  title: "About Us",
  description: "A local business built on community, trust, and real results.",
  path: "/about",
})

export default function AboutRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="about" />
      <div>
        <AboutPage />
      </div>
      <Footer />
    </div>
  )
} 
