// app/tools/jpg-to-pdf/page.tsx
"use client"

import { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { UploadSimple, FilePdf, WarningCircle, CaretLeft, Download, Trash } from "@phosphor-icons/react"
import { THEME_HEX, HEX } from "@/lib/brand"
import { ensureAccessible } from "@/lib/color"
import { ScrollBounce } from "@/components/scroll-bounce"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CtaBar } from "@/components/strip-section"
import { useJpgToPdf } from "./use-jpg-to-pdf"
import { SettingsBar } from "./settings-bar"
import { ImageGrid } from "./image-grid"
import { ImageLightbox } from "./image-lightbox"
import { CropModal } from "./crop-modal"
import { ReconvertBanner } from "./reconvert-banner"
import { ResultsPanel } from "./results-panel"
import { HistoryPanel } from "./history-panel"
import Link from "next/link"
import { PAGE_TIPS, WHATSAPP_MAGIC_PHRASES } from "./constants"

export default function JpgToPdfPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [zoomId, setZoomId] = useState<string | null>(null)
  const [cropId, setCropId] = useState<string | null>(null)

  const [tip] = useState(() => PAGE_TIPS[Math.floor(Math.random() * PAGE_TIPS.length)])
  const [waPhrase] = useState(() => WHATSAPP_MAGIC_PHRASES[Math.floor(Math.random() * WHATSAPP_MAGIC_PHRASES.length)])

  const { resolvedTheme } = useTheme()
  const [mounted] = useState(() => typeof window !== "undefined")
  const isDark = mounted && resolvedTheme === "dark"
  const pageBg = isDark ? THEME_HEX.dark.page : THEME_HEX.light.page
  const accentColor = ensureAccessible(isDark ? HEX.dark.adobePdfRed : HEX.light.adobePdfRed, pageBg, 4.5)

  const t = useJpgToPdf()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) t.addFiles(e.target.files)
    e.target.value = ""
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) t.addFiles(e.dataTransfer.files)
  }

  const allSelected = t.images.length > 0 && t.selectedCount === t.images.length
  const selectedImages = t.images.filter((i) => i.selected)
  const originalBytes = selectedImages.length > 0 ? selectedImages.reduce((s, i) => s + i.file.size, 0) : null

  const zoomImage = t.images.find((i) => i.id === zoomId)
  const cropImage = t.images.find((i) => i.id === cropId)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <>
        {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 pt-[calc(var(--nav-h)+2rem)] pb-8 md:pb-12">
          <div className="max-w-[900px] mx-auto">
            <ScrollBounce>
              <Link href="/tools"
                className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/70 px-3 py-1.5 text-[0.8rem] font-bold text-muted-foreground shadow-sm transition-colors hover:bg-secondary/90 mb-6"
                aria-label="Back to all tools"
              >
                <CaretLeft size={12} weight="bold" aria-hidden="true" />
                All Tools
              </Link>
              
              <div className="flex items-center gap-3 mb-6">
                <FilePdf weight="fill" className="w-12 h-12" style={{ color: accentColor }} aria-hidden="true" />
                <h1 className="abh-page-title mb-0">JPG to PDF Converter</h1>
              </div>
            </ScrollBounce>
            
            <p className="abh-tagline max-w-2xl mx-auto mb-2">
              Convert your images into a professional PDF instantly. No upload, no registration — everything stays on your device.
            </p>
            <p className="text-sm text-muted-foreground text-center">
              Supports JPG, PNG, and WEBP • Up to 20 images • Adjust quality, page size, and more
            </p>
            <div className="abh-divider mx-auto mt-6" />
          </div>
        </section>

        {/* ─── MAIN WORKSPACE ───────────────────────────────────────────────── */}
        <section className="px-4 md:px-8 pb-20">
          <div className="max-w-[1400px] mx-auto">
            {/* Desktop: Sidebar + Canvas Layout */}
            {t.images.length === 0 ? (
              // Empty State — Full-Width Upload
              <div className="max-w-[900px] mx-auto">
                <ScrollBounce delay={0.05}>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        inputRef.current?.click()
                      }
                    }}
                    aria-label="Upload images: drag and drop, or press Enter to browse"
                    className={`relative rounded-[18px] border-2 ${
                      isDragging ? "border-solid bg-primary/5" : "border-dashed"
                    } border-border cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 py-16 px-8 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  >
                    {/* Animated Upload Icon */}
                    <div className="relative">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors"
                        style={{ backgroundColor: `${accentColor}15` }}
                      >
                        <UploadSimple weight="bold" className="w-8 h-8" style={{ color: accentColor }} aria-hidden="true" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-heading font-semibold text-lg text-foreground mb-1">
                        Drag & drop your images here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse from your device
                      </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2 px-4">
                      JPG, PNG, WEBP • Max 15 MB each • Up to 20 images
                    </p>

                    <input 
                      ref={inputRef} 
                      type="file" 
                      accept="image/jpeg,image/png,image/webp" 
                      multiple 
                      onChange={handleFileInput} 
                      className="hidden" 
                      aria-hidden="true" 
                      tabIndex={-1} 
                    />
                  </div>
                </ScrollBounce>

                {/* Quick Tips */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ScrollBounce delay={0.1}>
                    <div className="rounded-[14px] bg-secondary/50 p-4 text-center">
                      <p className="text-sm font-medium text-foreground mb-1">Fast Processing</p>
                      <p className="text-xs text-muted-foreground">Convert instantly in your browser</p>
                    </div>
                  </ScrollBounce>
                  <ScrollBounce delay={0.15}>
                    <div className="rounded-[14px] bg-secondary/50 p-4 text-center">
                      <p className="text-sm font-medium text-foreground mb-1">Privacy First</p>
                      <p className="text-xs text-muted-foreground">Your files never leave your device</p>
                    </div>
                  </ScrollBounce>
                  <ScrollBounce delay={0.2}>
                    <div className="rounded-[14px] bg-secondary/50 p-4 text-center">
                      <p className="text-sm font-medium text-foreground mb-1">Full Control</p>
                      <p className="text-xs text-muted-foreground">Crop, rotate, filter & adjust quality</p>
                    </div>
                  </ScrollBounce>
                </div>
              </div>
            ) : (
              // Active State — Sidebar + Grid
              <div className={`grid grid-cols-1 gap-8 lg:items-start lg:gap-8 xl:gap-10 ${t.images.length > 0 ? "lg:grid-cols-[320px_minmax(0,1fr)]" : ""}`}>
                {/* LEFT SIDEBAR — Settings & Upload */}
                <div className="lg:sticky lg:top-28 space-y-5">
                  <ScrollBounce>
                    <SettingsBar
                      mode={t.mode}
                      setMode={t.setMode}
                      pageSize={t.pageSize}
                      setPageSize={t.setPageSize}
                      quality={t.quality}
                      setQuality={t.setQuality}
                      originalBytes={originalBytes}
                      estimatedBytes={t.estimatedBytes}
                      accentColor={accentColor}
                    />
                  </ScrollBounce>

                  <ScrollBounce delay={0.05}>
                    <button
                      onClick={() => inputRef.current?.click()}
                      className="w-full rounded-[14px] border-2 border-dashed border-border bg-secondary/30 px-4 py-5 transition-all hover:border-primary hover:bg-primary/5 active:scale-95"
                    >
                      <UploadSimple weight="bold" className="w-5 h-5 mx-auto mb-2" style={{ color: accentColor }} aria-hidden="true" />
                      <p className="text-sm font-semibold text-foreground">Add More</p>
                      <p className="text-xs text-muted-foreground mt-1">Images</p>
                      <input 
                        ref={inputRef} 
                        type="file" 
                        accept="image/jpeg,image/png,image/webp" 
                        multiple 
                        onChange={handleFileInput} 
                        className="hidden" 
                        aria-hidden="true" 
                        tabIndex={-1} 
                      />
                    </button>
                  </ScrollBounce>

                  {t.errors.length > 0 && (
                    <div className="flex items-start gap-3 rounded-[12px] bg-red-50 dark:bg-red-950/30 px-4 py-3" aria-live="polite">
                      <WarningCircle weight="fill" className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                          {t.errors.length} issue{t.errors.length > 1 ? "s" : ""} found
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">Check thumbnails for details</p>
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground p-3 rounded-[12px] bg-secondary/40 text-center">
                    <p><strong>{t.selectedCount}</strong> of <strong>{t.images.length}</strong> selected</p>
                  </div>
                </div>

                {/* RIGHT CANVAS — Images & Actions */}
                <div className="min-w-0">
                  {t.images.length > 0 && (
                    <>
                      {/* Image Grid Controls */}
                      <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-border">
                        <button 
                          type="button" 
                          onClick={() => t.selectAll(!allSelected)} 
                          className="text-sm font-semibold hover:text-primary transition-colors"
                          style={{ color: allSelected ? accentColor : "inherit" }}
                        >
                          {allSelected ? "Deselect All" : "Select All"}
                        </button>
                        <span className="text-xs font-medium text-muted-foreground">
                          {t.selectedCount} / {t.images.length} selected
                        </span>
                        <button 
                          type="button" 
                          onClick={t.clearAll} 
                          className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash size={14} />
                          Clear All
                        </button>
                      </div>

                      {/* Image Grid */}
                      <ScrollBounce>
                        <ImageGrid
                          images={t.images}
                          rotations={t.rotations}
                          filters={t.filters}
                          errors={t.errors}
                          retryingIds={t.retryingIds}
                          convertedIds={t.convertedIds}
                          accentColor={accentColor}
                          onToggleSelect={t.toggleSelect}
                          onRotate={t.rotateImage}
                          onResetRotation={t.resetRotation}
                          onRemove={t.removeImage}
                          onZoom={setZoomId}
                          onCrop={setCropId}
                          onRetry={t.retryImage}
                          onReorder={t.reorder}
                          onSetFilter={t.setFilter}
                        />
                      </ScrollBounce>

                      <ReconvertBanner prompt={t.reconvertPrompt} onResolve={t.resolveReconvert} />

                      {/* Convert CTA */}
                      <div className="mt-8 flex gap-3 justify-center">
                        <button
                          type="button"
                          onClick={t.requestConvert}
                          disabled={t.isConverting || t.selectedCount === 0}
                          aria-busy={t.isConverting}
                          className="inline-flex items-center gap-2 rounded-[14px] font-bold py-3 px-8 text-white transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Download size={18} weight="bold" />
                          {t.isConverting ? `Converting… ${t.progress}%` : "Convert to PDF"}
                        </button>
                        <span className="sr-only" aria-live="polite">
                          {t.isConverting ? `Converting, ${t.progress} percent complete` : ""}
                        </span>
                      </div>
                    </>
                  )}

                  <ResultsPanel
                    convertedFiles={t.convertedFiles}
                    sendNotice={t.sendNotice}
                    accentColor={accentColor}
                    onSend={t.handleSend}
                    onAddMore={() => inputRef.current?.click()}
                  />

                  <HistoryPanel history={t.history} onClear={t.clearRecents} />
                </div>
              </div>
            )}
          </div>
        </section>

        <CtaBar
          badgeText="Tips"
          title="While You're Here"
          description={tip}
          buttonText={waPhrase}
          variant="flat"
        />
      </>
      <Footer />

      <ImageLightbox
        imageUrl={zoomImage?.previewUrl || null}
        fileName={zoomImage?.file.name}
        rotation={zoomId ? t.rotations[zoomId] : undefined}
        onClose={() => setZoomId(null)}
      />

      {cropImage && (
        <CropModal
          imageUrl={cropImage.previewUrl}
          fileName={cropImage.file.name}
          initialCrop={cropImage.crop}
          onApply={(crop) => { t.setCrop(cropImage.id, crop); setCropId(null) }}
          onClose={() => setCropId(null)}
        />
      )}
    </div>
  )
}
