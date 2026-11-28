"use client"

import { useMemo, useState } from "react"
import { CaretUpDown, Check } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const MAX_RESULTS = 80

type SearchableSelectProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  required?: boolean
  disabled?: boolean
  loading?: boolean
  allowCustom?: boolean
  hint?: string
  error?: string
  span2?: boolean
}

export function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  searchPlaceholder = "Type to search…",
  emptyText = "Nothing matches that search.",
  required,
  disabled,
  loading,
  allowCustom,
  hint,
  error,
  span2,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return options.slice(0, MAX_RESULTS)
    return options.filter((option) => option.toLowerCase().includes(needle)).slice(0, MAX_RESULTS)
  }, [options, query])

  const trimmedQuery = query.trim()
  const customAllowed = Boolean(
    allowCustom &&
      trimmedQuery &&
      !options.some((option) => option.toLowerCase() === trimmedQuery.toLowerCase()),
  )

  function choose(next: string) {
    const clean = next.trim()
    if (!clean) return
    onChange(clean)
    setOpen(false)
    setQuery("")
  }

  return (
    <div className={cn("cv-editor-field", span2 && "cv-editor-field--full")}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="cv-required"> *</span> : null}
      </label>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) setQuery("")
        }}
      >
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-invalid={Boolean(error)}
            data-no-lift
            disabled={disabled}
            className={cn(
              "cv-combobox-trigger",
              !value && "is-placeholder",
              error && "cv-combobox-trigger--error",
            )}
          >
            <span className="cv-combobox-value">{value || placeholder}</span>
            <CaretUpDown size={16} className="cv-combobox-caret" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          sideOffset={6}
          className="cv-combobox-popover w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command shouldFilter={false} loop>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
            />
            <CommandList id={`${id}-list`} className="max-h-[280px]">
              {loading ? (
                <div className="cv-combobox-note">Loading the list…</div>
              ) : (
                <>
                  {customAllowed ? (
                    <CommandItem
                      value={`__custom__${trimmedQuery}`}
                      onSelect={() => choose(trimmedQuery)}
                      className="cv-combobox-custom"
                    >
                      <Check size={14} aria-hidden="true" />
                      Use “{trimmedQuery}”
                    </CommandItem>
                  ) : null}
                  {filtered.map((option) => (
                    <CommandItem
                      key={option}
                      value={option}
                      onSelect={() => choose(option)}
                      className="cv-combobox-item"
                    >
                      <Check
                        size={14}
                        aria-hidden="true"
                        className={cn("cv-combobox-check", value === option ? "opacity-100" : "opacity-0")}
                      />
                      <span>{option}</span>
                    </CommandItem>
                  ))}
                  {filtered.length === 0 && !customAllowed ? (
                    <div className="cv-combobox-note">{emptyText}</div>
                  ) : null}
                  {!query.trim() && options.length > MAX_RESULTS ? (
                    <div className="cv-combobox-note">
                      Showing {MAX_RESULTS} of {options.length}. Type a name to narrow the list.
                    </div>
                  ) : null}
                  {query.trim() && options.length > MAX_RESULTS && filtered.length === MAX_RESULTS ? (
                    <div className="cv-combobox-note">
                      Showing the first {MAX_RESULTS} matches. Type more letters to narrow the list.
                    </div>
                  ) : null}
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {hint ? <p className="cv-field-help">{hint}</p> : null}
      {error ? <p className="cv-field-error-text">{error}</p> : null}
    </div>
  )
}
