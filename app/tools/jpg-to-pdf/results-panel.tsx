// app/tools/jpg-to-pdf/results-panel.tsx
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, PaperPlaneTilt, DownloadSimple } from "@phosphor-icons/react"
import { SimpleDropdown } from "@/components/ui/simple-dropdown"
import { formatBytes } from "./utils"
import type { ConvertedFile } from "./types"

export function ResultsPanel({
  convertedFiles, sendNotice, accentColor, onSend,
}: {
  convertedFiles: ConvertedFile[]
  sendNotice: string | null
  accentColor: string
  onSend: (file: ConvertedFile) => void
}) {
  const [fileName, setFileName] = useState(convertedFiles[0]?.fileName || "")
  useEffect(() => {
    if (convertedFiles.length === 0) return
    const frame = requestAnimationFrame(() => setFileName(convertedFiles[0].fileName))
    return () => cancelAnimationFrame(frame)
  }, [convertedFiles])

  const totalActualBytes = convertedFiles.reduce((sum, f) => sum + f.blob.size, 0)

  return (
    <AnimatePresence>
      {convertedFiles.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-8 abh-card p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CheckCircle weight="fill" className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
            <span className="text-sm font-black text-green-700 dark:text-green-300">
              {convertedFiles.length} file{convertedFiles.length > 1 ? "s" : ""} converted
            </span>
          </div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mb-1">
            Actual size: {formatBytes(totalActualBytes)}
          </p>
          <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-6">
            <DownloadSimple size={13} weight="bold" aria-hidden="true" />
            Saved to your device automatically
          </div>

          {convertedFiles.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <SimpleDropdown label="File" value={fileName} accentColor={accentColor} onChange={setFileName}
                options={convertedFiles.map((f) => ({ value: f.fileName, label: `${f.fileName} · ${formatBytes(f.blob.size)}` }))} />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5 max-w-[380px] mx-auto">
            <button
              type="button"
              onClick={() => onSend(convertedFiles.find((f) => f.fileName === fileName) || convertedFiles[0])}
              className="col-span-2 flex items-center justify-center gap-2 rounded-[12px] py-3 px-4 text-sm font-black text-white transition-transform active:scale-[0.98]"
              style={{ backgroundColor: accentColor }}
            >
              <PaperPlaneTilt weight="fill" className="w-4 h-4" aria-hidden="true" />
              Send to ApexbytesHub
            </button>
          </div>

          {sendNotice && <p className="mt-4 text-sm font-medium text-muted-foreground dark:text-muted-foreground" aria-live="polite">{sendNotice}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
