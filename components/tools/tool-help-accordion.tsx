"use client"

import { useState } from "react"
import { CaretDown } from "@phosphor-icons/react"

type HelpItem = {
  question: string
  answer: string
}

export function ToolHelpAccordion({ title = "Tool help", items }: { title?: string; items: HelpItem[] }) {
  const [openHelpIndex, setOpenHelpIndex] = useState<number | null>(null)

  return (
    <section className="w-full px-4 pb-16 md:px-6" aria-labelledby="tool-help-heading">
      <div className="mx-auto max-w-2xl">
        <h2 id="tool-help-heading" className="abh-section-heading mb-5 text-center">{title}</h2>
        <div className="divide-y divide-border border-y border-border">
          {items.map((item, index) => {
            const isOpen = openHelpIndex === index
            const contentId = `tool-help-${index}`

            return (
              <div key={item.question}>
                <button
                  type="button"
                  onClick={() => setOpenHelpIndex((current) => (current === index ? null : index))}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left text-base font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                  <span>{item.question}</span>
                  <CaretDown
                    size={17}
                    weight="bold"
                    aria-hidden="true"
                    className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  id={contentId}
                  role="region"
                  aria-label={item.question}
                  aria-hidden={!isOpen}
                  inert={!isOpen}
                  className={`grid min-h-0 transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="pb-4 pr-8 text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
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
