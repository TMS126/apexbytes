// components/how-it-works.tsx
// Landing-page "How It Works" section (Section 4 of the restructure
// plan). Copy is grounded in your real flow — WhatsApp-based intake, no
// upload portal, no "deploy" step — rather than the plan's generic
// web-dev-agency phrasing, which doesn't match anything you actually
// offer.
//
// CONTRAST: step numbers and icons use BRAND.blue as TEXT/icon color on
// a soft self-tint background (${accent}15), the same audited pattern
// used in CoreHubGrid — never a solid accent fill with fixed white
// text, which is what broke in dark mode last time. All copy uses real
// semantic tokens (text-card-foreground, text-muted-foreground,
// abh-body, abh-tagline) rather than hardcoded Tailwind zinc-* classes.
"use client"
import { ChatCircleText, ClipboardText, Package, Check } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"
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
                    <div
                      className="w-14 h-14 rounded-[14px] flex items-center justify-center"
                      style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}
                    >
                      <StepIcon size={28} weight="fill" aria-hidden="true" />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[0.72rem] font-black border-2 border-background"
                      style={{ backgroundColor: `${BRAND.blue}15`, color: BRAND.blue }}
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
