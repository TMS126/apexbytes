// app/about/page.tsx
import { AboutPage } from "@/components/about-page"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "About Us — ApexbytesHub",
  description: "A local business built on community, trust, and real results.",
}

export default function AboutRoute() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div>
        <AboutPage />
      </div>
      <Footer />
    </div>
  )
} 
