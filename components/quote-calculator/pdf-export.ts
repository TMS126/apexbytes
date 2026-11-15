// components/quote-calculator/pdf-export.ts
import { BIZ } from "@/lib/brand"
import { documentFilename, nextDocumentNumber } from "@/lib/document-naming"
import { BULK_TIERS, CartItem, getEffectiveRate, isScanItem, quoteTotals } from "./lib"
import { pdfServiceName } from "./pdf-names"
/* ============================================================
   QUOTE PDF — real downloadable file (jsPDF), A4.
   Layout: brand + QUOTATION left, quote # / date / location right,
   black rule, table (Service / Qty / Rate / Line Total), Total block,
   green savings note, italic estimate note, footer with page numbers.
   ============================================================ */

type RGB = [number, number, number]

const INK: RGB = [17, 24, 39]
const SLATE_700: RGB = [51, 65, 85]
const SLATE_500: RGB = [100, 116, 139]
const SLATE_400: RGB = [148, 163, 184]
const HEAD_BG: RGB = [248, 250, 252]
const HEAD_RULE: RGB = [208, 214, 228]
const ROW_RULE: RGB = [229, 231, 235]
const GREEN_BG: RGB = [240, 253, 244]
const GREEN_LINE: RGB = [187, 247, 208]
const GREEN_TEXT: RGB = [22, 101, 52]
const BULK_FILL: RGB = [71, 85, 105]
const BULK_TEXT: RGB = [248, 250, 252]

// Page geometry (mm)
const PAGE_W = 210
const M = 14
const R = PAGE_W - M
const QTY_X = 121.3
const BULK_W = 16.5
const BULK_H = 4.8
const RATE_X = 157.8
const TOTAL_X = 192.7
const TOTAL_BLOCK_X = 124.1
const CONTENT_BOTTOM = 266
function two(n: number) {
  return String(n).padStart(2, "0")
}

export async function exportQuotePdf(cart: CartItem[], mode: "download" | "view" = "download"): Promise<void> {
  if (cart.length === 0) return

  try {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })

    const now = new Date()
    const quoteNo = nextDocumentNumber("quote", now)
    const dateStr = `${two(now.getDate())}/${two(now.getMonth() + 1)}/${now.getFullYear()}`
    const t = quoteTotals(cart)

    // ---------- header (repeated on every page) ----------
    const drawHeader = () => {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(23)
      doc.setTextColor(...INK)
      doc.text(BIZ.name, M, 25.2)

      doc.setFontSize(12.5)
      doc.setTextColor(...SLATE_500)
      doc.text("QUOTATION", M, 33, { charSpace: 0.5 })

      // right block: bold label + normal value, right-aligned
      const rightLine = (label: string, value: string, y: number) => {
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(...SLATE_700)
        const vw = doc.getTextWidth(value)
        const sw = doc.getTextWidth(" ")
        doc.text(value, R, y, { align: "right" })
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...INK)
        doc.text(label, R - vw - sw, y, { align: "right" })
      }
      rightLine("Quote #:", quoteNo, 21.3)
      rightLine("Date:", dateStr, 26.9)

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...SLATE_400)
      doc.text(BIZ.location, R, 33.8, { align: "right" })

      doc.setDrawColor(...INK)
      doc.setLineWidth(0.55)
      doc.line(M, 39.6, R, 39.6)
    }

    // ---------- table header ----------
    const drawTableHeader = (y: number) => {
      doc.setFillColor(...HEAD_BG)
      doc.rect(M, y, R - M, 10, "F")
      doc.setDrawColor(...HEAD_RULE)
      doc.setLineWidth(0.4)
      doc.line(M, y + 10, R, y + 10)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9.5)
      doc.setTextColor(...INK)
      doc.text("Service", M + 3.5, y + 6.2)
      doc.text("Qty", QTY_X, y + 6.2, { align: "center" })
      doc.text("Rate", RATE_X, y + 6.2, { align: "right" })
      doc.text("Line Total", TOTAL_X, y + 6.2, { align: "right" })
    }

    drawHeader()
    let y = 46.4
    drawTableHeader(y)
    y += 10

    // ---------- rows ----------
    for (const item of cart) {
      const qty = item.qty || 1
      const effRate = getEffectiveRate(item.id, item.name, qty, item.unitPrice)
      const label = pdfServiceName(item)
      const hasBulk = !!BULK_TIERS[item.id] || isScanItem(item.name)
      const qtyLabel = item.unit ? `${qty} ${item.unit}${qty > 1 ? "s" : ""}` : `x${qty}`

      doc.setFont("helvetica", "normal")
      doc.setFontSize(9.5)
      // Keep a little breathing room before the quantity column. The marker
      // is drawn inline after the item name rather than in a fixed lane.
      const lines = doc.splitTextToSize(label, hasBulk ? 76 : 82) as string[]
      const rowH = Math.max(11.1, 5.6 + lines.length * 4.2)

      if (y + rowH > CONTENT_BOTTOM) {
        doc.addPage()
        drawHeader()
        y = 46.4
        drawTableHeader(y)
        y += 10
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9.5)
      }

      const mid = y + rowH / 2 + 1.2
      doc.setTextColor(...SLATE_700)
      const firstBaseline = mid - ((lines.length - 1) * 4.2) / 2
      lines.forEach((ln, i) => doc.text(ln, M + 3.5, firstBaseline + i * 4.2))
      if (hasBulk) {
        const itemTextWidth = doc.getTextWidth(lines[0])
        const pillX = M + 3.5 + itemTextWidth + 2.2
        const pillY = firstBaseline - BULK_H + 1.05
        doc.setFillColor(...BULK_FILL)
        doc.roundedRect(pillX, pillY, BULK_W, BULK_H, 1.15, 1.15, "F")
        doc.setFont("helvetica", "bold")
        doc.setFontSize(6.1)
        doc.setTextColor(...BULK_TEXT)
        doc.text("BULK", pillX + BULK_W / 2, pillY + 3.35, { align: "center" })
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9.5)
        doc.setTextColor(...SLATE_700)
      }
      doc.text(qtyLabel, QTY_X, mid, { align: "center" })
      doc.text(`R${effRate}`, RATE_X, mid, { align: "right" })
      doc.text(`R${effRate * qty}`, TOTAL_X, mid, { align: "right" })

      doc.setDrawColor(...ROW_RULE)
      doc.setLineWidth(0.25)
      doc.line(M, y + rowH, R, y + rowH)
      y += rowH
    }

    // ---------- total block + notes ----------
    if (y + 46 > CONTENT_BOTTOM) {
      doc.addPage()
      drawHeader()
      y = 46.4
    }
    y += 6.1

    doc.setDrawColor(...INK)
    doc.setLineWidth(0.55)
    doc.line(TOTAL_BLOCK_X, y, R, y)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(15)
    doc.setTextColor(...INK)
    doc.text("Total", TOTAL_BLOCK_X, y + 7.4)
    doc.text(`R${t.total}`, R, y + 7.4, { align: "right" })

    let noteY = y + 20
    if (t.savings > 0) {
      const boxY = y + 15.2
      doc.setFillColor(...GREEN_BG)
      doc.setDrawColor(...GREEN_LINE)
      doc.setLineWidth(0.3)
      doc.roundedRect(M, boxY, R - M, 8.9, 1.2, 1.2, "FD")
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8.5)
      doc.setTextColor(...GREEN_TEXT)
      doc.text(`Includes R${t.savings} saved with bulk pricing.`, M + 3.5, boxY + 5.6)
      noteY = boxY + 8.9 + 9.8
    }

    doc.setFont("helvetica", "italic")
    doc.setFontSize(9)
    doc.setTextColor(...SLATE_500)
    doc.text("This quote is an estimate and may change on confirmation.", M, noteY)

    // ---------- footer on every page ----------
    const pages = doc.getNumberOfPages()
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i)
      doc.setDrawColor(...ROW_RULE)
      doc.setLineWidth(0.25)
      doc.line(M, 276.8, R, 276.8)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(8)
      doc.setTextColor(...SLATE_500)
      doc.text(`${BIZ.phone} \u2014 ${BIZ.email}`, M, 284.2)
      doc.text(`Page ${i} of ${pages}`, R, 284.2, { align: "right" })
    }

    if (mode === "view") {
      const url = URL.createObjectURL(doc.output("blob"))
      window.open(url, "_blank", "noopener,noreferrer")
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } else {
      doc.save(documentFilename("quote", quoteNo))
    }
  } catch (err) {
    console.error("Quote PDF failed:", err)
  }
      } 
