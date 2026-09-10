// components/whatsapp-fab/compose-bar.tsx
"use client"

/* ============================================================
   COMPOSE BAR — every icon here is inert except Send, so each
   one now shakes on tap, matching the kebab menu's behaviour.
   ============================================================ */

import { PaperPlaneTilt, Microphone, Smiley, Paperclip, Camera } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { WA, TXT } from "./wa-theme"

interface ComposeBarProps {
  isValid: boolean
  shakeKey: string | null
  onShake: (key: string) => void
  onSend: () => void
}

export function ComposeBar({ isValid, shakeKey, onShake, onSend }: ComposeBarProps) {
  return (
    <div className="relative shrink-0 flex items-end gap-2 px-2.5 py-2" style={{ backgroundColor: WA.composeBar }}>
      <div className="flex-1 flex items-center gap-2 rounded-full px-3 py-2 shadow-sm min-w-0" style={{ backgroundColor: WA.composeField }}>
        <button type="button" onClick={() => onShake("smiley")} aria-label="Emoji" className={cn("shrink-0", shakeKey === "smiley" && "wa-shake")}>
          <Smiley size={20} weight="regular" style={{ color: WA.sub }} />
        </button>
        <span className={cn(TXT.body, "flex-1 min-w-0 font-medium truncate")} style={{ color: isValid ? WA.text : WA.sub }}>
          {isValid ? "Ready to send your message" : "Fill in your name & topic to continue"}
        </span>
        <button type="button" onClick={() => onShake("paperclip")} aria-label="Attach" className={cn("shrink-0", shakeKey === "paperclip" && "wa-shake")}>
          <Paperclip size={18} weight="regular" style={{ color: WA.sub }} />
        </button>
        <button type="button" onClick={() => onShake("camera")} aria-label="Camera" className={cn("shrink-0", shakeKey === "camera" && "wa-shake")}>
          <Camera size={19} weight="regular" style={{ color: WA.sub }} />
        </button>
      </div>
      <button
        onClick={onSend}
        className={cn(
          "abh-press w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 transition-transform duration-150 ease-out transform-gpu",
          !isValid && "opacity-60",
          shakeKey === "send" && "wa-shake"
        )}
        style={{ backgroundColor: WA.accent }}
        aria-label={isValid ? "Send" : "Complete the form to send"}
      >
        {isValid ? <PaperPlaneTilt size={18} weight="fill" /> : <Microphone size={19} weight="fill" />}
      </button>
    </div>
  )
}
