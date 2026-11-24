"use client"

import { FAQAccordionList } from "@/components/faq-accordion-list"

export function FaqAccordion() {
  return (
    <section className="w-full px-4 py-2 md:px-8">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-8">
          <h2 className="abh-section-heading mb-3 text-left">Frequently Asked Questions</h2>
          <div className="abh-divider !mx-0" />
        </div>
        <FAQAccordionList idPrefix="footer-faq" />
      </div>
    </section>
  )
}
