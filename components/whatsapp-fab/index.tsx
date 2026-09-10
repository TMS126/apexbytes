// components/whatsapp-fab/index.tsx
"use client"

/* ============================================================
   WHATSAPP FAB — WIDGET ROOT
   State, name persistence, staged reveal sequencing, and
   composition of header / form / sent / compose-bar / trigger.
   ============================================================ */

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { BIZ } from "@/lib/brand"
import { useExclusiveWidget } from "@/hooks/use-exclusive-widget"
import { useScrollHide } from "@/hooks/use-scroll-hide"
import { useCalculatorOpen } from "@/hooks/use-calculator-open"
import { ChatHeader } from "./chat-header"
import { ChatForm } from "./chat-form"
import { ChatSent } from "./chat-sent"
import { ComposeBar } from "./compose-bar"
import { FabTrigger } from "./fab-trigger"
import {
  WA, HUBS, buildWallpaperPattern, formatTime, formatDateLabel, randomQuickNoteIdx,
  NAME_STORAGE_KEY, NAME_RETENTION_MS, TYPING_DURATION, FOLLOW_TYPING_MS, SHAKE_DURATION,
} from "./wa-theme"

type Stage = { name: boolean; hub: boolean; note: boolean }

export function WhatsAppFAB() {
  const router = useRouter()
  const [isOpen, setIsOpen, isOtherOpen] = useExclusiveWidget("whatsapp")
  const isScrolling = useScrollHide()
  const calculatorOpen = useCalculatorOpen()

  const [name, setName]   = useState("")
  const [hub, setHub]     = useState("")
  const [note, setNote]   = useState("")
  const [step, setStep]   = useState<"form" | "sent">("form")
  const [hubPicking, setHubPicking] = useState(false)
  const [openTime, setOpenTime]     = useState("")
  const [openDate, setOpenDate]     = useState<Date | null>(null)
  const [sentTime, setSentTime]     = useState("")
  const [showGreeting, setShowGreeting] = useState(false)
  const [nameRemembered, setNameRemembered] = useState(false)
  const [quickNoteIdx, setQuickNoteIdx] = useState(() => randomQuickNoteIdx())

  // AUDIT/NEW: staged per-field typing beat, shorter than the opening
  // beat, shown sequentially before each of name/hub/note reveals.
  const [followTyping, setFollowTyping] = useState<Stage>({ name: false, hub: false, note: false })
  const [revealed, setRevealed]         = useState<Stage>({ name: false, hub: false, note: false })

  const [shakeKey, setShakeKey] = useState<string | null>(null)
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerShake = (key: string) => {
    if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current)
    setShakeKey(key)
    shakeTimerRef.current = setTimeout(() => setShakeKey(null), SHAKE_DURATION)
  }

  const greetingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const stageTimers   = useRef<ReturnType<typeof setTimeout>[]>([])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => { setStep("form"); setHub(""); setNote(""); setHubPicking(false) }, 400)
  }, [setIsOpen])

  // Remember the person's name across visits — expires after 90 days.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(NAME_STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as { name?: string; savedAt?: number }
          if (parsed?.name && typeof parsed.savedAt === "number" && Date.now() - parsed.savedAt < NAME_RETENTION_MS) {
            setName(parsed.name); setNameRemembered(true)
          } else {
            localStorage.removeItem(NAME_STORAGE_KEY)
          }
        }
      } catch {
        try { localStorage.removeItem(NAME_STORAGE_KEY) } catch {}
      }
    }, 0)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    try {
      if (name.trim().length > 1) {
        localStorage.setItem(NAME_STORAGE_KEY, JSON.stringify({ name: name.trim(), savedAt: Date.now() }))
      }
    } catch {}
  }, [name])

  // Sequenced reveal: greeting -> typing(name) -> name -> typing(hub) ->
  // hub -> typing(note) -> note. Nothing here calls .focus() on any
  // input — opening the widget must never pop the mobile keyboard.
  const runRevealSequence = useCallback(() => {
    stageTimers.current.forEach(clearTimeout)
    stageTimers.current = []
    setFollowTyping({ name: false, hub: false, note: false })
    setRevealed({ name: false, hub: false, note: false })

    const push = (fn: () => void, at: number) => stageTimers.current.push(setTimeout(fn, at))
    let t = 0
    push(() => setFollowTyping(p => ({ ...p, name: true })), t)
    t += FOLLOW_TYPING_MS
    push(() => { setFollowTyping(p => ({ ...p, name: false })); setRevealed(p => ({ ...p, name: true })) }, t)
    push(() => setFollowTyping(p => ({ ...p, hub: true })), t + 150)
    t += FOLLOW_TYPING_MS + 150
    push(() => { setFollowTyping(p => ({ ...p, hub: false })); setRevealed(p => ({ ...p, hub: true })) }, t)
    push(() => setFollowTyping(p => ({ ...p, note: true })), t + 150)
    t += FOLLOW_TYPING_MS + 150
    push(() => { setFollowTyping(p => ({ ...p, note: false })); setRevealed(p => ({ ...p, note: true })) }, t)
  }, [])

  useEffect(() => {
    if (!(isOpen && step === "form")) return
    const init = setTimeout(() => {
      const now = new Date()
      setOpenTime(formatTime()); setOpenDate(now)
      setShowGreeting(false)
      setQuickNoteIdx(randomQuickNoteIdx())
      if (greetingTimer.current) clearTimeout(greetingTimer.current)
      greetingTimer.current = setTimeout(() => { setShowGreeting(true); runRevealSequence() }, TYPING_DURATION)
    }, 0)
    // AUDIT FIX: removed the old focusTimer that called nameRef.focus()
    // ~150ms after the typing beat — that's what was popping the mobile
    // keyboard the instant the widget opened. Opening WhatsApp should
    // never trigger the keyboard on its own; tapping the field still does.
    return () => {
      clearTimeout(init)
      if (greetingTimer.current) clearTimeout(greetingTimer.current)
      stageTimers.current.forEach(clearTimeout)
    }
  }, [isOpen, step, runRevealSequence])

  useEffect(() => {
    if (!isOpen) return
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    document.addEventListener("keydown", fn)
    return () => document.removeEventListener("keydown", fn)
  }, [isOpen, handleClose])

  useEffect(() => {
    if (!isOpen) return
    const scrollY = window.scrollY
    const { style } = document.body
    style.position = "fixed"; style.top = `-${scrollY}px`
    style.left = "0"; style.right = "0"; style.width = "100%"; style.overflow = "hidden"
    return () => {
      style.position = ""; style.top = ""; style.left = ""
      style.right = ""; style.width = ""; style.overflow = ""
      window.scrollTo(0, scrollY)
    }
  }, [isOpen])

  const handleSendAnother = () => {
    setStep("form"); setHub(""); setNote(""); setHubPicking(false)
    const now = new Date()
    setOpenTime(formatTime()); setOpenDate(now)
    setShowGreeting(true)
    setQuickNoteIdx(randomQuickNoteIdx())
    setRevealed({ name: true, hub: true, note: true })
    setFollowTyping({ name: false, hub: false, note: false })
  }

  const handleGalleryClick = () => { handleClose(); router.push("/gallery") }

  if (calculatorOpen) return null

  const isValid = name.trim().length > 1 && hub !== ""
  const addQuickNote = (phrase: string) => setNote(prev => (prev.trim() ? `${prev.trim()} ${phrase}` : phrase))
  const shuffleQuickNote = () => setQuickNoteIdx(prev => randomQuickNoteIdx(prev))

  const handleSend = () => {
    if (!isValid) { triggerShake("send"); return }
    const selectedHub = HUBS.find(h => h.id === hub)
    const message = [
      `Hi ${BIZ.name}! 👋`,
      `My name is ${name.trim()}.`,
      `I need help with: *${selectedHub?.label ?? hub}*`,
      note.trim() ? `More details: ${note.trim()}` : "",
    ].filter(Boolean).join("\n")
    window.open(`https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent(message)}`, "_blank")
    setSentTime(formatTime())
    setStep("sent")
  }

  const wallpaperPattern = buildWallpaperPattern("currentColor")
  const dateLabel = openDate ? formatDateLabel(openDate) : ""

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[9989] bg-black/30 transition-opacity duration-200 ease-out motion-reduce:transition-none" onClick={handleClose} aria-hidden="true" />
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed bottom-24 right-4 left-4 md:left-auto md:right-6 z-[9991] md:w-[400px] max-h-[75vh]",
            "rounded-[20px] shadow-2xl flex flex-col overflow-hidden bg-white dark:bg-zinc-950",
            "animate-in slide-in-from-bottom-4 fade-in duration-200 ease-out motion-reduce:animate-none transform-gpu"
          )}
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
        >
          <ChatHeader onClose={handleClose} onGalleryClick={handleGalleryClick} shakeKey={shakeKey} onShake={triggerShake} />

          <div
            className="flex-1 overflow-y-auto overscroll-contain min-h-0 relative"
            style={{ backgroundColor: WA.wallpaper, backgroundImage: wallpaperPattern, backgroundSize: "240px 240px", color: WA.text }}
          >
            {step === "form" ? (
              <ChatForm
                dateLabel={dateLabel}
                showGreeting={showGreeting}
                openTime={openTime}
                name={name} setName={setName} nameRemembered={nameRemembered}
                hub={hub} setHub={setHub} hubPicking={hubPicking} setHubPicking={setHubPicking}
                note={note} setNote={setNote}
                quickNoteIdx={quickNoteIdx} addQuickNote={addQuickNote} shuffleQuickNote={shuffleQuickNote}
                followTyping={followTyping} revealed={revealed}
              />
            ) : (
              <ChatSent dateLabel={dateLabel} sentTime={sentTime} onSendAnother={handleSendAnother} onClose={handleClose} />
            )}
          </div>

          {step === "form" && <ComposeBar isValid={isValid} shakeKey={shakeKey} onShake={triggerShake} onSend={handleSend} />}
        </div>
      )}

      {/* AUDIT FIX: previously ignored the 3rd useExclusiveWidget value
          entirely and only faded via isScrolling — this trigger stayed
          on screen even while the Calculator panel was open, overlapping
          its send button. `visible` now hides it completely (display:
          none via FabTrigger's "hidden" class) whenever any other
          exclusive widget is open. */}
      <FabTrigger visible={!isOtherOpen} dimmed={isScrolling} onOpen={() => setIsOpen(true)} />
    </>
  )
}
