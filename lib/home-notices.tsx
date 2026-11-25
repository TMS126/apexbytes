// lib/home-notices.tsx
// Homepage notices. Keep only time-sensitive updates that are supported by
// a current official source. Re-verify dates before changing this file.
import { Info, Megaphone, Buildings } from "@phosphor-icons/react"
import type { HomeNotice } from "@/components/page-notice-bell"

// Official public-service updates. Shared by the home and services bells so
// both pages stay in step; re-verify every date against the linked source.
export const OFFICIAL_NOTICES: HomeNotice[] = [
  {
    id: "sars-filing-season-2026",
    variant: "info",
    Icon: Info,
    header: "SARS 2026 filing deadlines",
    body: "The 23 October 2026 deadline for non-provisional taxpayers has passed. Provisional taxpayers and trusts have until 22 January 2027 and can submit through SARS eFiling or the MobiApp.",
    closingDate: "22 Jan 2027",
    sourceLabel: "Official SARS Filing Season 2026 page",
    sourceUrl: "https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/",
  },
  {
    id: "sassa-declare-changes-2026",
    variant: "warning",
    Icon: Megaphone,
    header: "Declare changes to SASSA",
    body: "Beneficiaries must report changes in employment, income, marital status or other circumstances that affect eligibility. Update your details at a SASSA office or on the SASSA services portal to avoid recovery of undue payments.",
    date: "Issued 12 November 2026",
    sourceLabel: "Official SASSA media statement, 12 November 2026",
    sourceUrl: "https://www.sassa.gov.za/documents/uploads/Media_Statement_SASSA_commends_beneficiaries_who_voluntarily_disclose_changes_in_their_financial_circumstances.pdf",
  },
  {
    id: "dpsa-vacancy-circular-schedule",
    variant: "info",
    Icon: Info,
    header: "Public service vacancy circulars",
    body: "The final Public Service Vacancy Circular for 2026 is published on 4 December. The first 2027 circular follows on 15 January, so check both for new posts and their closing dates.",
    date: "4 Dec 2026 and 15 Jan 2027",
    sourceLabel: "Official DPSA Employment Management Circular 55 of 2026",
    sourceUrl: "https://www.dpsa.gov.za/dpsa2g/documents/vacancies/Circular%20%2055%20of%202026.pdf",
  },
  {
    id: "nsfas-2027-appeals-status",
    variant: "warning",
    Icon: Buildings,
    header: "NSFAS 2027 status and appeals",
    body: "Applications closed on 31 October 2026. Track your result on myNSFAS; if you are rejected, first-time entering students have 15 days to appeal and continuing students have 30 days from receiving the result.",
    date: "Appeals: 15 days (first-time) or 30 days (continuing)",
    sourceLabel: "Official NSFAS appeals page",
    sourceUrl: "https://www.nsfas.org.za/content/appeals.html",
  },
]

export const HOME_NOTICES: HomeNotice[] = OFFICIAL_NOTICES
