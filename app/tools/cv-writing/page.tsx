import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"

export const metadata: Metadata = {
  title: "CV Writing / CV Typing — ApexbytesHub",
  description: "Enter your details and create a formatted CV with ApexbytesHub's free CV tool.",
}

// CV writing tool route.
export default function CvWritingPage() {
  return <ToolForm mode="cv" />
}
