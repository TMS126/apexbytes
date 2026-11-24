import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"

export function ToolBackLink() {
  return (
    <Link
      href="/tools#tool-grid"
      aria-label="Back to all tools"
      className="abh-tool-back-link mx-auto mb-8 inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft size={17} weight="regular" aria-hidden="true" />
      <span>Back to tools</span>
    </Link>
  )
}
