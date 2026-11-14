"use client"

import { Bell } from "@phosphor-icons/react"

export function AnnouncementIconChip({ unread = true }: { unread?: boolean }) {
  return (
    <span className="relative inline-flex size-11 items-center justify-center rounded-[14px] text-foreground transition-colors">
      <Bell size={22} weight="fill" aria-hidden="true" />
      {unread && (
        <span
          className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-red-500 ring-2 ring-card"
          aria-hidden="true"
        />
      )}
    </span>
  )
}
