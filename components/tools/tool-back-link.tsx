import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"

export function ToolBackLink() {
  return (
    <Link
      href="/tools#tool-grid"
      aria-label="Back to all tools"
      className="abh-tool-back-link mx-auto mb-8 flex min-h-10 w-fit items-center justify-center gap-2 rounded-full bg-card px-4 text-sm font-medium text-muted-foreground shadow-[var(--ui-shadow-popup)] transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ArrowLeft size={17} weight="regular" aria-hidden="true" />
      <span>Back to tools</span>
    </Link>
  )
}
