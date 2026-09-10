// components/how-it-works.tsx
// Landing-page "How It Works" section.
//
// ACCENT PASS: icon tiles are now neutral (no hub/brand color at all —
// this section has no hub identity to hover-reveal). The step-number
// badge is the one minimal seal-orange accent, replacing the previous
// always-on BRAND.blue treatment on both the icon tile and the number.
"use client"
import { ChatCircleText, ClipboardText, Package } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { ScrollBounce } from "@/components/scroll-bounce"

const STEPS = [
  {
    icon: ClipboardText,
    title: "Tell Us What You Need",
    desc: "Pick a service from any hub, or just message us if you're not sure — we'll point you the right way.",
  },
  {
    icon: ChatCircleText,
    title: "Send Details on WhatsApp",
    desc: "Share your files, documents, or brief directly in chat. No accounts, no uploads to a separate site.",
  },
  {
    icon: Package,
    title: "Collect or Receive It",
    desc: "Pick up in-store, or get it sent straight to you — printed, designed, submitted, or fixed.",
  },
]

export function HowItWorks() {
  return (
    <section className="px-4 md:px-8 py-14 md:py-20" aria-labelledby="how-it-works-title">
      <div className="max-w-[1040px] mx-auto">
        <ScrollBounce>
          <div className="text-center mb-10 md:mb-12">
            <h2 id="how-it-works-title" className="abh-section-heading text-center mt-0">
              How It Works
            </h2>
            <p className="abh-tagline max-w-md mx-auto mt-3">
              No forms, no waiting rooms — just WhatsApp and a plan.
            </p>
          </div>
        </ScrollBounce>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon
            return (
              <ScrollBounce key={step.title} delay={index * 0.1}>
                <div className="abh-card h-full p-6 md:p-7 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 rounded-[14px] flex items-center justify-center bg-secondary text-muted-foreground">
                      <StepIcon size={28} weight="regular" aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[0.72rem] font-black border-2 border-background"
                      style={{ backgroundColor: `${TOKEN.orangeText}18`, color: TOKEN.orangeText }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                  </div>

                  <h3 className="font-heading font-medium text-lg text-card-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="abh-body text-[0.92rem]">{step.desc}</p>
                </div>
              </ScrollBounce>
            )
          })}
        </div>
      </div>
    </section>
  )
} 
