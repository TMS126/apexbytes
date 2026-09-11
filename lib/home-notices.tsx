// lib/home-notices.tsx
// Homepage notices. Verified against official sources on 11 Sept 2026 —
// SASSA (sassa.gov.za / official payment schedule) and SARS's own Filing
// Season page (sars.gov.za). Re-verify before changing any date here.
import { Megaphone, Info } from "@phosphor-icons/react"
import type { HomeNotice } from "@/components/home-notice-stack"

export const HOME_NOTICES: HomeNotice[] = [
  {
    id: "sassa-review-2026-09",
    variant: "warning",
    Icon: Megaphone,
    header: "SASSA Grant Review Reminder",
    body: "If SASSA flagged your grant for a review or eLife Certification, you're paid on a separate fourth payment day and must visit your nearest SASSA office to complete it — SASSA has warned grants can be suspended if this isn't done. Regular September payments: Older Persons 2 Sep, Disability 3 Sep, Children's grants 4 Sep, with SRD paid in rolling batches later in the month.",
  },
  {
    id: "sars-filing-season-2026",
    variant: "info",
    Icon: Info,
    header: "SARS Filing Season 2026 Is Open",
    body: "If you're a non-provisional taxpayer (a regular salaried employee), you have until 23 October 2026 to submit your return via SARS eFiling or the MobiApp. Provisional taxpayers and trusts have until 22 January 2027.",
  },
]
