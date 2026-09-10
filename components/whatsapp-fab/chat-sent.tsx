// components/whatsapp-fab/chat-sent.tsx
"use client"

/* ============================================================
   SENT STEP — confirmation bubble + follow-up actions
   ============================================================ */

import { Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { DateDivider } from "./date-divider"
import { WA, TXT } from "./wa-theme"

interface ChatSentProps {
  dateLabel: string
  sentTime: string
  onSendAnother: () => void
  onClose: () => void
}

export function ChatSent({ dateLabel, sentTime, onSendAnother, onClose }: ChatSentProps) {
  return (
    <div className="relative z-10 min-h-full px-4 py-5 flex flex-col justify-end items-end gap-3">
      <DateDivider dateLabel={dateLabel} subColor={WA.sub} />
      <div
        className="relative max-w-[85%] px-4 py-3 rounded-lg rounded-tr-none shadow-sm animate-in fade-in slide-in-from-right-1 duration-200 ease-out motion-reduce:animate-none"
        style={{ backgroundColor: WA.bubbleOut }}
      >
        <p className={cn(TXT.body, "leading-relaxed pr-14")} style={{ color: WA.text }}>
          Message ready — opening WhatsApp now…
        </p>
        <span className={cn(TXT.time, "absolute bottom-1.5 right-3 flex items-center gap-0.5")} style={{ color: WA.sub }}>
          {sentTime}
          <span className="relative w-3.5 h-2.5 inline-block ml-0.5">
            <Check size={11} weight="bold" className="absolute left-0" style={{ color: WA.tick }} />
            <Check size={11} weight="bold" className="absolute left-[3px]" style={{ color: WA.tick }} />
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onSendAnother}
          className={cn(TXT.hint, "abh-press px-4 py-2.5 rounded-full font-bold shadow-sm")}
          style={{ backgroundColor: "color-mix(in srgb, var(--wa-accent) 12%, transparent)", color: WA.text }}
        >
          Send another
        </button>
        <button
          onClick={onClose}
          className={cn(TXT.hint, "abh-press px-5 py-2.5 rounded-full font-bold shadow-sm")}
          style={{ backgroundColor: WA.composeField, color: WA.text }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
