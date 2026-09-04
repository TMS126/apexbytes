// components/services-page/index.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Megaphone, ArrowRight, CaretRight, CaretLeft, WarningCircle } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { BRAND, TOKEN, HUB_COLORS, HubKey } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { useModalBackStack, HubIcon, ServiceIcon } from "./shared"
import { InlineSearchBar } from "./search-bar"
import { HubModal } from "./hub-modal"
import { ServiceDetailModal } from "./service-detail-modal"
import { HUB_ORDER, NOTICE, trackEvent, getTurnaround, SelectedService } from "./lib"
import { sectionHasBulk } from "../quote-calculator/lib"
import { NoticePill } from "@/components/notice-pill"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { MobileHubCard, BulkRibbon, NoticeBadge } from "./mobile-hub-card"

const PILL_NEUTRAL = {
  border: "var(--border)",
  text: "var(--muted-foreground)",
  hoverBg: "var(--muted)",
}

function ClosingTagline() {
  return (
    <div className="mt-2 mb-4 text-center px-6 py-6">
      <p className="abh-eyebrow text-muted-foreground mb-3">Why ApexbytesHub</p>
      <p className="font-sans font-black text-2xl md:text-3xl text-foreground leading-snug max-w-2xl mx-auto">
        From your first CV to your next big idea — one hub does it all, right here in Bothaville.
      </p>
      <div className="abh-divider" />
    </div>
  )
}



function Pill({
  icon, label, fill, isActive, onClick, size = "md",
}: {
  icon?: React.ReactNode
  label: string
  fill: string
  isActive: boolean
  onClick: () => void
  size?: "md" | "sm"
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-black transition-all duration-200 active:scale-95 border",
        size === "md" ? "pl-2 pr-4 py-2 text-[0.9rem]" : "pl-2 pr-3.5 py-1.5 text-[0.82rem]"
      )}
      style={
        isActive
          ? {
              backgroundColor: fill,
              borderColor: fill,
              color: "var(--on-primary-fill)",
              boxShadow: `0 0 0 4px color-mix(in srgb, ${fill} 12%, transparent)`,
            }
          : {
              backgroundColor: "transparent",
              borderColor: PILL_NEUTRAL.border,
              color: PILL_NEUTRAL.text,
            }
      }
    >
      {icon && (
        <span
          className={cn("rounded-full flex items-center justify-center shrink-0", size === "md" ? "w-6 h-6" : "w-5 h-5")}
          style={{ backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--muted)" }}
        >
          {icon}
        </span>
      )}
      {label}
    </button>
  )
}

function BackPill({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 pl-2.5 pr-3.5 py-1.5 rounded-full font-black text-[0.82rem] border transition-all duration-200 active:scale-95 hover:bg-[var(--muted)]"
      style={{ borderColor: PILL_NEUTRAL.border, color: PILL_NEUTRAL.text }}
    >
      <CaretLeft size={12} weight="bold" />
      {label}
    </button>
  )
}

function SectionCard({
  section, accent, onClick,
}: {
  section: (typeof HUBS)[HubId]["sections"][number]
  accent: string
  onClick: () => void
}) {
  const hasNotice = section.items.some((i) => !!i.notice)

  return (
    <button
      onClick={onClick}
      className="group/sectioncard text-left rounded-[14px] bg-card border border-[var(--card-border)] abh-shadow-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="font-black text-[1.02rem] text-foreground leading-tight break-words">
          {section.title}
        </h4>
        {hasNotice && (
          <WarningCircle
            size={14}
            weight="fill"
            aria-label="Notice for some services in this section"
            className="shrink-0 mt-0.5"
            style={{ color: BRAND.orange }}
          />
        )}
      </div>

      {section.desc && (
        <p className="text-[0.82rem] text-muted-foreground leading-snug mb-4">
          {section.desc}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[0.78rem] font-bold" style={{ color: accent }}>
          {section.items.length} service{section.items.length === 1 ? "" : "s"}
        </span>
        <span
          className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-hover/sectioncard:translate-x-0.5"
          style={{ backgroundColor: `color-mix(in srgb, ${accent} 8%, transparent)`, color: accent }}
        >
          <CaretRight size={12} weight="bold" />
        </span>
      </div>
    </button>
  )
}

function ServiceCard({
  item, accent, onClick,
}: {
  item: { name: string; price: string; notice?: string; description?: string }
  accent: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group/svccard text-left rounded-[14px] bg-card border border-[var(--card-border)] abh-shadow-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] p-4 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-foreground leading-snug flex items-start gap-2 min-w-0">
          <ServiceIcon name={item.name} size={19} color={accent} />
          {item.notice && (
            <WarningCircle
              size={13}
              weight="fill"
              aria-label="Notice"
              className="shrink-0 mt-0.5"
              style={{ color: BRAND.orange }}
            />
          )}
          <span className="break-words">{item.name}</span>
        </span>
      </div>

      <p className="text-[0.8rem] text-muted-foreground leading-snug mb-3 flex-1">
        {item.description || "Tap to view full pricing and details."}
      </p>

      <span
        className="inline-flex items-center gap-1 text-[0.78rem] font-black transition-colors duration-200"
        style={{ color: accent }}
      >
        View details
        <ArrowRight
          size={11}
          weight="bold"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/svccard:translate-x-0.5"
        />
      </span>
    </button>
  )
}

export function ServicesPage() {
  const { resolvedTheme } = useTheme()
  const isDark       = resolvedTheme === "dark"
  const searchParams = useSearchParams()
  const router       = useRouter()
  const consumedParamsKey = useRef<string | null>(null)

  const [activeHub,       setActiveHub]       = useState<HubId | null>(null)
  const [hubOriginSide,   setHubOriginSide]   = useState<"left" | "right">("right")
  const [selectedService, setSelectedService] = useState<SelectedService | null>(null)
  const [clientNoticeDismissed, setClientNoticeDismissed] = useState(false)
  const showBackToTop = useBackToTop()

  const [desktopActiveHub, setDesktopActiveHub] = useState<HubId | null>(null)
  const [desktopActiveSection, setDesktopActiveSection] = useState<number | null>(null)

  const isModalOpen = !!(activeHub || selectedService)

  const handleSelectService = (svc: SelectedService) => {
    trackEvent("view_service", {
      hub_id:        svc.hubId,
      service_name:  svc.name,
      section_title: svc.sectionTitle,
    })
    setSelectedService(svc)
  }

  const handleOpenHub = (hubId: HubId, originSide: "left" | "right") => {
    trackEvent("view_hub", { hub_id: hubId, hub_name: HUBS[hubId].title })
    setHubOriginSide(originSide)
    setActiveHub(hubId)
  }

  const handleDesktopSelectHub = (hubId: HubId) => {
    trackEvent("view_hub", { hub_id: hubId, hub_name: HUBS[hubId].title })
    setDesktopActiveHub(hubId)
    setDesktopActiveSection(null)
  }

  const handleDesktopSwitchHub = (hubId: HubId) => {
    if (hubId === desktopActiveHub) return
    trackEvent("view_hub", { hub_id: hubId, hub_name: HUBS[hubId].title })
    setDesktopActiveHub(hubId)
    setDesktopActiveSection(null)
  }

  const handleDesktopBackToHubs = () => {
    setDesktopActiveHub(null)
    setDesktopActiveSection(null)
  }

  const handleDesktopSelectSection = (idx: number) => {
    setDesktopActiveSection(idx)
  }

  const handleDesktopSwitchSection = (idx: number) => {
    setDesktopActiveSection(idx)
  }

  const handleDesktopBackToSections = () => {
    setDesktopActiveSection(null)
  }

  useEffect(() => {
    const handler = (e: Event) => {
      const svc = (e as CustomEvent<SelectedService>).detail
      if (svc) handleSelectService(svc)
    }
    window.addEventListener("abh:selectService", handler)
    return () => window.removeEventListener("abh:selectService", handler)
  }, [])

  useEffect(() => {
    const hubParam     = searchParams.get("hub")
    const sectionParam = searchParams.get("section")
    const serviceParam = searchParams.get("service")
    if (!hubParam || !HUB_ORDER.includes(hubParam as HubId)) return

    const paramsKey = `${hubParam}|${sectionParam ?? ""}|${serviceParam ?? ""}`
    if (consumedParamsKey.current === paramsKey) return
    consumedParamsKey.current = paramsKey

    if (sectionParam && serviceParam) {
      const section = HUBS[hubParam as HubId].sections.find((s) => s.title === sectionParam)
      const item = section?.items.find((i) => i.name === serviceParam)
      if (section && item) {
        const frame = requestAnimationFrame(() => {
          handleSelectService({
            name: item.name, price: item.price, hubId: hubParam as HubId,
            sectionTitle: section.title, requirements: item.requirements,
            desc: item.description, turnaround: getTurnaround(section.title, item.name),
            tips: item.tips ? [...item.tips] : undefined,
            notice: item.notice,
          })
        })
        router.replace("/services", { scroll: false })
        return () => cancelAnimationFrame(frame)
      }
    }

    const frame = requestAnimationFrame(() => handleOpenHub(hubParam as HubId, "right"))
    router.replace("/services", { scroll: false })
    return () => cancelAnimationFrame(frame)
  }, [searchParams, router])

  const { closeHub, closeService } = useModalBackStack(activeHub, setActiveHub, selectedService, setSelectedService)

  useEffect(() => {
    if (!isModalOpen) return
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = "fixed"
    style.top      = `-${scrollY}px`
    style.left     = "0"
    style.right    = "0"
    style.width    = "100%"
    style.overflow = "hidden"
    return () => {
      style.position = ""
      style.top      = ""
      style.left     = ""
      style.right    = ""
      style.width    = ""
      style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [isModalOpen])

  const desktopHub = desktopActiveHub ? HUBS[desktopActiveHub] : null
  const desktopHubColors = desktopActiveHub ? HUB_COLORS[desktopActiveHub as HubKey] : null
  const desktopHubAccent = desktopHubColors ? (isDark ? desktopHubColors.accentDark : desktopHubColors.accentLight) : "#000000"
  const desktopHubFill = desktopHubColors ? desktopHubColors.primary : "#000000"
  const desktopActiveSectionData =
    desktopHub && desktopActiveSection !== null ? desktopHub.sections[desktopActiveSection] : null

  return (
    <section className="min-h-screen bg-background transition-colors duration-300 pb-24 overflow-x-hidden">

      <motion.div
        layout
        transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
        className="max-w-[1248px] mx-auto px-4 md:px-8 flex flex-col items-center transition-opacity duration-200"
        style={{
          opacity: isModalOpen ? 0 : 1,
          pointerEvents: isModalOpen ? "none" : "auto",
        }}
        aria-hidden={isModalOpen}
      >

        <ScrollBounce className="w-full">
          <div className="pt-[calc(var(--nav-h,74px)+2rem)] pb-8 text-center w-full">
            <h1 className="abh-page-title mb-3">Our Service Hubs</h1>
            <p className="abh-tagline max-w-xl mx-auto">
              Explore our ecosystem. Tap a hub to view all available services and instant pricing.
            </p>
            <div className="abh-divider mx-auto" />
          </div>
        </ScrollBounce>

        {!clientNoticeDismissed && (
          <ScrollBounce delay={0.08} className="relative z-0 w-full flex justify-center mb-6">
            <NoticePill
              variant="warning"
              Icon={Megaphone}
              collapsedLabel="Notice"
              expandedLabel="Notice to Clients"
              onDismiss={() => setClientNoticeDismissed(true)}
            >
              {NOTICE.text}
              <span className="font-black" style={{ color: TOKEN.blueText }}>{NOTICE.date}</span>
              {NOTICE.textAfter}
            </NoticePill>
          </ScrollBounce>
        )}

        <ScrollBounce delay={0.14} className="relative z-40 w-full mb-12 flex justify-center">
          <div id="abh-inline-search" className="w-full flex justify-center">
            <InlineSearchBar onSelect={handleSelectService} />
          </div>
        </ScrollBounce>

        {/* MOBILE — all cards landscape, single column */}
        <div className="grid md:hidden grid-cols-1 gap-4 pb-2 w-full">
          {HUB_ORDER.map((hubId, index) => {
            const hub    = HUBS[hubId]
            const colors = HUB_COLORS[hubId as HubKey]
            const accent = isDark ? colors.accentDark : colors.accentLight
            const hubHasBulk = hub.sections.some((s) => sectionHasBulk(hubId, s.title, s.items))
            const hubHasNotice = hub.sections.some((s) => s.items.some((i) => !!i.notice))

            return (
              <ScrollBounce key={hubId} delay={index * 0.06}>
                <MobileHubCard
                  hubId={hubId}
                  hub={hub}
                  accent={accent}
                  primary={colors.primary}
                  hubHasBulk={hubHasBulk}
                  orderIndex={index}
                  hubHasNotice={hubHasNotice}
                  onClick={() => handleOpenHub(hubId, "right")}
                />
              </ScrollBounce>
            )
          })}
        </div>

        {/* ══════════════════ DESKTOP — Level 0: same minimal card style as
            mobile, "Explore" pill bottom-center instead of a preview-hints
            list + arrow. ══════════════════ */}
        {!desktopActiveHub && (
          <div className="hidden md:grid md:grid-cols-6 gap-6 pb-2 w-full">
            {HUB_ORDER.map((hubId, index) => {
              const hub    = HUBS[hubId]
              const colors = HUB_COLORS[hubId as HubKey]
              const accent = isDark ? colors.accentDark : colors.accentLight
              const hubHasBulk = hub.sections.some((s) => sectionHasBulk(hubId, s.title, s.items))
              const hubHasNotice = hub.sections.some((s) => s.items.some((i) => !!i.notice))

              return (
                <div
                  key={hubId}
                  className={cn(
                    "col-span-2",
                    index === 3 && "md:col-start-2",
                    index === 4 && "md:col-start-4"
                  )}
                >
                  <ScrollBounce delay={index * 0.06}>
                    <MobileHubCard
                      variant="desktop"
                      hubId={hubId}
                      hub={hub}
                      accent={accent}
                      primary={colors.primary}
                      hubHasBulk={hubHasBulk}
                      hubHasNotice={hubHasNotice}
                      orderIndex={index}
                      onClick={() => handleDesktopSelectHub(hubId)}
                    />
                  </ScrollBounce>
                </div>
              )
            })}
          </div>
        )}

        {/* DESKTOP — Level 1 & 2: pills + card grids */}
        {desktopActiveHub && desktopHub && (
          <div className="hidden md:flex flex-col items-center w-full animate-in fade-in duration-200">

            <div className="flex flex-wrap justify-center gap-2.5 mb-6">
              <BackPill onClick={handleDesktopBackToHubs} label="All Hubs" />
              {HUB_ORDER.map((hubId) => {
                const colors = HUB_COLORS[hubId as HubKey]
                const accent = isDark ? colors.accentDark : colors.accentLight
                const isActivePill = hubId === desktopActiveHub
                return (
                  <Pill
                    key={hubId}
                    label={HUBS[hubId].title}
                    fill={colors.primary}
                    isActive={isActivePill}
                    onClick={() => handleDesktopSwitchHub(hubId)}
                    icon={<HubIcon id={hubId} size={13} color={isActivePill ? "#ffffff" : accent} />}
                  />
                )
              })}
            </div>

            {desktopActiveSectionData && (
              <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
                <BackPill onClick={handleDesktopBackToSections} label="All Sections" />
                {desktopHub.sections.map((section, sIdx) => (
                  <Pill
                    key={sIdx}
                    label={section.title}
                    fill={desktopHubFill}
                    isActive={sIdx === desktopActiveSection}
                    onClick={() => handleDesktopSwitchSection(sIdx)}
                    size="sm"
                  />
                ))}
              </div>
            )}

            {!desktopActiveSectionData && (
              <div className="w-full max-w-3xl grid grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                {desktopHub.sections.map((section, sIdx) => (
                  <SectionCard
                    key={sIdx}
                    section={section}
                    accent={desktopHubAccent}
                    onClick={() => handleDesktopSelectSection(sIdx)}
                  />
                ))}
              </div>
            )}

            {desktopActiveSectionData && (
              <div className="w-full max-w-3xl">
                {desktopActiveSectionData.desc && (
                  <p className="text-center text-[0.9rem] text-muted-foreground mb-5 max-w-xl mx-auto">
                    {desktopActiveSectionData.desc}
                  </p>
                )}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {desktopActiveSectionData.items.map((item, iIdx) => (
                    <ServiceCard
                      key={iIdx}
  item={item}
  accent={desktopHubAccent}
  hubId={desktopActiveHub!}
  onClick={() =>
                        handleSelectService({
                          name: item.name,
                          price: item.price,
                          hubId: desktopActiveHub,
                          sectionTitle: desktopActiveSectionData.title,
                          requirements: item.requirements,
                          desc: item.description,
                          turnaround: getTurnaround(desktopActiveSectionData.title, item.name),
                          tips: item.tips ? [...item.tips] : undefined,
                          notice: item.notice,
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <ScrollBounce className="w-full mt-14 md:mt-20">
          <ClosingTagline />
        </ScrollBounce>
      </motion.div>

      <AnimatePresence>
        {activeHub && (
          <HubModal
            key="hub-modal"
            hubId={activeHub}
            originSide={hubOriginSide}
            onClose={closeHub}
            onSelectService={handleSelectService}
            onSwitchHub={(id) => handleOpenHub(id, "right")}
          />
        )}
        {selectedService && (
          <ServiceDetailModal key={selectedService.name} svc={selectedService} onClose={closeService} />
        )}
      </AnimatePresence>

      <BackToTopButton visible={showBackToTop && !isModalOpen} />
    </section>
  )
} 
