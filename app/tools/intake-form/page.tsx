import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "Intake Form Filling — ApexbytesHub",
  description: "Share the details of your service request in a simple guided form.",
}

// Service intake tool route.
export default function IntakeFormPage() {
  return <ToolForm mode="intake" />
}
