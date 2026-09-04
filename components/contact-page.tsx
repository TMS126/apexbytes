// components/contact-page.tsx
"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { DownloadSimple, AddressBook, Clock, Sparkle, WhatsappLogo, Phone, EnvelopeSimple, Copy, Check } from "@phosphor-icons/react"
import { BRAND, TOKEN, BIZ, CONTACT_LINKS, HOURS } from "@/lib/brand"
import { cn } from "@/lib/utils"
import { BusinessStatusFull } from "@/components/business-status"
import { ScrollBounce } from "@/components/scroll-bounce"
import { FORM_HUB_KEYS, getFormHubColor, CONTACT_GREY, downloadBusinessVCard } from "@/lib/contact-data"
import { LocationMap } from "@/components/contact/location-map"
import { FAQAccordion } from "@/components/contact/faq-accordion"
import { HubSelect } from "@/components/contact/hub-select"
import { FieldErrorTooltip } from "@/components/contact/field-error-tooltip"
import { withStatusPrefix } from "@/lib/sa-time"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

const CONTACT_ICONS: Record<string, React.ElementType> = {
  "WhatsApp Us": WhatsappLogo,
  "Call Us": Phone,
  "Email Us": EnvelopeSimple,
}

const COPYABLE_TITLES = new Set(["Call Us", "Email Us"])
const GRID_CONTACT_LINKS = CONTACT_LINKS.filter((c) => c.title !== "Visit Us")
const SCROLL_MARGIN = { scrollMarginTop: "calc(var(--nav-h, 74px) + 1rem)" }

const QUICK_LINKS = [
  { id: "contact-hours", label: "Hours" },
  { id: "contact-map", label: "Map" },
  { id: "contact-form", label: "Form" },
  { id: "contact-faq", label: "FAQ" },
]

function ContactPageInner() {
  const searchParams = useSearchParams()
  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")
  const isDark = mounted && resolvedTheme === "dark"
  const greyColor = isDark ? CONTACT_GREY.dark : CONTACT_GREY.light

  const [formData, setFormData] = useState({ name: "", phone: "", service: "", message: "" })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [vcardDone, setVcardDone] = useState(false)
  const [prefilled, setPrefilled] = useState(false)
  const [glowActive, setGlowActive] = useState(false)
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const showBackToTop = useBackToTop()

  useEffect(() => {
    const serviceParam = searchParams.get("service")
    const messageParam = searchParams.get("message")
    if (!serviceParam && !messageParam) return

    const frame = requestAnimationFrame(() => {
      setFormData((prev) => ({
        ...prev,
        service: serviceParam && serviceParam in FORM_HUB_KEYS ? serviceParam : prev.service,
        message: messageParam ?? prev.message,
      }))
      setPrefilled(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [searchParams])

  useEffect(() => {
    if (!prefilled || !mounted) return
    const id = requestAnimationFrame(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      setGlowActive(true)
    })
    const stopTimer = setTimeout(() => setGlowActive(false), 2600)
    return () => {
      cancelAnimationFrame(id)
      clearTimeout(stopTimer)
    }
  }, [prefilled, mounted])

  const glowColor = formData.service ? getFormHubColor(formData.service, isDark) : BRAND.blue

  const isNameValid = (val: string) => val.trim().length >= 2
  const isPhoneValid = (val: string) => /^[0-9+\s-]{10,15}$/.test(val.trim())
  const isMessageValid = (val: string) => val.trim().length >= 5
  const isFormValid = isNameValid(formData.name) && isPhoneValid(formData.phone) && isMessageValid(formData.message) && formData.service

  const handleSubmit = () => {
    if (!isFormValid) return
    const serviceLine = formData.service.startsWith("Not Sure")
      ? "I'm not sure which service I need yet — could you help me figure it out?"
      : `I'm interested in your ${formData.service}.`
    const rawMsg = `Hi ${BIZ.name}! My name is ${formData.name.trim()}. ${serviceLine} \n\nMessage: ${formData.message.trim()}`
    const msg = withStatusPrefix(rawMsg)
    window.open(`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  const handleVCard = () => {
    downloadBusinessVCard()
    setVcardDone(true)
    setTimeout(() => setVcardDone(false), 3000)
  }

  const handleCopy = async (title: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedTitle(title)
      setTimeout(() => setCopiedTitle(null), 1800)
    } catch {
      // Clipboard API can be denied (permissions/insecure context) — the
      // "copied" state just won't show; nothing else to do here.
    }
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <section className="px-4 md:px-8 pt-[calc(var(--nav-h)+2rem)] pb-6">
        <div className="max-w-[980px] mx-auto">
          <ScrollBounce>
            <h1 className="abh-page-title mb-3">Contact Us</h1>
          </ScrollBounce>
          <p className="abh-tagline max-w-xl mx-auto text-center">We&apos;re here and ready to help — reach out any way you prefer.</p>
          <div className="abh-divider" />
        </div>
      </section>

      <ScrollBounce delay={0.04}>
        <div className="px-4 md:px-8 pb-8">
          <div className="max-w-[980px] mx-auto flex items-center justify-center gap-2 flex-wrap">
            {QUICK_LINKS.map((q) => (
              <button
                key={q.id}
                onClick={() => scrollToSection(q.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium text-muted-foreground dark:text-muted-foreground border border-zinc-200 dark:border-zinc-800 hover:border-brand-blue hover:text-brand-blue dark:hover:text-brand-light-blue dark:hover:border-brand-light-blue transition-colors duration-150 active:scale-95"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </ScrollBounce>

      <section className="px-4 md:px-8 pb-16">
        <div className="max-w-[980px] mx-auto grid md:grid-cols-2 gap-10 items-stretch">
          <div className="flex flex-col gap-6">

            {/* Card minimization: kept — one of the page's three
                structural panels forming the layout, not a lone singleton. */}
            <ScrollBounce>
              <div className="abh-card p-6">
                <div className="text-center mb-5">
                  <h2 className="abh-section-heading mb-1">Get In Touch</h2>
                  <p className="abh-body">WhatsApp, call, email or visit us in {BIZ.location}.</p>
                </div>

                <div className="grid grid-cols-3 gap-3 items-stretch">
                  {GRID_CONTACT_LINKS.map((c, index) => {
                    const Icon = CONTACT_ICONS[c.title] ?? Phone
                    const isCopyable = COPYABLE_TITLES.has(c.title)
                    const justCopied = copiedTitle === c.title
                    return (
                      <ScrollBounce key={c.title} delay={index * 0.08}>
                        <div className="relative h-full">
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={c.title}
                            className="group flex flex-col items-center justify-center text-center gap-2 p-4 h-full min-h-[104px] rounded-[14px] border border-transparent text-muted-foreground transition-all duration-200 hover:border-foreground/30 hover:text-foreground active:scale-[0.97]"
                          >
                            <Icon size={34} weight="regular" aria-hidden="true" className="text-current transition-colors duration-200" />
                            <span className="sr-only">{c.value}</span>
                          </a>
                          {isCopyable && (
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCopy(c.title, c.value) }}
                              aria-label={justCopied ? `${c.title} copied` : `Copy ${c.title.toLowerCase()}`}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-muted-foreground hover:text-zinc-700 dark:hover:text-zinc-200 transition-all active:scale-90"
                            >
                              {justCopied ? <Check size={12} weight="bold" style={{ color: BRAND.green }} /> : <Copy size={12} weight="bold" />}
                            </button>
                          )}
                        </div>
                      </ScrollBounce>
                    )
                  })}
                </div>

                <p className="abh-muted flex items-center justify-center gap-1.5 mt-3">
                  <Clock size={13} weight="bold" aria-hidden="true" />
                  We usually reply within 15–30 minutes during business hours
                </p>

                <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <AddressBook size={20} weight="regular" aria-hidden="true" style={{ color: greyColor }} />
                    <div className="min-w-0">
                      <p className="text-base font-normal text-zinc-800 dark:text-zinc-200">Save Our Contact</p>
                      <p className="abh-muted truncate">Add {BIZ.name} to your phone</p>
                    </div>
                  </div>
                  <button onClick={handleVCard} aria-label={vcardDone ? "Contact saved" : "Download contact card"} className="abh-btn-primary shrink-0 px-4 py-2.5 font-medium">
                    <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                    {vcardDone ? "Saved!" : "Download"}
                  </button>
                </div>
              </div>
            </ScrollBounce>

            <ScrollBounce delay={0.1}>
              <div className="abh-card overflow-hidden flex-1" id="contact-map" style={SCROLL_MARGIN}>
                <LocationMap />
                <div className="p-6" id="contact-hours" style={SCROLL_MARGIN}>
                  <span className="abh-eyebrow flex items-center gap-1.5 mb-3" style={{ color: greyColor }}>
                    <Clock weight="regular" size={14} aria-hidden="true" /> Business Hours
                  </span>
                  <div className="space-y-3">
                    <div>
                      <p className="abh-eyebrow text-muted-foreground mb-1">{HOURS.printAndDoc.label}</p>
                      <p className="text-base font-normal text-zinc-700 dark:text-zinc-300">{HOURS.printAndDoc.hours}</p>
                      <p className="flex items-center gap-1.5 text-sm font-normal mt-1" style={{ color: BRAND.blue }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: BRAND.blue }} aria-hidden="true" />
                        Open on public holidays
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="abh-eyebrow text-muted-foreground mb-1">{HOURS.techDesignEservice.label}</p>
                      {HOURS.techDesignEservice.lines.map((l) => (
                        <p key={l} className="text-base font-normal text-zinc-700 dark:text-zinc-300">{l}</p>
                      ))}
                      <p className="flex items-center gap-1.5 text-sm font-normal mt-1 text-muted-foreground dark:text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-zinc-400 dark:bg-zinc-500" aria-hidden="true" />
                        Sunday &amp; Public Holidays · Closed
                      </p>
                    </div>
                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                      <p className="abh-eyebrow text-muted-foreground mb-2">Current Status</p>
                      <BusinessStatusFull />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollBounce>
          </div>

          <ScrollBounce delay={0.2}>
            <div id="contact-form" ref={formCardRef} className="abh-card p-8 flex flex-col h-full rounded-[14px]" style={SCROLL_MARGIN}>
              <h2 className="abh-section-heading mb-2">Send a Message</h2>
              {prefilled && (
                <p className="flex items-center gap-1.5 text-[0.84rem] font-medium mb-4" style={{ color: greyColor }}>
                  <Sparkle size={14} weight="regular" aria-hidden="true" />
                  Prefilled from the gallery — feel free to edit before sending
                </p>
              )}
              <div className={cn("flex flex-col gap-4 flex-1", !prefilled && "mt-4")}>
                {[
                  { label: "Your Name", type: "text", key: "name", validate: isNameValid, error: "Name too short" },
                  { label: "Phone Number", type: "tel", key: "phone", validate: isPhoneValid, error: "Invalid phone number" },
                ].map((f) => {
                  const rawValue = formData[f.key as keyof typeof formData]
                  const err = touched[f.key] && !f.validate(rawValue)
                  const errMessage = !rawValue.trim() ? "This field is required." : f.error
                  return (
                    <div key={f.key}>
                      <label htmlFor={`contact-${f.key}`} className="abh-label block mb-1.5">{f.label}</label>
                      <input
                        id={`contact-${f.key}`}
                        type={f.type}
                        value={rawValue}
                        aria-invalid={err}
                        maxLength={f.key === "name" ? 80 : 20}
                        className="w-full px-4 py-3 border rounded-[14px] bg-zinc-50 dark:bg-zinc-800/60 text-base font-normal text-zinc-800 dark:text-zinc-200 transition-all outline-none"
                        style={{ borderColor: err ? TOKEN.errorBg : undefined }}
                        onBlur={() => setTouched({ ...touched, [f.key]: true })}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                      />
                      {err && <FieldErrorTooltip message={errMessage} />}
                    </div>
                  )
                })}

                <div>
                  <label className="abh-label block mb-1.5">Service Needed</label>
                  <HubSelect value={formData.service} onChange={(val) => setFormData({ ...formData, service: val })} />
                </div>

                <div className="flex-1 flex flex-col">
                  <label htmlFor="contact-message" className="abh-label block mb-1.5">Your Message</label>
                  <div className={cn("flex-1 flex flex-col rounded-[14px]", glowActive && "abh-inquire-glow-active")} style={{ ["--glow-color" as unknown as keyof import("react").CSSProperties]: glowColor }}>
                    <textarea
                      id="contact-message"
                      aria-invalid={touched.message && !isMessageValid(formData.message)}
                      maxLength={1000}
                      className="w-full flex-1 px-4 py-3 border rounded-[14px] bg-zinc-50 dark:bg-zinc-800/60 text-base font-normal text-zinc-800 dark:text-zinc-200 transition-all outline-none resize-none"
                      style={{ borderColor: touched.message && !isMessageValid(formData.message) ? TOKEN.errorBg : undefined }}
                      rows={4}
                      value={formData.message}
                      onBlur={() => setTouched({ ...touched, message: true })}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  {touched.message && !isMessageValid(formData.message) && (
                    <FieldErrorTooltip message={!formData.message.trim() ? "This field is required." : "Message too short"} />
                  )}
                </div>

                <button onClick={handleSubmit} disabled={!isFormValid} className="abh-wa-btn mt-auto w-full py-4 disabled:opacity-50 shadow-lg">
                  <WhatsappLogo size={18} weight="fill" aria-hidden="true" />
                  Send via WhatsApp
                </button>
              </div>
            </div>
          </ScrollBounce>
        </div>
      </section>

      <div id="contact-faq" style={SCROLL_MARGIN}>
        <FAQAccordion />
      </div>

      <div className="md:hidden fixed bottom-0 inset-x-0 z-[9985] px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent">
        <a href={`https://wa.me/${BIZ.phoneE164.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="abh-wa-btn w-full py-3.5 shadow-lg">
          <WhatsappLogo size={20} weight="fill" aria-hidden="true" />
          Chat on WhatsApp
        </a>
      </div>

      <BackToTopButton visible={showBackToTop} bottomClass="bottom-24 md:bottom-6" />
    </div>
  )
}

function ContactSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <section className="px-4 md:px-8 pt-[calc(var(--nav-h)+2rem)] pb-8">
        <div className="max-w-[980px] mx-auto">
          <h1 className="abh-page-title mb-3">Contact Us</h1>
          <div className="abh-divider" />
        </div>
      </section>
    </div>
  )
}

export function ContactPage() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactPageInner />
    </Suspense>
  )
													  } 
