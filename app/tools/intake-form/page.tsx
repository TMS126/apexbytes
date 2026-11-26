import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "Intake Form",
  description: "Choose a service first, answer only the useful follow-up questions, then review and share your intake as a PDF.",
  path: "/tools/intake-form",
})

// Service intake tool route.
export default function IntakeFormPage() {
  return <ToolForm mode="intake" />
}
