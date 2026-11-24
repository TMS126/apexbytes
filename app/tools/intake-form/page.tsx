import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "Intake Form — ApexBytesHub",
  description: "Choose a service first, answer only the useful follow-up questions, then review and share your intake as a PDF.",
}

// Service intake tool route.
export default function IntakeFormPage() {
  return <ToolForm mode="intake" />
}
