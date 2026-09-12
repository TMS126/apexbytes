// lib/home-notices.tsx
// Homepage notices. Keep only time-sensitive updates that are supported by
// a current official source. Re-verify dates before changing this file.
import { Info } from "@phosphor-icons/react"
import type { HomeNotice } from "@/components/home-notice-stack"

export const HOME_NOTICES: HomeNotice[] = [
  {
    id: "sars-filing-season-2026",
    variant: "info",
    Icon: Info,
    header: "SARS 2026 Filing Deadlines",
    body: "Non-provisional taxpayers have until 23 October 2026 to submit via SARS eFiling or the MobiApp. Provisional taxpayers and trusts have until 22 January 2027. Source: sars.gov.za — last checked 12 September 2026.",
  },
]
