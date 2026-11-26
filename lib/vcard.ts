// lib/vcard.ts
// ─────────────────────────────────────────────────────────────────────────
// Shared vCard serialisation + download so every .vcf export uses the
// same escaping, DOM attachment and object-URL cleanup.
// ─────────────────────────────────────────────────────────────────────────

export function downloadVCard(filename: string, lines: string[]) {
  const vcard = ["BEGIN:VCARD", "VERSION:3.0", ...lines, "END:VCARD"].join("\r\n")

  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename

  // Attach before clicking: some browsers silently ignore downloads from a
  // detached anchor. Revoke on a short delay so the download can start first.
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
