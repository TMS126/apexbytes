// components/contact/faq-accordion.tsx
"use client"

import { ScrollBounce } from "@/components/scroll-bounce"
import { FAQAccordionList } from "@/components/faq-accordion-list"

export function FAQAccordion() {
  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[980px]">
        <ScrollBounce>
          <div className="mb-8">
            <h2 className="abh-section-heading mb-3 text-center">Frequently Asked Questions</h2>
            <p className="abh-body mx-auto max-w-xl text-center">
              Everything you need to know about orders, processing, and timelines.
            </p>
            <div className="abh-divider" />
          </div>
        </ScrollBounce>
        <FAQAccordionList idPrefix="contact-faq" defaultOpenIndex={0} />
      </div>
    </section>
  )
}
