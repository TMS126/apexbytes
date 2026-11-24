// components/gallery/gallery-page.tsx — full file, paste over the current one
"use client"

import { EditorialScrollCue } from "@/components/editorial-scroll-cue"
import { useCallback, useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { Funnel, Shuffle } from "@phosphor-icons/react"
import { ExpandingSearch } from "@/components/expanding-search"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey, TOKEN } from "@/lib/brand"
import { PROJECTS, ProjectData } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { ROW_ORDER, HubId } from "@/lib/gallery-helpers"
import { useGalleryBackStack } from "@/hooks/use-gallery-back-stack"
import { ProjectViewerModal } from "@/components/gallery/project-viewer-modal"
import { SafeImage } from "@/components/gallery/safe-image"
import { LikeButton, ShareButton } from "@/components/gallery/like-share-buttons"
import { HubIcon } from "@/components/services-page/shared"
import { GalleryClosingTagline } from "@/components/gallery/empty-and-tagline"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

const LIKES_STORAGE_KEY = "apexbytes-gallery-likes"

// Shared compact mobile icons and editorial desktop text filters.
export function HubFilterCircles({
  activeFilter, onSelect, getAccent,
}: {
  activeFilter: HubId | "all"
  onSelect: (id: HubId | "all") => void
  getAccent: (id: HubId) => string
  isDark: boolean
}) {
  const filters = [{ id: "all" as const, label: "All", accent: TOKEN.orangeText, icon: <Funnel size={23} weight="regular" aria-hidden="true" /> }, ...ROW_ORDER.map((row) => ({ id: row.id, label: row.short, accent: getAccent(row.id), icon: <HubIcon id={row.id} size={24} weight="regular" /> }))]
  return (
    <div className="flex w-full flex-nowrap items-center justify-start gap-5 overflow-x-auto px-2 pb-3 no-scrollbar md:justify-center md:gap-8">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id
        return (
          <button key={filter.id} type="button" onClick={() => onSelect(filter.id)} aria-pressed={isActive} aria-label={filter.id === "all" ? "All projects" : filter.label} className="group relative flex min-h-11 shrink-0 flex-col items-center gap-1.5 whitespace-nowrap pb-2 text-muted-foreground transition-colors hover:text-[var(--filter-accent)] focus-visible:text-[var(--filter-accent)] md:flex-row md:gap-2 md:text-[1.18rem] md:font-medium" style={{ ["--filter-accent" as string]: filter.accent, color: isActive ? filter.accent : undefined }}>
            <span className="relative flex items-center justify-center text-muted-foreground transition-colors group-hover:text-[var(--filter-accent)] md:hidden" aria-hidden="true">
              {filter.icon}
              <span className={cn("absolute -bottom-2 left-1/2 h-0.5 w-7 -translate-x-1/2 origin-center scale-x-0 rounded-full bg-[var(--filter-accent)] transition-transform", isActive ? "scale-x-100 opacity-100" : "opacity-0")} />
            </span>
            <span className="hidden md:block">{filter.label}</span>
            <span aria-hidden="true" className={cn("absolute bottom-0 left-1/2 h-0.5 w-full -translate-x-1/2 origin-center scale-x-0 rounded-full bg-[var(--filter-accent)] transition-transform", isActive ? "scale-x-100 opacity-100" : "opacity-0")} />
          </button>
        )
      })}
    </div>
  )
}

// Smaller thumbnails, denser grid — 3 columns on mobile, 4 from sm up,
// with a tighter (but not cramped) gap so more fit per row while still
// reading as "breathing," not crowded. Per-card hub icon dropped — now
// redundant since each card sits inside a labeled HubGroupCard (or,
// for a single active hub filter, the filter circle above already
// says which hub you're looking at).
function ProjectCard({
  p, liked, onToggleLike, onSelect, pathname,
}: {
  p: ProjectData
  liked: boolean
  onToggleLike: (id: string) => void
  onSelect: (p: ProjectData) => void
  pathname: string
}) {
  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}${pathname}?project=${p.id}` : `${pathname}?project=${p.id}`
  return (
    <div className="flex flex-col">
      <div className="group relative aspect-[4/3] overflow-hidden rounded-[14px] bg-zinc-100 transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[var(--shadow-card-lift)] focus-within:shadow-[var(--shadow-card-lift)] dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => onSelect(p)}
          aria-label={`View ${p.title}`}
          className="absolute inset-0 z-0 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <SafeImage
            src={p.image}
            alt={p.title}
            accent={TOKEN.orangeText}
            fill
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 44vw"
            className="object-cover"
          />
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-2">
          <div className="pointer-events-auto">
            <ShareButton url={shareUrl} title={p.title} />
          </div>
          <div className="pointer-events-auto">
            <LikeButton liked={liked} onToggle={(e) => { e.stopPropagation(); onToggleLike(p.id) }} context="card" />
          </div>
        </div>
      </div>

      <button type="button" onClick={() => onSelect(p)} className="mt-3 min-w-0 text-left px-0.5 active:scale-[0.99] transition-transform duration-150">
        <span className="block text-base md:text-lg font-medium text-zinc-800 dark:text-zinc-100 truncate leading-tight">{p.title}</span>
        <span className="mt-1 block text-xs md:text-sm uppercase tracking-[0.14em] text-muted-foreground">{p.tag}</span>
      </button>
    </div>
  )
}

function ProjectGrid({
  projects, likedIds, onToggleLike, onSelect, pathname,
}: {
  projects: ProjectData[]
  likedIds: Set<string>
  onToggleLike: (id: string) => void
  onSelect: (p: ProjectData) => void
  pathname: string
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6">
      {projects.map((p) => (
        <ProjectCard key={p.id} p={p} liked={likedIds.has(p.id)} onToggleLike={onToggleLike} onSelect={onSelect} pathname={pathname} />
      ))}
    </div>
  )
}

function GalleryPageInner() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const searchParams = useSearchParams()
  const pathname      = usePathname()
  const [activeFilter,    setActiveFilter]    = useState<HubId | "all">("all")
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null)
  const [zoomIndex,       setZoomIndex]       = useState<number | null>(null)
  const [searchQuery,     setSearchQuery]     = useState("")
  const [searchExpanded,  setSearchExpanded]  = useState(true)
  const [surpriseFlash,   setSurpriseFlash]   = useState(false)
  const [likedIds,        setLikedIds]        = useState<Set<string>>(new Set())
  const showBackToTop = useBackToTop()
  const likesHydrated = useRef(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(LIKES_STORAGE_KEY)
        if (raw) setLikedIds(new Set(JSON.parse(raw)))
      } catch {}
      likesHydrated.current = true
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  useEffect(() => {
    if (!likesHydrated.current) return
    try { localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedIds))) } catch {}
  }, [likedIds])

  const toggleLike = useCallback((id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const { closeProject, closeZoom } = useGalleryBackStack(selectedProject, setSelectedProject, zoomIndex, setZoomIndex)

  useEffect(() => {
    const projectId = searchParams.get("project")
    if (!projectId) return
    const match = PROJECTS.find(p => p.id === projectId)
    if (!match) return
    const frame = requestAnimationFrame(() => {
      setActiveFilter(match.hub as HubId)
      setSelectedProject(match)
    })
    return () => cancelAnimationFrame(frame)
  }, [searchParams])

  useEffect(() => {
    const hubParam = searchParams.get("hub")
    if (!hubParam) return
    const isValidHub = ROW_ORDER.some(r => r.id === hubParam)
    if (!isValidHub) return
    const frame = requestAnimationFrame(() => setActiveFilter(hubParam as HubId))
    return () => cancelAnimationFrame(frame)
  }, [searchParams])

  useEffect(() => {
    if (!selectedProject) return
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = "fixed"; style.top = `-${scrollY}px`
    style.left = "0"; style.right = "0"; style.width = "100%"; style.overflow = "hidden"
    return () => {
      style.position = ""; style.top = ""; style.left = ""; style.right = ""; style.width = ""; style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [selectedProject])

  const getAccent = useCallback(
    (id: HubId) => { const c = HUB_COLORS[id as HubKey]; return isDark ? c.accentDark : c.accentLight },
    [isDark]
  )

  const searchLower = searchQuery.trim().toLowerCase()
  const matchesSearch = useCallback((p: ProjectData) => {
    if (!searchLower) return true
    return (
      p.title.toLowerCase().includes(searchLower) ||
      p.tag.toLowerCase().includes(searchLower) ||
      p.shortDesc.toLowerCase().includes(searchLower)
    )
  }, [searchLower])

  const visibleProjects = PROJECTS.filter(
    p => (activeFilter === "all" || p.hub === activeFilter) && matchesSearch(p)
  )

  const handleSurprise = useCallback(() => {
    setSurpriseFlash(true)
    setTimeout(() => {
      const pool = selectedProject && PROJECTS.length > 1
        ? PROJECTS.filter((project) => project.id !== selectedProject.id)
        : PROJECTS
      const pick = pool[Math.floor(Math.random() * pool.length)]
      setActiveFilter(pick.hub as HubId)
      setSelectedProject(pick)
      setSurpriseFlash(false)
    }, 220)
  }, [selectedProject])

  const modalSiblings = selectedProject ? PROJECTS.filter(p => p.hub === selectedProject.hub) : []

  return (
    // FIX: was a framer-motion `motion.div` with `layout` — the exact
    // cause of the "warp" when switching hub filters, since layout
    // animation was re-measuring and tweening the ENTIRE content block's
    // height on every filter click, not just the notice pill it was
    // originally added for. Reverted to a plain div — switching hubs is
    // now an instant re-render with no shared-layout tween to fight.
    <section className="min-h-screen bg-background pb-24 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        <ScrollBounce>
          <div className="abh-editorial-hero mb-10">
            <h1 className="abh-page-title mb-4">Our Portfolio</h1>
            <p className="abh-tagline max-w-2xl mx-auto">Real results for real clients. Select a category to explore our work in depth.</p>
            <div className="abh-divider" />
            <EditorialScrollCue />
          </div>
        </ScrollBounce>

        <ScrollBounce delay={0.1}>
          <div className="mx-auto mb-8 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <ExpandingSearch
              id="gallery-search"
              label="Search projects"
              placeholder="Search..."
              value={searchQuery}
              expanded={searchExpanded}
              onChange={setSearchQuery}
              onExpandedChange={setSearchExpanded}
              className="w-full max-w-none sm:max-w-[300px]"
            />
            <button
              onClick={handleSurprise}
              aria-label="Surprise me with a random project"
              className={cn(
                "flex min-h-9 shrink-0 items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-[0.82rem] font-medium whitespace-nowrap text-muted-foreground transition-colors duration-200 hover:text-foreground active:scale-95 group/surprise dark:bg-zinc-800 dark:text-muted-foreground dark:hover:text-foreground",
                surpriseFlash && "scale-90 opacity-60",
              )}
            >
              <Shuffle size={13} weight="bold" className="transition-transform duration-300 group-hover/surprise:rotate-180" aria-hidden="true" />
              Pick for me
            </button>
          </div>
        </ScrollBounce>

        <ScrollBounce delay={0.16}>
          <div className="mb-10">
            <HubFilterCircles activeFilter={activeFilter} onSelect={setActiveFilter} getAccent={getAccent} isDark={isDark} />
          </div>
        </ScrollBounce>

        {visibleProjects.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6">
            <p className="text-base font-medium text-muted-foreground dark:text-muted-foreground">
              {searchLower ? `No projects match "${searchQuery.trim()}"` : "No projects in this category yet"}
            </p>
            {searchLower && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm font-medium underline text-brand-orange"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ScrollBounce>
            <div className="max-w-6xl mx-auto">
              <ProjectGrid
                projects={visibleProjects}
                likedIds={likedIds}
                onToggleLike={toggleLike}
                onSelect={setSelectedProject}
                pathname={pathname}
              />
            </div>
          </ScrollBounce>
        )}

        <ScrollBounce className="mt-28 md:mt-40">
          <GalleryClosingTagline />
        </ScrollBounce>
      </div>

      <ProjectViewerModal
        project={selectedProject}
        onClose={closeProject}
        zoomIndex={zoomIndex}
        setZoomIndex={setZoomIndex}
        onCloseZoom={closeZoom}
        pathname={pathname}
        siblings={modalSiblings}
        onNavigate={setSelectedProject}
        likedIds={likedIds}
        onToggleLike={toggleLike}
      />

      <BackToTopButton visible={showBackToTop} />
    </section>
  )
}

function GallerySkeleton() {
  return (
    <section className="min-h-screen bg-background pb-24">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 text-center">
        <h1 className="abh-page-title mb-4">Our Portfolio</h1>
        <div className="abh-divider" />
      </div>
    </section>
  )
}

export function GalleryPage() {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <GalleryPageInner />
    </Suspense>
  )
        }
