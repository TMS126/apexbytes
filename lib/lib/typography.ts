// lib/typography.ts
// SINGLE SOURCE OF TRUTH — type scale. Every text style in the app maps to
// one of these 10 levels. Reach for the matching .abh-* class in
// globals.css instead of raw Tailwind text-*/font-* utilities.

export const TYPE_SCALE = {
  pageTitle:     { class: "abh-page-title",     css: "font-heading font-medium text-4xl md:text-5xl tracking-tight leading-tight" },
  sectionHeading:{ class: "abh-section-heading", css: "font-heading font-medium text-2xl md:text-3xl tracking-tight leading-snug" },
  cardHeading:   { class: "abh-card-heading",    css: "font-heading font-medium text-base tracking-tight leading-snug" },
  eyebrow:       { class: "abh-eyebrow",         css: "font-heading font-medium text-xs uppercase tracking-widest" },
  body:          { class: "abh-body",            css: "font-sans font-normal text-base md:text-lg leading-relaxed" },
  muted:         { class: "abh-muted",           css: "font-sans font-normal text-sm md:text-base leading-relaxed" },
  price:         { class: "abh-price",           css: "font-heading font-medium text-[1.35rem] md:text-[1.5rem] leading-none" },
  btnLabel:      { class: "abh-btn-label",       css: "font-heading font-medium text-base tracking-wide" },
  label:         { class: "abh-label",           css: "font-sans font-medium text-sm uppercase tracking-wide" },
  statValue:     { class: "abh-stat-value",      css: "font-heading font-medium text-2xl leading-none" },
} as const

export type TypeLevel = keyof typeof TYPE_SCALE