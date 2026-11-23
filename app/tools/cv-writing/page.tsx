import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "CV Writing / CV Typing — ApexBytesHub",
  description: "Build and review a modern or classic CV online with ApexBytesHub before sending it for final help.",
}

// CV writing tool route.
export default function CvWritingPage() {
  return <ToolForm mode="cv" />
}
