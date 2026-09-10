// components/whatsapp-fab/wa-theme.ts
/* ============================================================
   WHATSAPP WIDGET — SHARED CONSTANTS, TOKENS & HELPERS
   ============================================================ */

export const WA_NUMBER = "27753338260"
export const GREETING = "Hi there 👋 Tell us what you need and we'll get back to you right away!"
export const REPLY_TIME_NOTE = "We usually reply within 15–30 minutes."
export const NAME_STORAGE_KEY = "apexbytes-wa-name"
export const NAME_RETENTION_MS = 90 * 24 * 60 * 60 * 1000 // 90 days

// AUDIT: opening typing beat bumped 30% (2600ms -> 3380ms) per request.
// FOLLOW_TYPING_MS governs the shorter re-typing beat shown before each
// subsequent bubble (name / hub / note).
export const TYPING_DURATION = 3380
export const FOLLOW_TYPING_MS = 650
export const SHAKE_DURATION = 420

// ── Theme tokens ─────────────────────────────────────────────
// Colors are CSS custom properties (globals.css --wa-*), switched
// automatically by the .dark class — no isDark branching needed here
// or at any call site anymore.
export const WA = {
  header: "var(--wa-header)",
  wallpaper: "var(--wa-wallpaper)",
  bubbleIn: "var(--wa-bubble-in)",
  bubbleOut: "var(--wa-bubble-out)",
  text: "var(--wa-text)",
  sub: "var(--wa-sub)",
  composeBar: "var(--wa-compose-bar)",
  composeField: "var(--wa-compose-field)",
  accent: "var(--wa-accent)",
  tick: "var(--wa-tick)",
  avatarBg: "var(--wa-avatar-bg)",
} as const

export const TXT = {
  body: "text-[0.86rem]",
  label: "text-[0.66rem] uppercase tracking-widest font-black",
  hint: "text-[0.72rem]",
  time: "text-[0.6rem]",
} as const

// PDDET order — Print, Document, Design, E-Service, Tech (+ fallback)
export const HUBS = [
  { id: "print",    label: "Print Hub",     hint: "Printing, copying, photos" },
  { id: "doc",      label: "Docu Hub",      hint: "CVs, typing, laminating" },
  { id: "design",   label: "Design Hub",    hint: "Logos, flyers, branding" },
  { id: "eservice", label: "E-Service Hub", hint: "SASSA, SARS, NSFAS, PSIRA" },
  { id: "tech",     label: "Tech Hub",      hint: "PC repairs, software, setup" },
  { id: "other",    label: "Not sure yet",  hint: "We'll help you figure it out" },
] as const

// Hub accent colors for the floating pill picker's hover state — pulled
// from the same tokens the rest of the site uses, so this stays in sync.
export const HUB_PILL_COLOR: Record<string, string> = {
  print: "var(--hub-print-primary)",
  doc: "var(--hub-doc-primary)",
  design: "var(--hub-design-primary)",
  eservice: "var(--hub-eservice-primary)",
  tech: "var(--hub-tech-primary)",
  other: "var(--brand-neutral-500)",
}

export const QUICK_NOTES = [
  "Need it today", "Can I WhatsApp a photo?", "What time do you close?",
  "How much will this cost?", "Do I need to book first?", "Can you collect from me?",
  "Is this urgent?", "I'm not sure what I need", "Can I pay online?",
  "How long will it take?", "Do you deliver?", "Can I send the file now?",
  "I need this by tomorrow", "What documents should I bring?", "Is walk-in okay?",
  "Can someone call me instead?", "I have a few questions", "Can you quote me first?",
  "Do you work weekends?", "I need this urgently", "Can I collect later today?",
  "Do you accept cash only?", "Is there a discount for bulk?", "Can I get this printed too?",
  "I'll send more info shortly", "Just checking availability",
]

export function buildWallpaperPattern(strokeColor: string) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <g fill="none" stroke="${strokeColor}" stroke-width="1.2" opacity="0.28">
        <circle cx="24" cy="34" r="6" />
        <path d="M70 24 q10 -15 20 0 q10 15 20 0" />
        <path d="M140 66 l8 8 l-8 8 l-8 -8 z" />
        <path d="M190 34 q14 0 14 14 v8 q0 14 -14 14 h-14 l-8 8 v-10 h0 q-14 0 -14 -14 v-6 q0 -14 14 -14 z" />
        <circle cx="36" cy="130" r="4" />
        <path d="M36 150 q8 10 16 0 q8 -10 16 0" />
        <path d="M118 178 l10 10 m0 -10 l-10 10" />
        <circle cx="190" cy="190" r="5" />
        <path d="M70 216 q10 -12 20 0" />
      </g>
    </svg>
  `
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

export function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDateLabel(date: Date) {
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  const diffDays = Math.round((startOf(new Date()) - startOf(date)) / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return date.toLocaleDateString([], { day: "numeric", month: "long" })
}

export function randomQuickNoteIdx(exclude?: number) {
  if (QUICK_NOTES.length <= 1) return 0
  let next = exclude
  while (next === exclude) next = Math.floor(Math.random() * QUICK_NOTES.length)
  return next as number
}
