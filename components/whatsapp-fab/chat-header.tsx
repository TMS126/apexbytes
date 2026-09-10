// components/whatsapp-fab/chat-header.tsx
"use client"

/* ============================================================
   CHAT HEADER — back, avatar, name/status, action icons
   Gallery + Call are real navigation, so they never shake.
   Kebab (⋮) is inert, so it keeps the "not wired up yet" shake.
   ============================================================ */

import Image from "next/image"
import { ArrowLeft, Phone, DotsThreeVertical, ImageSquare } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { BIZ } from "@/lib/brand"
import { WA, TXT } from "./wa-theme"

interface ChatHeaderProps {
  onClose: () => void
  onGalleryClick: () => void
  shakeKey: string | null
  onShake: (key: string) => void
}

export function ChatHeader({ onClose, onGalleryClick, shakeKey, onShake }: ChatHeaderProps) {
  return (
    <div className="relative flex items-center gap-2.5 px-3 py-3 shrink-0" style={{ backgroundColor: WA.header }}>
      <button
        onClick={onClose}
        className="abh-press w-9 h-9 rounded-full flex items-center justify-center text-white/90 hover:bg-white/10 transition-colors duration-150 shrink-0"
        aria-label="Close"
      >
        <ArrowLeft size={20} weight="bold" />
      </button>

      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 p-1.5" style={{ backgroundColor: WA.avatarBg }}>
        {/* AUDIT: replaced the old inline isDark ? "brightness(0) invert(1)" : "brightness(0)"
            branch with the Tailwind equivalent — same result, no JS needed. */}
        <div className="relative w-full h-full brightness-0 dark:invert">
          <Image src="/logo.png" alt="" fill sizes="36px" className="object-contain" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-sans font-black text-[0.9rem] leading-tight tracking-tight text-white truncate">
          {BIZ.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <p className={cn(TXT.hint, "font-medium text-white/80")}>online</p>
        </div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        {/* Real navigation — no shake, per request */}
        <button
          onClick={onGalleryClick}
          aria-label="View our gallery"
          className="abh-press w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 transition-colors duration-150"
        >
          <ImageSquare size={18} weight="fill" />
        </button>
        {/* Real navigation — no shake, per request */}
        <a
          href={`tel:${BIZ.phoneE164}`}
          aria-label="Call us"
          className="abh-press w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 transition-colors duration-150"
        >
          <Phone size={18} weight="fill" />
        </a>
        {/* Inert — shakes like every other non-functional control */}
        <button
          onClick={() => onShake("kebab")}
          aria-label="More options"
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-white/85 hover:bg-white/10 transition-colors duration-150",
            shakeKey === "kebab" && "wa-shake"
          )}
        >
          <DotsThreeVertical size={20} weight="bold" />
        </button>
      </div>
    </div>
  )
}
