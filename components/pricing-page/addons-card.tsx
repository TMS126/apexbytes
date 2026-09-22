"use client"

import { CheckCircle, Sparkle } from "@phosphor-icons/react"
import { TOKEN } from "@/lib/brand"
import { ADD_ONS_EFFECTIVE_DATE, ADD_ONS_FOOTER, FREE_ADD_ONS, PAID_ADD_ONS } from "@/lib/add-ons"

export function AddOnsCard() {
  return (
    <section className="rounded-[14px] bg-white px-5 py-6 abh-shadow-card dark:bg-zinc-900 md:px-7 md:py-7" aria-labelledby="pricing-add-ons-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: `${TOKEN.orangeText}1a` }} aria-hidden="true">
          <Sparkle size={18} weight="bold" style={{ color: TOKEN.orangeText }} aria-hidden="true" />
        </span>
        <div>
          <h2 id="pricing-add-ons-title" className="font-sans text-lg font-black text-zinc-900 dark:text-zinc-50">New Add-Ons &amp; Free Features</h2>
          <p className="text-[0.82rem] font-medium text-muted-foreground">Effective {ADD_ONS_EFFECTIVE_DATE} — extras to make your prints better.</p>
        </div>
      </div>
      <ul className="mb-6 grid gap-3 sm:grid-cols-2">
        {PAID_ADD_ONS.map((addOn) => (
          <li key={addOn.name} className="flex min-h-[88px] items-start justify-between gap-3 rounded-[10px] bg-zinc-50 px-3.5 py-3 dark:bg-zinc-950">
            <span className="min-w-0">
              <span className="block text-[0.86rem] font-black text-zinc-800 dark:text-zinc-100">{addOn.name}</span>
              <span className="block text-[0.76rem] font-medium leading-snug text-muted-foreground">{addOn.desc}</span>
            </span>
            <span className="shrink-0 text-[0.8rem] font-black" style={{ color: TOKEN.orangeText }}>{addOn.price}</span>
          </li>
        ))}
      </ul>
      <h3 className="mb-2.5 text-[0.72rem] font-black uppercase tracking-widest text-muted-foreground">Free — No Extra Charge</h3>
      <ul className="mb-4 grid gap-1.5 sm:grid-cols-2">
        {FREE_ADD_ONS.map((addOn) => (
          <li key={addOn} className="flex items-center gap-2 text-[0.84rem] font-semibold text-zinc-700 dark:text-zinc-200">
            <CheckCircle size={14} weight="bold" style={{ color: TOKEN.greenText }} aria-hidden="true" />
            {addOn}
          </li>
        ))}
      </ul>
      <p className="text-[0.8rem] font-medium italic text-muted-foreground">{ADD_ONS_FOOTER}</p>
    </section>
  )
}
