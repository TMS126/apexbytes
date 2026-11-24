"use client"

import { useState } from "react"
import { Minus, Plus } from "@phosphor-icons/react"
import { FAQS } from "@/lib/brand"

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="w-full px-4 py-2 md:px-8">
      <div className="mx-auto max-w-[980px]">
        <div className="mb-8">
          <h2 className="abh-section-heading mb-3 text-left">Frequently Asked Questions</h2>
          <div className="abh-divider !mx-0" />
        </div>
        <div className="mx-2 divide-y divide-zinc-100 border-y border-zinc-100 dark:divide-zinc-800 dark:border-zinc-800 md:mx-6">
          {FAQS.map((faq, index) => {
            const itemOpen = openIndex === index
            return (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                  aria-expanded={itemOpen}
                  aria-controls={`footer-faq-${index}`}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors"
                >
                  <h4 className="abh-card-heading flex items-start gap-3 text-[1.15rem] leading-snug text-zinc-800 dark:text-zinc-100">
                    <span className="shrink-0 text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                    <span>{faq.question}</span>
                  </h4>
                  {itemOpen ? <Minus size={18} weight="bold" aria-hidden="true" /> : <Plus size={18} weight="bold" aria-hidden="true" />}
                </button>
                <div
                  id={`footer-faq-${index}`}
                  role="region"
                  aria-label={faq.question}
                  aria-hidden={!itemOpen}
                  inert={!itemOpen}
                className={itemOpen ? "block" : "hidden"}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mx-1 mb-4 rounded-[14px] bg-muted/50 px-4 py-3 text-base leading-relaxed text-foreground/80 whitespace-pre-wrap md:mx-8">{faq.answer}</div>
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
