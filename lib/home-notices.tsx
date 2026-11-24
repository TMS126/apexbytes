// lib/home-notices.tsx
// Homepage notices. Keep only time-sensitive updates that are supported by
// a current official source. Re-verify dates before changing this file.
import { Info, Megaphone, Buildings } from "@phosphor-icons/react"
import type { HomeNotice } from "@/components/page-notice-bell"

export const HOME_NOTICES: HomeNotice[] = [
  {
    id: "sars-filing-season-2026",
    variant: "info",
    Icon: Info,
    header: "SARS 2026 filing deadlines",
    body: "The non-provisional filing deadline has passed. Provisional taxpayers and trusts can still submit via SARS eFiling or the MobiApp.",
    closingDate: "22 Jan 2027",
    sourceLabel: "Official SARS Filing Season 2026 page",
    sourceUrl: "https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/",
  },
  {
    id: "sassa-december-grants-2026",
    variant: "info",
    Icon: Info,
    header: "SASSA December grant dates",
    body: "Older persons grants are scheduled for Wednesday 2 December, disability grants for Thursday 3 December, and children's grants for Friday 4 December. Check your status and lodge an appeal early if needed.",
    date: "Dates: 2–4 December 2026",
  },
  {
    id: "dpsa-circulars-41-42-2026",
    variant: "warning",
    Icon: Megaphone,
    header: "DPSA Circulars 41 and 42",
    body: "Circular 41 includes government vacancies and Circular 42 includes Free State posts. Several Circular 41 applications close soon, so review the requirements promptly.",
    closingDate: "30 Nov 2026",
  },
  {
    id: "nsfas-2027-appeals-status",
    variant: "warning",
    Icon: Buildings,
    header: "NSFAS 2027 status checks",
    body: "The 2027 application window has closed, but applicants can still check their status and follow the appeals process where it applies.",
    date: "Appeals and status checks remain open",
  },
]
