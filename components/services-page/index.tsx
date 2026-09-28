// components/services-page/index.tsx
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Megaphone, CaretLeft, CaretDown, CheckCircle } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey } from "@/lib/brand"
import { HUBS, HubId } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { HubIcon } from "./shared"
import { InlineSearchBar } from "./search-bar"
import { HubModal } from "./hub-modal"
import { ServiceDetailModal } from "./service-detail-modal"
import {
  HUB_ORDER, NOTICE, trackEvent, getTurnaround, SelectedService,
  hubSlugToId, resolveServiceRoute, serviceRouteFor, hubRouteFor,
} from "./lib"
import { sectionHasBulk } from "../quote-calculator/lib"
import { NoticePill } from "@/components/notice-pill"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"
import { MobileHubCard } from "./mobile-hub-card"
import { DesktopHubGrid } from "./desktop-hub-grid"
import { ClosingTagline, SectionCard, ServiceCard } from "./cards"

// ============================================================
// SERVICES PAGE
// ============================================================
export function ServicesPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const params = useParams<{ slug?: string[] }>()
  const router = useRouter()
  const slug = params?.slug ?? []

  // ── Route-derived state — the URL is the only source of truth ──────
  // No useState for activeHub/selectedService, no manual history
  // bookkeeping. Whatever the URL says IS the state; navigating deeper
  // is router.push, and the physical back button works automatically
  // through real browser history — nothing custom needed for it.
  const routeHubId = slug.length >= 1 ? hubSlugToId(slug[0]) : null
  const routeService = slug.length === 3 ? resolveServiceRoute(slug[0], slug[1], slug[2]) : null

  const activeHub: HubId | null = routeService ? null : routeHubId
  const selectedService: SelectedService | null = routeService
    ? {
        name: routeService.item.name,
        price: routeService.item.price,
        hubId: routeService.hubId,
        sectionTitle: routeService.sectionTitle,
        requirements: routeService.item.requirements,
        desc: routeService.item.description,
        turnaround: getTurnaround(routeService.sectionTitle, routeService.item.name),
        tips: routeService.item.tips ? [...routeService.item.tips] : undefined,
        notice: routeService.item.notice,
      }
    : null

  const [hubOriginSide, setHubOriginSide] = useState<"left" | "right">("right")
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
    router.push(serviceRouteFor(svc.hubId, svc.sectionTitle, svc.name))
  }

  const handleOpenHub = (hubId: HubId, originSide: "left" | "right") => {
    trackEvent("view_hub", { hub_id: hubId, hub_name: HUBS[hubId].title })
    setHubOriginSide(originSide)
    router.push(hubRouteFor(hubId))
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

  // Real effect now. Other parts of the app (e.g. the WhatsApp FAB)
  // dispatch this to jump straight to a service.
  useEffect(() => {
    const handler = (e: Event) => {
      const svc = (e as CustomEvent<SelectedService>).detail
      if (svc) handleSelectService(svc)
    }
    window.addEventListener("abh:selectService", handler)
    return () => window.removeEventListener("abh:selectService", handler)
  }, [])

  // Always push to the exact parent URL — deterministic, no history-depth
  // guessing. The physical back button is unaffected by this and keeps
  // working correctly on its own via real route history.
  const closeService = () => {
    if (!selectedService) return
    router.push(hubRouteFor(selectedService.hubId))
  }
  const closeHub = () => router.push("/services")

  // Real effect now — this is the one that was silently never cleaning
  // up and would have left the page permanently unscrollable.
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
              <p className="mb-3 text-[0.92rem] leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-[0.8rem]">{NOTICE.intro}</p>
              <div className="overflow-hidden rounded-xl border border-zinc-200/80 bg-zinc-50/80 dark:border-zinc-700/80 dark:bg-zinc-900/70">
                <details open className="group border-b border-zinc-200/80 dark:border-zinc-700/80">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-left text-[0.74rem] [&::-webkit-details-marker]:hidden font-black uppercase tracking-[0.12em] text-zinc-700 dark:text-zinc-200">
                    <span>Paid add-ons</span>
                    <CaretDown size={15} weight="bold" className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="grid grid-cols-1 gap-2 px-3.5 pb-3.5 md:grid-cols-2 md:gap-x-6 md:gap-y-1.5">
                    {NOTICE.paid.map((a) => (
                      <li key={a.name} className="flex min-h-[92px] min-w-0 flex-col rounded-lg bg-white/80 px-3 py-3 dark:bg-zinc-950/70 md:min-h-[72px] md:rounded-none md:border-b md:border-zinc-200/70 md:bg-transparent md:px-0 md:py-2 md:dark:border-zinc-700/70 md:dark:bg-transparent">
                        <div className="flex items-start justify-between gap-3">
                          <span className="min-w-0 text-[0.88rem] font-black leading-tight text-zinc-800 dark:text-zinc-100 md:text-[0.78rem]">{a.name}</span>
                          <span className="shrink-0 text-[0.78rem] font-black text-emerald-700 dark:text-emerald-400">{a.price}</span>
                        </div>
                        <p className="mt-1 text-[0.82rem] font-medium leading-snug text-zinc-500 dark:text-zinc-400 md:text-[0.7rem]">{a.desc}</p>
                      </li>
                    ))}
                  </ul>
                </details>
                <details open className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3 text-left text-[0.74rem] [&::-webkit-details-marker]:hidden font-black uppercase tracking-[0.12em] text-zinc-700 dark:text-zinc-200">
                    <span>Free add-ons</span>
                    <CaretDown size={15} weight="bold" className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="grid grid-cols-1 gap-2 px-3.5 pb-3.5 md:grid-cols-2 md:gap-x-6 md:gap-y-1.5">
                    {NOTICE.free.map((f) => (
                      <li key={f} className="flex min-h-10 min-w-0 items-start gap-2 rounded-lg bg-white/80 px-3 py-2.5 text-[0.86rem] font-semibold leading-snug text-zinc-700 dark:bg-zinc-950/70 dark:text-zinc-200 md:min-h-0 md:rounded-none md:border-b md:border-zinc-200/70 md:bg-transparent md:px-0 md:py-1.5 md:text-[0.7rem] md:dark:border-zinc-700/70 md:dark:bg-transparent">
                        <CheckCircle size={14} weight="bold" className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
              <p className="mt-3 text-[0.78rem] font-medium italic text-zinc-500 dark:text-zinc-400">{NOTICE.footer}</p>
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
                  hubHasBulk={hubHasBulk}
                  hubHasNotice={hubHasNotice}
                  onClick={() => handleOpenHub(hubId, "right")}
                />
              </ScrollBounce>
            )
          })}
        </div>

        {/* DESKTOP — Level 0: 3 × 2 grid (5 hub cards + hub finder) */}
        {!desktopActiveHub && <DesktopHubGrid onSelectHub={handleDesktopSelectHub} />}

        {/* DESKTOP — Level 1 & 2: pills + card grids */}
        {desktopActiveHub && desktopHub && (
          <div className="hidden md:flex flex-col items-center w-full animate-in fade-in duration-200">

            <nav aria-label="Service hubs" className="mb-7 flex w-full max-w-5xl flex-wrap items-end justify-center gap-x-5 gap-y-3 px-2 sm:gap-x-7 sm:px-4">
              <button type="button" onClick={handleDesktopBackToHubs} className="group inline-flex min-h-9 items-center gap-1.5 pb-2 text-[0.78rem] font-bold text-muted-foreground transition-colors hover:text-foreground">
                <CaretLeft size={14} weight="bold" aria-hidden="true" />
                All hubs
              </button>
              {HUB_ORDER.map((hubId) => {
                const colors = HUB_COLORS[hubId as HubKey]
                const accent = isDark ? colors.accentDark : colors.accentLight
                const isActiveHub = hubId === desktopActiveHub
                return (
                  <button
                    key={hubId}
                    type="button"
                    aria-current={isActiveHub ? "page" : undefined}
                    onClick={() => handleDesktopSwitchHub(hubId)}
                    className={cn("group relative inline-flex min-h-9 items-center gap-2 pb-2 text-[0.82rem] font-black transition-colors after:absolute after:bottom-0 after:left-[3%] after:w-[94%] after:h-0.5 after:rounded-full after:bg-[var(--underline-color)] after:transition-opacity", isActiveHub ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground after:opacity-0")}
                    style={{ color: isActiveHub ? accent : undefined, ['--underline-color' as string]: accent }}
                  >
                    <HubIcon id={hubId} size={20} color="currentColor" />
                    {HUBS[hubId].title}
                  </button>
                )
              })}
            </nav>

            {desktopActiveSectionData && (
              <nav aria-label="Service sections" className="mb-8 flex w-full max-w-4xl flex-wrap items-end justify-center gap-x-4 gap-y-2 px-2 sm:gap-x-6 sm:px-4">
                <button type="button" onClick={handleDesktopBackToSections} className="inline-flex min-h-9 items-center gap-1.5 pb-2 text-[0.75rem] font-bold text-muted-foreground transition-colors hover:text-foreground">
                  <CaretLeft size={14} weight="bold" aria-hidden="true" />
                  All sections
                </button>
                {desktopHub.sections.map((section, sIdx) => {
                  const selected = sIdx === desktopActiveSection
                  return (
                    <button key={section.title} type="button" aria-current={selected ? "page" : undefined} onClick={() => handleDesktopSwitchSection(sIdx)} className={cn("relative inline-flex min-h-9 items-center pb-2 text-[0.8rem] font-black transition-colors after:absolute after:bottom-0 after:left-[3%] after:w-[94%] after:h-0.5 after:rounded-full after:bg-[var(--underline-color)] after:transition-opacity", selected ? "text-foreground after:opacity-100" : "text-muted-foreground hover:text-foreground after:opacity-0")} style={{ color: selected ? desktopHubAccent : undefined, ['--underline-color' as string]: desktopHubAccent }}>
                      {section.title}
                    </button>
                  )
                })}
              </nav>
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
                  {desktopActiveSectionData.items.map((item) => (
                    <ServiceCard
                      key={item.name}
                      item={item}
                      accent={desktopHubAccent}
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
