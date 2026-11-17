// components/contact/faq-accordion.tsx
"use client"

import { useState } from "react"
import { Minus, Plus } from "@phosphor-icons/react"
import { FAQS } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"
// Card minimization: each FAQ was its own bordered/tinted box. The
// expand/collapse interaction already signals "this is interactive" — a
// per-item card added nothing. Now one divided list.
export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="px-4 md:px-8 py-16 md:py-20">
      <div className="max-w-[980px] mx-auto">
        <ScrollBounce>
            <div className="mb-8">
            <h2 className="abh-section-heading mb-3 text-center">Frequently Asked Questions</h2>
            <p className="abh-body text-center max-w-xl mx-auto">
              Everything you need to know about orders, processing, and timelines.
            </p>
            <div className="abh-divider" />
            </div>
          </ScrollBounce>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 border-t border-b border-zinc-100 dark:border-zinc-800">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div key={index}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={`contact-faq-${index}`}
                    className="group w-full py-5 text-left flex items-center justify-between gap-4 transition-colors"
                  >
                    <h4 className="abh-card-heading flex items-start gap-3 text-[1.2rem] text-zinc-800 dark:text-zinc-100 leading-snug">
                      <span className="shrink-0 text-[0.72rem] font-medium tracking-[0.18em] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <span>{faq.question}</span>
                    </h4>
                    {isOpen ? <Minus size={18} weight="regular" aria-hidden="true" /> : <Plus size={18} weight="regular" aria-hidden="true" />}
                  </button>
                  <div
                    id={`contact-faq-${index}`}
                    role="region"
                    aria-label={faq.question}
                    aria-hidden={!isOpen}
                    inert={!isOpen}
                    className={isOpen ? "block" : "hidden"}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="pb-5 text-[1.1rem] text-muted-foreground dark:text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {faq.answer}
                      </div>
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
