import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "CV Writing / CV Typing — ApexBytesHub",
  description: "Enter your details and create a formatted CV with ApexBytesHub's free CV tool.",
}

// CV writing tool route.
export default function CvWritingPage() {
  return <ToolForm mode="cv" />
}
