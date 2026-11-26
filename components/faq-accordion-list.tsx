"use client"

import { Minus, Plus } from "@phosphor-icons/react"
import { FAQS } from "@/lib/brand"
import { useState } from "react"

interface FAQAccordionListProps {
  idPrefix: string
  defaultOpenIndex?: number | null
}

export function FAQAccordionList({ idPrefix, defaultOpenIndex = null }: FAQAccordionListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex)

  return (
    <div className="abh-faq-list">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index
        const answerId = `${idPrefix}-${index}`

        return (
          <div key={index} className="abh-faq-item">
            <h3>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              data-no-lift
              aria-expanded={isOpen}
              aria-controls={answerId}
              className="abh-faq-trigger"
            >
              <span className="abh-faq-question">
                <span className="abh-faq-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{faq.question}</span>
              </span>
              {isOpen ? <Minus size={20} weight="bold" aria-hidden="true" /> : <Plus size={20} weight="bold" aria-hidden="true" />}
            </button>
            </h3>
            <div id={answerId} role="region" aria-label={faq.question} aria-hidden={!isOpen} inert={!isOpen} className={isOpen ? "block" : "hidden"}>
              <div className="abh-faq-answer">{faq.answer}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
