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
          "abh-reference-search h-[54px] min-h-[54px] overflow-hidden rounded-full !border !border-border/70 !bg-card/90 transition-[width,background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          expanded ? "w-full !px-3" : "mx-auto w-[54px] !gap-0 !px-0 justify-center",
        )}
      >
        <button
          type="button"
          onClick={toggleExpanded}
          aria-label={expanded ? `Close ${label.toLowerCase()} search` : label}
          aria-expanded={expanded}
          aria-controls={id}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
            "abh-search-input min-w-0 transition-[opacity] duration-200 motion-reduce:transition-none",
            expanded ? "!w-auto flex-1 opacity-100" : "pointer-events-none !w-0 !flex-none opacity-0",
          )}
        />
        {expanded && value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Broom size={15} weight="regular" aria-hidden="true" />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}
