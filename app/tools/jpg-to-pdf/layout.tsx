// app/tools/jpg-to-pdf/layout.tsx
// The page itself is a client component, so its unique metadata lives here.
import type { Metadata } from "next"
import { pageMetadata } from "@/lib/seo"

export const metadata: Metadata = pageMetadata({
  title: "JPG to PDF",
  description: "Convert JPG, PNG or WEBP images to a single PDF in your browser — reorder, rotate and crop first, with no uploads.",
  path: "/tools/jpg-to-pdf",
})

export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  return children
}
