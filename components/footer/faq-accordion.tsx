"use client"

import { useState } from "react"
import { CaretDown } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { FAQS } from "@/lib/brand"

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full px-4 py-2 md:px-8">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-8">
          <h2 className="abh-section-heading mb-3 text-center">Frequently Asked Questions</h2>
          <div className="abh-divider" />
        </div>
        <div className="divide-y divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800">
          {FAQS.map((faq, index) => {
            const itemOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  aria-expanded={itemOpen}
                  aria-controls={`footer-faq-${index}`}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
                >
                  <h4 className="abh-card-heading text-[1.2rem] leading-snug text-zinc-800 dark:text-zinc-100">
                    {faq.question}
                  </h4>
                  <CaretDown
                    weight="bold"
                    aria-hidden="true"
                    className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300", itemOpen && "rotate-180")}
                  />
                </button>
                <div
                  id={`footer-faq-${index}`}
                  role="region"
                  aria-label={faq.question}
                  aria-hidden={!itemOpen}
                  className={cn("grid transition-none sm:transition-[grid-template-rows,opacity] sm:duration-200 sm:ease-out motion-reduce:transition-none", itemOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 text-[1.1rem] leading-relaxed text-muted-foreground whitespace-pre-wrap">{faq.answer}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
