import type { Metadata } from "next"
import { ToolForm } from "@/components/tools/tool-form"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "CV Writer",
  description: "Build and review a clear, sample-based CV with contact details, experience, skills, education, and optional supporting sections.",
  path: "/tools/cv-writing",
})

// CV writing tool route.
export default function CvWritingPage() {
  return <ToolForm mode="cv" />
}
