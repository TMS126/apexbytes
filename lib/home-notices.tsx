// lib/home-notices.tsx
// Homepage notices. Keep only time-sensitive updates that are supported by
// a current official source. Re-verify dates before changing this file.
import { Info } from "@phosphor-icons/react"
import type { HomeNotice } from "@/components/page-notice-bell"

export const HOME_NOTICES: HomeNotice[] = [
  {
    id: "sars-filing-season-2026",
    variant: "info",
    Icon: Info,
    header: "SARS 2026 filing deadlines",
    body: "The deadline for non-provisional taxpayers was 23 October 2026. Provisional taxpayers and trusts have until 22 January 2027 to submit via SARS eFiling or the MobiApp.",
    sourceLabel: "Official SARS Filing Season 2026 page",
    sourceUrl: "https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/",
  },
]
