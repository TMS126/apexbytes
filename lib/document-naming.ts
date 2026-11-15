export type DocumentKind = "quote" | "service-agreement" | "invoice"

export const DOCUMENT_PREFIX: Record<DocumentKind, string> = {
  quote: "QUO",
  "service-agreement": "SA",
  invoice: "INV",
}

/**
 * Human-readable document numbers are intentionally stable and easy to say
 * over WhatsApp: QUO-ABH-2026-001, SA-ABH-2026-001, INV-ABH-2026-001.
 * Sequence storage is local until a server-side document register is added.
 */
export function nextDocumentNumber(kind: DocumentKind, now = new Date()): string {
  const year = now.getFullYear()
  const storageKey = `apexbytes-${kind}-seq`
  let sequence = 1

  try {
    const raw = localStorage.getItem(storageKey)
    const parsed = raw ? (JSON.parse(raw) as { year?: number; sequence?: number }) : null
    if (parsed?.year === year && typeof parsed.sequence === "number") sequence = parsed.sequence + 1
    localStorage.setItem(storageKey, JSON.stringify({ year, sequence }))
  } catch {
    // Private browsing or blocked storage should never prevent a document download.
  }

  return `${DOCUMENT_PREFIX[kind]}-ABH-${year}-${String(sequence).padStart(3, "0")}`
}

export function documentFilename(kind: DocumentKind, number: string): string {
  return `${number}.pdf`
}

export function safeDownloadName(name: string, fallback = "ApexbytesHub-file"): string {
  const cleaned = name
    .normalize("NFKD")
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+|\.+$/g, "")
  return cleaned || fallback
}
