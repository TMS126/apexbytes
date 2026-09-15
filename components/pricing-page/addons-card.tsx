// components/pricing-page/addons-card.tsx
"use client"

import { Sparkle, CheckCircle } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { PAID_ADD_ONS, FREE_ADD_ONS, ADD_ONS_FOOTER, ADD_ONS_EFFECTIVE_DATE } from "@/lib/add-ons"

export function AddOnsCard() {
  return (
    <div className="rounded-[14px] bg-white dark:bg-zinc-900 abh-shadow-card px-5 py-6 md:px-7 md:py-7">
      <div className="flex items-start gap-3 mb-5">
        <span
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${TOKEN.orangeText}1a` }}
          aria-hidden="true"
        >
          <Sparkle size={18} weight="bold" style={{ color: TOKEN.orangeText }} aria-hidden="true" />
        </span>
        <div>
          <h2 className="font-sans font-black text-lg text-zinc-900 dark:text-zinc-50">
            New Add-Ons &amp; Free Features
          </h2>
          <p className="text-[0.82rem] font-medium text-muted-foreground">
            Effective {ADD_ONS_EFFECTIVE_DATE} — extras to make your prints better.
          </p>
        </div>
      </div>

      <ul className="grid sm:grid-cols-2 gap-3 mb-6">
        {PAID_ADD_ONS.map((a) => (
          <li
            key={a.name}
            className="flex items-start justify-between gap-3 rounded-[10px] bg-zinc-50 dark:bg-zinc-950 px-3.5 py-3"
          >
            <span className="min-w-0">
              <span className="block text-[0.86rem] font-black text-zinc-800 dark:text-zinc-100">{a.name}</span>
              <span className="block text-[0.76rem] font-medium text-muted-foreground leading-snug">{a.desc}</span>
            </span>
            <span className="shrink-0 text-[0.8rem] font-black" style={{ color: TOKEN.orangeText }}>
              {a.price}
            </span>
          </li>
        ))}
      </ul>

      <h3 className="text-[0.72rem] font-black uppercase tracking-widest text-muted-foreground mb-2.5">
        Free — No Extra Charge
      </h3>
      <ul className="flex flex-col gap-1.5 mb-4">
        {FREE_ADD_ONS.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[0.84rem] font-semibold text-zinc-700 dark:text-zinc-200">
            <CheckCircle size={14} weight="bold" style={{ color: TOKEN.greenText }} aria-hidden="true" />
            {f}
          </li>
        ))}
      </ul>

      <p className="text-[0.8rem] font-medium italic text-muted-foreground">{ADD_ONS_FOOTER}</p>
    </div>
  )
}
