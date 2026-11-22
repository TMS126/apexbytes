"use client"

import { Bell } from "@phosphor-icons/react"

export function AnnouncementIconChip({ unread = true }: { unread?: boolean }) {
  return (
    <span className="relative inline-flex size-11 items-center justify-center text-foreground">
      <Bell size={24} weight="regular" aria-hidden="true" />
      {unread && (
        <span
          className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-red-500 shadow-[0_2px_5px_rgba(239,68,68,.45)]"
          aria-hidden="true"
        />
      )}
    </span>
  )
}
