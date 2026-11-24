import type { Metadata } from "next"
import { QuoteCalculatorWidget } from "@/components/quote-calculator"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PageNoticeBell } from "@/components/page-notice-bell"
import { PageScrollControls } from "@/components/page-scroll-controls"
import { BIZ } from "@/lib/brand"
import { ToolBackLink } from "@/components/tools/tool-back-link"
import { ToolHelpAccordion } from "@/components/tools/tool-help-accordion"

export const metadata: Metadata = {
  title: `Quote Calculator — ${BIZ.name}`,
  description: `Build a clear service estimate with ${BIZ.name}, then review and send it on WhatsApp.`,
}

const QUOTE_HELP = [
  { question: "How do I build a quote?", answer: "Choose a hub, open a service group, and use the plus button to add the services you need. You can adjust quantities or remove items before reviewing the estimate." },
  { question: "Are the prices final?", answer: "The calculator provides a clear estimate based on the current service list. ApexBytesHub can confirm the final price after checking your files, quantities, and requirements." },
  { question: "Can I change an item after adding it?", answer: "Yes. Use the plus and minus controls, edit the quantity where available, or remove the item and choose another service." },
  { question: "How do I send my quote request?", answer: "Review the total, then use View, PDF, or Send to share your quote request. Sending opens WhatsApp with the selected services and quantities ready for review." },
]

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageNoticeBell page="tools" />
      <main id="main-content" className="mx-auto w-full max-w-[1520px] px-4 pb-20 pt-[calc(var(--nav-h)+2rem)] sm:px-6 lg:px-8">
        <header className="mx-auto mb-6 flex max-w-3xl flex-col items-center text-center">
          <ToolBackLink />
          <h1 className="abh-page-title mb-3">Build your quote</h1>
        </header>
        <div className="overflow-x-auto">
          <QuoteCalculatorWidget embedded />
        </div>
        <ToolHelpAccordion title="Quote calculator help" items={QUOTE_HELP} />
      </main>
      <PageScrollControls />
      <Footer />
    </div>
  )
}
