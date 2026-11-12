// components/about/naked-traderz-reveal.tsx
"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { X, Sparkle } from "@phosphor-icons/react"
import { BRAND } from "@/lib/brand"

interface TheNakedTradersZARevealProps {
  accentColor?: string
  accentOrange?: string
}

export function TheNakedTradersZAReveal({
  accentColor = BRAND.blue,
  accentOrange = BRAND.orangeDark,
}: TheNakedTradersZARevealProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const openModal = useCallback(() => {
    setModalOpen(true)
    window.history.pushState({ nakedTraderzModal: true }, "")
  }, [])

  const closeModal = useCallback((viaPopState = false) => {
    setAnimateIn(false)
    setModalOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
    if (!viaPopState && window.history.state?.nakedTraderzModal) {
      window.history.back()
    }
  }, [])

  useEffect(() => {
    if (!modalOpen) return
    const raf = requestAnimationFrame(() => setAnimateIn(true))
    return () => cancelAnimationFrame(raf)
  }, [modalOpen])

  useEffect(() => {
    if (!modalOpen) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal()
    }
    function handlePopState() {
      closeModal(true)
    }
    document.addEventListener("keydown", handleKey)
    window.addEventListener("popstate", handlePopState)
    document.body.style.overflow = "hidden"
    closeBtnRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", handleKey)
      window.removeEventListener("popstate", handlePopState)
      document.body.style.overflow = ""
    }
  }, [modalOpen, closeModal])

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={openModal}
        aria-haspopup="dialog"
        aria-expanded={modalOpen}
        aria-label="The Naked Traders ZA — view the original logo"
        className="underline decoration-dotted decoration-1 underline-offset-2 font-medium outline-none rounded-sm focus-visible:ring-2"
        style={{ color: "var(--link-foreground)", textDecorationColor: "var(--link-foreground)" }}
      >
        The Naked Traders ZA
      </button>

      {modalOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="nt-modal-title" className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 transition-opacity duration-500 ease-out"
            style={{ opacity: animateIn ? 1 : 0 }}
            onClick={() => closeModal()}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-sm rounded-[14px] bg-[var(--surface-modal)] p-3 shadow-2xl sm:max-w-xl sm:p-5 transition-all duration-500"
            style={{
              opacity: animateIn ? 1 : 0,
              transform: animateIn ? "translateY(0) scale(1)" : "translateY(8px) scale(0.94)",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div className="mb-3 flex items-center justify-end">
              <button
              ref={closeBtnRef}
              type="button"
              onClick={() => closeModal()}
              aria-label="Close logo preview"
              className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground outline-none focus-visible:ring-2"
              style={{ ["--tw-ring-color" as string]: accentColor }}
            >
                <X size={16} weight="bold" aria-hidden="true" />
              </button>
            </div>

            <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-black p-5 shadow-xl ring-1 ring-white/15 sm:p-8">
              <Image src="/nto.webp" alt="The Naked Traders ZA original logo" fill sizes="(max-width: 768px) 92vw, 560px" className="object-contain p-5 transition-transform duration-700 ease-out sm:p-8" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-5 pb-5 pt-16 sm:px-8 sm:pb-7">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkle size={14} weight="fill" style={{ color: accentOrange }} aria-hidden="true" />
                  <span className="abh-eyebrow text-white/80">1st Ever Logo</span>
                </div>
                <h3 id="nt-modal-title" className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">The Naked Traders ZA</h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/75 sm:text-base">The original market trading group identity, built for forex and CFD trading.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  )
} 
