// components/whatsapp-fab/chat-form.tsx
"use client"

/* ============================================================
   CHAT FORM STEP — greeting + name / hub / note bubbles
   Each field bubble now shows its own short "typing…" beat
   before revealing, staggered after the greeting.
   ============================================================ */

import { CaretDown, Lightning, ArrowsClockwise } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { TypingLoader } from "./typing-loader"
import { DateDivider } from "./date-divider"
import { HubPickerPills } from "./hub-picker-pills"
import { WA, TXT, HUBS, GREETING, REPLY_TIME_NOTE, QUICK_NOTES } from "./wa-theme"

interface Stage { name: boolean; hub: boolean; note: boolean }

interface ChatFormProps {
  dateLabel: string
  showGreeting: boolean
  openTime: string
  name: string
  setName: (v: string) => void
  nameRemembered: boolean
  hub: string
  setHub: (v: string) => void
  hubPicking: boolean
  setHubPicking: (v: boolean) => void
  note: string
  setNote: (v: string) => void
  quickNoteIdx: number
  addQuickNote: (phrase: string) => void
  shuffleQuickNote: () => void
  followTyping: Stage
  revealed: Stage
}

export function ChatForm({
  dateLabel, showGreeting, openTime,
  name, setName, nameRemembered,
  hub, setHub, hubPicking, setHubPicking,
  note, setNote, quickNoteIdx, addQuickNote, shuffleQuickNote,
  followTyping, revealed,
}: ChatFormProps) {
  const selectedHub = HUBS.find(h => h.id === hub)

  const Bubble = ({ field, children }: { field: keyof Stage; children: React.ReactNode }) => (
    <div
      className={cn(
        "relative self-start w-[92%] max-w-[92%] px-4 py-3 rounded-lg rounded-tl-none shadow-sm transition-opacity duration-200 ease-out motion-reduce:transition-none",
        (followTyping[field] || revealed[field]) ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundColor: WA.bubbleIn }}
    >
      {followTyping[field] ? <TypingLoader subColor={WA.sub} /> : children}
    </div>
  )

  return (
    <div className="relative z-10 px-4 py-5 flex flex-col gap-3">
      <DateDivider dateLabel={dateLabel} subColor={WA.sub} />

      {!showGreeting && (
        <div className="self-start px-4 py-3 rounded-lg rounded-tl-none shadow-sm" style={{ backgroundColor: WA.bubbleIn }}>
          <TypingLoader subColor={WA.sub} />
        </div>
      )}

      {showGreeting && (
        <div
          className="relative self-start max-w-[85%] px-4 py-3 rounded-lg rounded-tl-none shadow-sm animate-in fade-in slide-in-from-left-1 duration-200 ease-out motion-reduce:animate-none"
          style={{ backgroundColor: WA.bubbleIn }}
        >
          <p className={cn(TXT.body, "leading-relaxed pr-10")} style={{ color: WA.text }}>{GREETING}</p>
          <p className={cn(TXT.hint, "font-medium mt-1.5")} style={{ color: WA.sub }}>{REPLY_TIME_NOTE}</p>
          <span className={cn(TXT.time, "absolute bottom-1.5 right-3")} style={{ color: WA.sub }}>{openTime}</span>
        </div>
      )}

      <Bubble field="name">
        <label className={cn(TXT.label, "block mb-1.5")} style={{ color: WA.sub }}>Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Thembi"
          className={cn(TXT.body, "w-full bg-transparent font-semibold outline-none border-none")}
          style={{ color: WA.text }}
        />
        <div className="flex items-center justify-between mt-1.5">
          {nameRemembered && name.trim().length > 1 ? (
            <span className={cn(TXT.time, "font-bold")} style={{ color: WA.accent }}>Remembered from last time</span>
          ) : <span />}
          <span className={TXT.time} style={{ color: WA.sub }}>{openTime}</span>
        </div>
      </Bubble>

      <Bubble field="hub">
        <label className={cn(TXT.label, "block mb-1.5")} style={{ color: WA.sub }}>What do you need help with?</label>
        <div className="relative">
          {hubPicking && (
            <HubPickerPills selected={hub} textColor={WA.sub} onSelect={(id) => { setHub(id); setHubPicking(false) }} />
          )}
          <button type="button" onClick={() => setHubPicking(!hubPicking)} className="w-full text-left flex items-center justify-between">
            <div className="flex flex-col min-w-0">
              {selectedHub ? (
                <>
                  <span className={cn(TXT.body, "font-black leading-tight")} style={{ color: WA.text }}>{selectedHub.label}</span>
                  <span className={cn(TXT.hint, "font-semibold mt-0.5 truncate")} style={{ color: WA.sub }}>{selectedHub.hint}</span>
                </>
              ) : (
                <span className={cn(TXT.body, "font-semibold")} style={{ color: WA.sub }}>Tap to choose...</span>
              )}
            </div>
            <CaretDown
              size={15}
              weight="bold"
              className="transition-transform duration-200 ease-out motion-reduce:transition-none shrink-0"
              style={{ color: WA.sub, transform: hubPicking ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </button>
        </div>
        <div className="flex justify-end mt-1.5">
          <span className={TXT.time} style={{ color: WA.sub }}>{openTime}</span>
        </div>
      </Bubble>

      <Bubble field="note">
        <label className={cn(TXT.label, "block mb-1.5")} style={{ color: WA.sub }}>
          Anything else? <span className="normal-case font-semibold opacity-60">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything else? Message here"
          rows={2}
          className={cn(TXT.body, "w-full bg-transparent font-semibold outline-none border-none resize-none")}
          style={{ color: WA.text }}
        />
        <div className="flex items-center gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => addQuickNote(QUICK_NOTES[quickNoteIdx])}
            className={cn(TXT.hint, "abh-press flex-1 min-w-0 flex items-center gap-1 px-2 py-1 rounded-full font-bold border transition-all duration-150 ease-out hover:-translate-y-0.5")}
            style={{ borderColor: "color-mix(in srgb, var(--wa-sub) 12%, transparent)", color: WA.text, backgroundColor: "color-mix(in srgb, var(--wa-accent) 7%, transparent)" }}
          >
            <Lightning size={9} weight="fill" style={{ color: WA.accent }} className="shrink-0" />
            <span className="truncate">{QUICK_NOTES[quickNoteIdx]}</span>
          </button>
          <button
            type="button"
            onClick={shuffleQuickNote}
            aria-label="Show another quick reply"
            className="abh-press shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-transform duration-150 ease-out active:rotate-180"
            style={{ borderColor: "color-mix(in srgb, var(--wa-sub) 12%, transparent)", color: WA.sub, backgroundColor: "color-mix(in srgb, var(--wa-accent) 4%, transparent)" }}
          >
            <ArrowsClockwise size={11} weight="bold" />
          </button>
        </div>
        <div className="flex justify-end mt-1.5">
          <span className={TXT.time} style={{ color: WA.sub }}>{openTime}</span>
        </div>
      </Bubble>
    </div>
  )
}
