// components/whatsapp-fab/typing-loader.tsx
"use client"

/* ============================================================
   TYPING INDICATOR
   Replaces the earlier 3-colour spinning-orbit loader with a
   calm, monochrome three-dot pulse — reused both for the opening
   beat and the shorter re-typing beat before each field bubble.
   ============================================================ */

export function TypingLoader({ subColor }: { subColor: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-4" role="status" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="wa-typing-dot inline-block rounded-full"
          style={{ width: 6, height: 6, backgroundColor: subColor, animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  )
} 
