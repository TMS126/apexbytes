// components/gallery/gallery-page.tsx — full file, paste over the current one
"use client"

import { useCallback, useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import { X, Info, MagnifyingGlass, Shuffle } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { HUB_COLORS, HubKey, TOKEN } from "@/lib/brand"
import { PROJECTS, ProjectData } from "@/lib/data"
import { ScrollBounce } from "@/components/scroll-bounce"
import { ROW_ORDER, HubId, hubLabelFor } from "@/lib/gallery-helpers"
import { useGalleryBackStack } from "@/hooks/use-gallery-back-stack"
import { ProjectViewerModal } from "@/components/gallery/project-viewer-modal"
import { SafeImage } from "@/components/gallery/safe-image"
import { LikeButton, ShareButton } from "@/components/gallery/like-share-buttons"
import { HubIcon } from "@/components/services-page/shared"
import { GalleryClosingTagline } from "@/components/gallery/empty-and-tagline"
import { NoticePill } from "@/components/notice-pill"
import { BackToTopButton, useBackToTop } from "@/components/back-to-top-button"

const LIKES_STORAGE_KEY = "apexbytes-gallery-likes"

// ── Hub-filter circles ──
// "All" now uses the seal-orange minimal accent (it isn't hub-specific,
// so it gets the site's one neutral accent rather than borrowing blue).
// Each hub circle still reveals its OWN color on hover/select — that
// part was already correct logic, untouched. Added active:scale press
// feedback to every circle (was hover-only before, no tactile response
// on tap).
function HubFilterCircles({
  activeFilter, onSelect, getAccent, isDark,
}: {
  activeFilter: HubId | "all"
  onSelect: (id: HubId | "all") => void
  getAccent: (id: HubId) => string
  isDark: boolean
}) {
  const neutralIconColor = isDark ? "#a1a1aa" : "#71717a"

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 overflow-x-auto no-scrollbar px-1 pb-1">
      <button
        onClick={() => onSelect("all")}
        aria-pressed={activeFilter === "all"}
        aria-label="All projects"
        className="group shrink-0 flex flex-col items-center gap-1.5 active:scale-90 transition-transform duration-150"
      >
        <span
          className="relative w-16 h-16 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 transition-colors overflow-hidden"
          style={{ borderColor: activeFilter === "all" ? TOKEN.orangeText : "transparent" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ backgroundColor: `color-mix(in srgb, ${TOKEN.orangeText} 19%, transparent)` }}
          />
          <span className={cn("relative text-[0.8rem] font-black", activeFilter === "all" ? "text-brand-orange" : "text-muted-foreground dark:text-muted-foreground")}>All</span>
        </span>
        <span className="text-[0.72rem] font-bold text-muted-foreground dark:text-muted-foreground">All</span>
      </button>

      {ROW_ORDER.map((row) => {
        const isActive = activeFilter === row.id
        const accent = getAccent(row.id)
        return (
          <button
            key={row.id}
            onClick={() => onSelect(row.id)}
            aria-pressed={isActive}
            aria-label={row.label}
            className="group shrink-0 flex flex-col items-center gap-1.5 active:scale-90 transition-transform duration-150"
          >
            <span
              className="relative w-16 h-16 rounded-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 border-2 transition-colors overflow-hidden"
              style={{ borderColor: isActive ? accent : "transparent" }}
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ backgroundColor: `color-mix(in srgb, ${accent} 19%, transparent)` }}
              />
              {/* NOTE: HubIcon is hardcoded to weight="fill" in
                  services-page/shared.tsx right now — "regular unless
                  selected" needs a `weight` prop added there first. Once
                  that file's updated, pass weight={isActive ? "fill" : "regular"}
                  here. */}
              <span className="relative">
                <HubIcon id={row.id} size={26} weight={isActive ? "fill" : "regular"} color={isActive ? accent : neutralIconColor} />
              </span>
            </span>
            <span className="text-[0.72rem] font-bold text-muted-foreground dark:text-muted-foreground max-w-[64px] truncate">{row.short}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Hub group card ──
// Replaces the old flat "divider + grid" pattern entirely. Each hub's
// projects now sit inside a real abh-card container — same containment
// language as the Services page's hub cards — with a neutral header
// (icon + label) and a clean internal border as the divider between
// header and grid, instead of a floating pill over a horizontal rule.
function HubGroupCard({ hubId, accent, children }: { hubId: HubId; accent: string; children: React.ReactNode }) {
  return (
    <div className="abh-card p-4 md:p-6 mb-6">
      <div className="flex items-center gap-2.5 mb-4 pb-3.5 border-b border-zinc-100 dark:border-zinc-800">
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          <HubIcon id={hubId} size={15} weight="regular" color="currentColor" />
        </span>
        <h2 className="text-[0.82rem] font-black uppercase tracking-widest text-muted-foreground dark:text-muted-foreground">
          {hubLabelFor(hubId)}
        </h2>
      </div>
      {children}
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
      <button
        onClick={() => onSelect(p)}
        aria-label={`View ${p.title}`}
        className="group relative aspect-square rounded-[10px] overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-sm transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.97] active:translate-y-0"
      >
        <SafeImage
          src={p.image}
          alt={p.title}
          accent={TOKEN.orangeText}
          fill
          sizes="(max-width: 640px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
          <div onClick={(e) => e.stopPropagation()}>
            <ShareButton url={shareUrl} title={p.title} />
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <LikeButton liked={liked} onToggle={(e) => { e.stopPropagation(); onToggleLike(p.id) }} context="card" />
          </div>
        </div>
      </button>

      <button onClick={() => onSelect(p)} className="mt-1.5 min-w-0 text-left px-0.5 active:scale-[0.98] transition-transform duration-150">
        <span className="block text-[0.72rem] font-black text-zinc-800 dark:text-zinc-100 truncate leading-tight">{p.title}</span>
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
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 md:gap-5">
      {projects.map((p) => (
        <ProjectCard key={p.id} p={p} liked={likedIds.has(p.id)} onToggleLike={onToggleLike} onSelect={onSelect} pathname={pathname} />
      ))}
    </div>
  )
}

// Grouped-by-hub view for the "All" filter — each hub's projects now
// render inside HubGroupCard instead of a flat divider. Still preserves
// ROW_ORDER, still skips empty hubs, still falls back to a flat grid
// when only one hub matches (e.g. mid-search) so a single lonely card
// wrapper doesn't appear for no reason.
function GroupedProjectGrid({
  projects, likedIds, onToggleLike, onSelect, pathname, getAccent,
}: {
  projects: ProjectData[]
  likedIds: Set<string>
  onToggleLike: (id: string) => void
  onSelect: (p: ProjectData) => void
  pathname: string
  getAccent: (id: HubId) => string
}) {
  const groups = ROW_ORDER
    .map((row) => ({ hubId: row.id, items: projects.filter((p) => p.hub === row.id) }))
    .filter((g) => g.items.length > 0)

  if (groups.length <= 1) {
    return <ProjectGrid projects={projects} likedIds={likedIds} onToggleLike={onToggleLike} onSelect={onSelect} pathname={pathname} />
  }

  return (
    <div>
      {groups.map((group) => (
        <HubGroupCard key={group.hubId} hubId={group.hubId} accent={getAccent(group.hubId)}>
          <ProjectGrid projects={group.items} likedIds={likedIds} onToggleLike={onToggleLike} onSelect={onSelect} pathname={pathname} />
        </HubGroupCard>
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
  const [surpriseFlash,   setSurpriseFlash]   = useState(false)
  const [likedIds,        setLikedIds]        = useState<Set<string>>(new Set())
  const showBackToTop = useBackToTop()
  const likesHydrated = useRef(false)
  const [photoNoticeDismissed, setPhotoNoticeDismissed] = useState(false)

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
    <section className="min-h-screen bg-background pt-[calc(var(--nav-h)+2rem)] pb-24 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">

        <ScrollBounce>
          <div className="text-center mb-12">
            <h1 className="abh-page-title mb-4">Our Portfolio</h1>
            <p className="abh-tagline max-w-2xl mx-auto">Real results for real clients. Select a category to explore our work in depth.</p>
            <div className="abh-divider" />
          </div>
        </ScrollBounce>

        {!photoNoticeDismissed && (
          <ScrollBounce delay={0.06}>
            <div className="flex justify-center max-w-2xl mx-auto mb-6">
              <NoticePill
                variant="info"
                Icon={Info}
                collapsedLabel="Notice"
                expandedLabel="A Note on Our Photos"
                onDismiss={() => setPhotoNoticeDismissed(true)}
              >
                We use high-quality sample photos to represent our services — the professional standard shown is exactly what you receive.
              </NoticePill>
            </div>
          </ScrollBounce>
        )}

        <ScrollBounce delay={0.1}>
          <div className="max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-[14px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus-within:border-brand-orange transition-all duration-200">
              <MagnifyingGlass size={16} weight="bold" className="shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search..."
                aria-label="Search projects"
                className="min-w-0 flex-1 py-2.5 bg-transparent text-base font-medium text-zinc-800 dark:text-zinc-200 placeholder:text-muted-foreground outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-zinc-600 dark:hover:text-zinc-300 transition-all active:scale-90"
                >
                  <X size={11} weight="bold" />
                </button>
              )}

              <button
                onClick={handleSurprise}
                aria-label="Surprise me with a random project"
                className={cn(
                  "shrink-0 flex items-center gap-1.5 pl-3 pr-3.5 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[0.82rem] font-bold text-muted-foreground dark:text-muted-foreground hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-200 active:scale-95 group/surprise whitespace-nowrap",
                  surpriseFlash && "scale-90 opacity-60"
                )}
              >
                <Shuffle size={13} weight="bold" className="transition-transform duration-300 group-hover/surprise:rotate-180" aria-hidden="true" />
                Pick for me
              </button>
            </div>
          </div>
        </ScrollBounce>

        <ScrollBounce delay={0.16}>
          <div className="mb-10">
            <HubFilterCircles activeFilter={activeFilter} onSelect={setActiveFilter} getAccent={getAccent} isDark={isDark} />
          </div>
        </ScrollBounce>

        {visibleProjects.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 px-6">
            <p className="text-base font-bold text-muted-foreground dark:text-muted-foreground">
              {searchLower ? `No projects match "${searchQuery.trim()}"` : "No projects in this category yet"}
            </p>
            {searchLower && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-sm font-black underline text-brand-orange"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <ScrollBounce>
            <div className="max-w-6xl mx-auto">
              {activeFilter === "all" ? (
                <GroupedProjectGrid
                  projects={visibleProjects}
                  likedIds={likedIds}
                  onToggleLike={toggleLike}
                  onSelect={setSelectedProject}
                  pathname={pathname}
                  getAccent={getAccent}
                />
              ) : (
                <ProjectGrid projects={visibleProjects} likedIds={likedIds} onToggleLike={toggleLike} onSelect={setSelectedProject} pathname={pathname} />
              )}
            </div>
          </ScrollBounce>
        )}

        <ScrollBounce>
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
    <section className="min-h-screen bg-background pt-[calc(var(--nav-h)+2rem)] pb-24">
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
