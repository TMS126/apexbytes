"use client"

import { useRef, type ReactNode } from "react"
import { Broom, MagnifyingGlass } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

interface ExpandingSearchProps {
  id: string
  label: string
  placeholder: string
  value: string
  expanded: boolean
  onChange: (value: string) => void
  onExpandedChange: (expanded: boolean) => void
  onFocus?: () => void
  className?: string
  children?: ReactNode
}

export function ExpandingSearch({
  id,
  label,
  placeholder,
  value,
  expanded,
  onChange,
  onExpandedChange,
  onFocus,
  className,
  children,
}: ExpandingSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const toggleExpanded = () => {
    const nextExpanded = !expanded
    onExpandedChange(nextExpanded)
    if (nextExpanded) {
      requestAnimationFrame(() => inputRef.current?.focus())
    } else {
      inputRef.current?.blur()
    }
  }

  return (
    <div
      className={cn("relative mx-auto w-full max-w-[300px]", className)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onExpandedChange(false)
        }
      }}
    >
      <div
        data-hover-border=""
        className={cn(
          "flex h-12 min-h-12 items-center overflow-hidden border-b-2 border-[var(--line-rule-soft)] bg-transparent transition-[width,border-color] duration-200 ease-out motion-reduce:transition-none",
          expanded ? "w-full gap-2 px-1 focus-within:border-[var(--line-rule)]" : "mx-auto w-10 justify-center",
        )}
      >
        <button
          type="button"
          onClick={toggleExpanded}
          aria-label={expanded ? `Close ${label.toLowerCase()} search` : label}
          aria-expanded={expanded}
          aria-controls={id}
          className="flex size-10 shrink-0 items-center justify-center rounded-[14px] text-muted-foreground transition-[transform,filter,color] hover:-translate-y-0.5 hover:text-foreground hover:drop-shadow-[0_4px_7px_color-mix(in_srgb,var(--foreground)_26%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <MagnifyingGlass size={18} weight="regular" aria-hidden="true" />
        </button>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
          ref={inputRef}
          id={id}
          type="text"
          autoComplete="off"
          disabled={!expanded}
          tabIndex={expanded ? 0 : -1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={onFocus}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              onExpandedChange(false)
              inputRef.current?.blur()
            }
          }}
          placeholder={expanded ? placeholder : ""}
            className={cn(
            "abh-search-input min-w-0 border-0 border-b-0 bg-transparent !px-0 transition-[opacity] duration-200 motion-reduce:transition-none",
            expanded ? "!w-auto flex-1 opacity-100" : "pointer-events-none !w-0 !flex-none opacity-0",
          )}
        />
        {expanded && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="flex size-8 shrink-0 items-center justify-center rounded-[14px] text-muted-foreground transition-[transform,filter,color] hover:-translate-y-0.5 hover:text-foreground hover:drop-shadow-[0_4px_7px_color-mix(in_srgb,var(--foreground)_26%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Broom size={15} weight="regular" aria-hidden="true" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
