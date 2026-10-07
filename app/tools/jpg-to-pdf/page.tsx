// app/tools/jpg-to-pdf/page.tsx
"use client"

import { useRef, useState } from "react"
import { useTheme } from "next-themes"
import { UploadSimple, FilePdf, WarningCircle, CaretLeft, Download, X, GraspHorizontal } from "@phosphor-icons/react"
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
      
      <main className="flex flex-col min-h-[calc(100vh-var(--nav-h))]">
        {/* HERO HEADER */}
        <section className="w-full pt-8 md:pt-12 pb-8 md:pb-12">
          <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
            <Link 
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <CaretLeft size={16} weight="bold" />
              Back to Tools
            </Link>
            
            <div className="flex justify-center mb-5">
              <FilePdf weight="fill" size={40} style={{ color: accentColor }} aria-hidden="true" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-heading font-semibold text-foreground mb-3 tracking-tight">
              JPG to PDF
            </h1>
            
            <p className="text-lg text-muted-foreground mb-1">
              Convert your images into PDF in seconds
            </p>
            
            <p className="text-sm text-muted-foreground">
              No upload • No registration • 100% secure
            </p>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="flex-1 w-full px-4 md:px-6 pb-12">
          <div className="max-w-2xl mx-auto">
            {t.images.length === 0 ? (
              // EMPTY STATE
              <>
                {/* Upload Zone */}
                <ScrollBounce>
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
                    className={`relative w-full rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center py-20 px-6 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isDragging
                        ? "border-solid bg-primary/8 border-primary"
                        : "border-dashed border-border hover:border-primary/50 hover:bg-primary/3"
                    }`}
                  >
                    <div 
                      className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-colors"
                      style={{ backgroundColor: `${accentColor}12` }}
                    >
                      <UploadSimple 
                        weight="bold" 
                        size={40}
                        style={{ color: accentColor }}
                        aria-hidden="true" 
                      />
                    </div>
                    
                    <h2 className="text-xl font-semibold text-foreground mb-2 text-center">
                      Select images or drag them here
                    </h2>
                    
                    <p className="text-sm text-muted-foreground text-center mb-6">
                      JPG, PNG, or WEBP • Maximum 15 MB each • Up to 20 images
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

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-4 mt-12">
                  <ScrollBounce delay={0.1}>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground mb-1">No Upload</div>
                      <div className="text-xs text-muted-foreground">Process locally</div>
                    </div>
                  </ScrollBounce>
                  <ScrollBounce delay={0.15}>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground mb-1">Secure</div>
                      <div className="text-xs text-muted-foreground">Files stay private</div>
                    </div>
                  </ScrollBounce>
                  <ScrollBounce delay={0.2}>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-foreground mb-1">Fast</div>
                      <div className="text-xs text-muted-foreground">Instant results</div>
                    </div>
                  </ScrollBounce>
                </div>
              </>
            ) : (
              // ACTIVE STATE
              <>
                {/* Settings Bar */}
                <ScrollBounce className="mb-8">
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

                {/* Image Grid - Centered */}
                <div className="mb-8">
                  {/* Controls Bar */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                    <div className="text-sm font-medium text-foreground">
                      {t.selectedCount} of {t.images.length} selected
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button" 
                        onClick={() => t.selectAll(!allSelected)} 
                        className="text-sm font-medium transition-colors hover:text-primary"
                        style={{ color: allSelected ? accentColor : "inherit" }}
                      >
                        {allSelected ? "Deselect All" : "Select All"}
                      </button>
                      <span className="text-border/50">•</span>
                      <button 
                        type="button" 
                        onClick={t.clearAll} 
                        className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
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
                </div>

                {/* Error State */}
                {t.errors.length > 0 && (
                  <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-950/20 px-4 py-3 mb-8 border border-red-200 dark:border-red-900/30">
                    <WarningCircle weight="fill" size={18} className="text-red-600 dark:text-red-400 shrink-0" aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">
                        {t.errors.length} issue{t.errors.length > 1 ? "s" : ""} found
                      </p>
                      <p className="text-xs text-red-800 dark:text-red-300">Check thumbnails for details</p>
                    </div>
                  </div>
                )}

                {/* Reconvert Banner */}
                <ReconvertBanner prompt={t.reconvertPrompt} onResolve={t.resolveReconvert} />

                {/* Convert Button */}
                <div className="flex justify-center mt-8 mb-12">
                  <button
                    type="button"
                    onClick={t.requestConvert}
                    disabled={t.isConverting || t.selectedCount === 0}
                    aria-busy={t.isConverting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold py-3.5 px-12 text-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ 
                      backgroundColor: accentColor,
                      boxShadow: !t.isConverting && t.selectedCount > 0 ? `0 4px 16px ${accentColor}40` : "none"
                    }}
                  >
                    <Download size={20} weight="bold" />
                    <span>{t.isConverting ? `Converting… ${t.progress}%` : "Download PDF"}</span>
                  </button>
                  <span className="sr-only" aria-live="polite">
                    {t.isConverting ? `Converting, ${t.progress} percent complete` : ""}
                  </span>
                </div>

                {/* Results Panel */}
                <ResultsPanel
                  convertedFiles={t.convertedFiles}
                  sendNotice={t.sendNotice}
                  accentColor={accentColor}
                  onSend={t.handleSend}
                  onAddMore={() => inputRef.current?.click()}
                />

                {/* History Panel */}
                <HistoryPanel history={t.history} onClear={t.clearRecents} />
              </>
            )}
          </div>
        </section>
      </main>

      {/* CTA Bar */}
      <CtaBar
        badgeText="Tips"
        title="While You're Here"
        description={tip}
        buttonText={waPhrase}
        variant="flat"
      />

      {/* Footer */}
      <Footer />

      {/* Lightbox & Modals */}
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
