import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "CV Writer — ApexBytesHub",
  description: "Build and review a clear, sample-based CV with contact details, experience, skills, education, and optional supporting sections.",
}

// CV writing tool route.
export default function CvWritingPage() {
  return <ToolForm mode="cv" />
}
