import type { Metadata } from "next"
import { QuoteCalculatorWidget } from "@/components/quote-calculator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { BIZ } from "@/lib/brand"
import { ToolBackLink } from "@/components/tools/tool-back-link"

export const metadata: Metadata = {
  title: `Quote Calculator — ${BIZ.name}`,
  description: `Build a clear service estimate with ${BIZ.name}, then review and send it on WhatsApp.`,
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="tools" />
      <main id="main-content" className="mx-auto w-full max-w-[1520px] px-4 pb-20 pt-[calc(var(--nav-h)+2rem)] sm:px-6 lg:px-8">
        <header className="mx-auto mb-8 flex max-w-3xl flex-col items-center text-center">
          <ToolBackLink />
          <h1 className="abh-page-title mb-3">Build your quote</h1>
        </header>
        <QuoteCalculatorWidget embedded />
      </main>
      <PageScrollControls />
      <Footer />
    </div>
  )
}
