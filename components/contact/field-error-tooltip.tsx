// components/contact/field-error-tooltip.tsx
"use client"

import { TOKEN } from "@/lib/brand"

// Bug fix: was hardcoded bg-red-600/text-white — off the app's actual
// error token, now pulls from the same TOKEN.errorBg used everywhere else.
export function FieldErrorTooltip({ message }: { message: string }) {
  return (
    <div className="relative mt-2 inline-block" role="alert">
      <span
        className="absolute -top-[5px] left-4 w-2.5 h-2.5 rotate-45"
        style={{ backgroundColor: TOKEN.errorBg }}
        aria-hidden="true"
      />
      <span
        className="relative block text-[0.84rem] font-medium px-3 py-1.5 rounded-[6px]"
        style={{ backgroundColor: TOKEN.errorBg, color: TOKEN.onDestructive }}
      >
        {message}
      </span>
    </div>
  )
} 
