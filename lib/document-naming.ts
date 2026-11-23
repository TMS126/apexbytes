export type DocumentKind = "quote" | "service-agreement" | "invoice"

export const DOCUMENT_PREFIX: Record<DocumentKind, string> = {
  quote: "QUO",
  "service-agreement": "SA",
  invoice: "INV",
}

/** Stable identity used when a document is viewed in-browser. */
export function baseDocumentNumber(kind: DocumentKind, now = new Date()): string {
  const year = now.getFullYear()
  return `${DOCUMENT_PREFIX[kind]}-ABH-${year}`
}

/**
 * Allocate the next download number for this document kind on this device.
 * Storage is intentionally device-local until a server-side document register
 * exists. Viewing a document must never advance this counter.
 */
export function nextDownloadedDocumentNumber(kind: DocumentKind, now = new Date()): string {
  const year = now.getFullYear()
  const storageKey = `apexbytes-${kind}-download-seq`
  let sequence = 1

  try {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? (JSON.parse(raw) as { year?: number; sequence?: number }) : null
    if (parsed?.year === year && typeof parsed.sequence === "number") sequence = parsed.sequence + 1
    localStorage.setItem(storageKey, JSON.stringify({ year, sequence }))
  } catch {
    // Private browsing or blocked storage should never prevent a document download.
  }

  return `${baseDocumentNumber(kind, now)}-${String(sequence).padStart(3, "0")}`
}

/** @deprecated Use baseDocumentNumber or nextDownloadedDocumentNumber explicitly. */
export const nextDocumentNumber = nextDownloadedDocumentNumber

export function documentFilename(kind: DocumentKind, number: string): string {
  return `${number}.pdf`
}

export function safeDownloadName(name: string, fallback = "ApexBytesHub-file"): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+|\.+$/g, "")
  return cleaned || fallback
}
