// lib/brand.ts — full file, paste over the current one
/**
 * ────────────────────────────────────────────────────────────────────────────
 * APEXBYTES HUB — CORE BUSINESS LAYER
 * lib/brand.ts
 * ────────────────────────────────────────────────────────────────────────────
 */

export const BRAND_HEX = {
  foundation: "#25283E",
  surface: "#2D314B",
  support: "#0F8F8B",
  highlight: "#00DBF2",
  supportDark: "#0E405F",
  cta: "#FA5215",
  ctaHover: "#D23701",
  navbarOrange: "#B06225",
  navbarBlue: "#1E6FA8",
  navbarGreen: "#4A8011",
  navbarLightGreen: "#B8E880",
  lightField: "#F1F1EC",
  lightSurface: "#FFFFFF",
  textLight: "#F7F8FC",
  textDark: "#25283E",
  mutedLight: "#B9BED0",
  mutedDark: "#596174",
  whatsapp: "#25D366",
  whatsappDark: "#1EBE5A",
  whatsappAccessible: "#178540",
  whatsappAccessibleDark: "#125F2F",
  whatsappText: "#0F172A",
  adobePdfRed: "#EC1C24",
} as const

/** CSS variable references used by UI components. Keep visual decisions in BRAND_HEX. */
export const TOKEN = {
  brandBlue: "var(--brand-support)",
  brandOrange: "var(--brand-cta)",
  brandGreen: "var(--brand-support)",
  brandTeal: "var(--brand-highlight)",
  warningBg: "var(--brand-warning-bg)",
  errorBg: "var(--brand-error-bg)",
  errorText: "var(--brand-error-text)",
  onBrandBlue: "var(--on-brand-support)",
  onBrandOrange: "var(--on-brand-cta)",
  onBrandGreen: "var(--on-brand-support)",
  onBrandTeal: "var(--on-brand-highlight)",
  onWhatsapp: "var(--on-whatsapp)",
  onWhatsappAccessible: "var(--on-whatsapp-accessible)",
  onPastel: "var(--on-pastel)",
  onNeutralDark: "var(--on-neutral-dark)",
  onDestructive: "var(--on-destructive)",
  blueText: "var(--brand-support-text)",
  orangeText: "var(--brand-cta-text)",
  navbarOrangeText: "var(--brand-navbar-orange-text)",
  greenText: "var(--brand-support-text)",
  white: "var(--brand-light-surface)",
} as const

/** Compatibility map for existing component logic. New code should prefer BRAND_HEX roles. */
export const HEX = {
  light: {
    blue: BRAND_HEX.support, blueMid: BRAND_HEX.supportDark, blueDark: BRAND_HEX.supportDark,
    green: BRAND_HEX.support, greenDeep: BRAND_HEX.supportDark,
    orange: BRAND_HEX.cta, orangeDark: BRAND_HEX.ctaHover, orangeBrown: BRAND_HEX.ctaHover,
    teal: BRAND_HEX.highlight, tealDark: BRAND_HEX.supportDark, tealLight: BRAND_HEX.highlight,
    warningBg: "#9A3D16",
    lightBlue: BRAND_HEX.highlight, lightGreen: "#9DE8E5", lightOrange: "#FF9A76",
    dark100: BRAND_HEX.textDark, dark200: "#41465F", techGreyDark: BRAND_HEX.mutedLight,
  },
  dark: {
    blue: BRAND_HEX.support, blueMid: BRAND_HEX.supportDark, blueDark: BRAND_HEX.supportDark,
    green: BRAND_HEX.support, greenDeep: BRAND_HEX.supportDark,
    orange: BRAND_HEX.cta, orangeDark: BRAND_HEX.ctaHover, orangeBrown: BRAND_HEX.ctaHover,
    teal: BRAND_HEX.highlight, tealDark: BRAND_HEX.supportDark, tealLight: BRAND_HEX.highlight,
    warningBg: "#7F3218",
    lightBlue: BRAND_HEX.highlight, lightGreen: "#9DE8E5", lightOrange: "#FF9A76",
    dark100: BRAND_HEX.textLight, dark200: "#DDE1EF", techGreyDark: BRAND_HEX.mutedLight,
  },
  neutral100: "#E8E9E2", neutral200: BRAND_HEX.lightField, neutral300: "#D5D6CE",
  neutral400: "#8B90A0", neutral500: "#62697A", white: BRAND_HEX.lightSurface,
  whatsapp: BRAND_HEX.whatsapp, whatsappDark: BRAND_HEX.whatsappDark,
  whatsappAccessible: BRAND_HEX.whatsappAccessible, whatsappAccessibleDark: BRAND_HEX.whatsappAccessibleDark,
  whatsappText: BRAND_HEX.whatsappText,
} as const

export function pickHex<K extends keyof typeof HEX.light>(role: K, isDark: boolean): string {
  return isDark ? HEX.dark[role] : HEX.light[role]
}

export const BRAND = {
  green: BRAND_HEX.support, orange: BRAND_HEX.cta, lightBlue: BRAND_HEX.highlight,
  navbarOrange: BRAND_HEX.navbarOrange, navbarBlue: BRAND_HEX.navbarBlue, navbarGreen: BRAND_HEX.navbarGreen, navbarLightGreen: BRAND_HEX.navbarLightGreen,
  lightGreen: "#9DE8E5", lightOrange: "#FF9A76", blue: BRAND_HEX.support,
  blueMid: BRAND_HEX.supportDark, blueDark: BRAND_HEX.supportDark, teal: BRAND_HEX.highlight,
  tealDark: BRAND_HEX.supportDark, tealLight: BRAND_HEX.highlight, greenDark: BRAND_HEX.supportDark,
  greenDeep: BRAND_HEX.supportDark, orangeDark: BRAND_HEX.ctaHover, orangeBrown: BRAND_HEX.ctaHover,
  neutral100: HEX.neutral100, neutral200: HEX.neutral200, neutral300: HEX.neutral300,
  neutral400: HEX.neutral400, neutral500: HEX.neutral500, dark100: BRAND_HEX.textDark,
  dark200: HEX.light.dark200, techGreyDark: BRAND_HEX.mutedLight, white: BRAND_HEX.lightSurface,
  whatsapp: BRAND_HEX.whatsapp, whatsappDark: BRAND_HEX.whatsappDark,
  whatsappAccessible: BRAND_HEX.whatsappAccessible, whatsappAccessibleDark: BRAND_HEX.whatsappAccessibleDark,
  whatsappText: BRAND_HEX.whatsappText, adobePdfRed: BRAND_HEX.adobePdfRed,
} as const

export const THEME_BG = {
  light: { page: BRAND_HEX.lightField, card: BRAND_HEX.lightSurface },
  dark: { page: BRAND_HEX.foundation, card: BRAND_HEX.surface },
} as const

export const HUB_COLORS = {
  print: {
    primary: BRAND_HEX.support, light: BRAND_HEX.highlight,
    gradient: `linear-gradient(135deg, ${BRAND_HEX.support} 0%, ${BRAND_HEX.supportDark} 100%)`,
    tagBg: 'transparent', tagText: BRAND_HEX.supportDark, tagBgDark: BRAND_HEX.supportDark, tagTextDark: BRAND_HEX.highlight,
    accentLight: BRAND_HEX.support, accentDark: BRAND_HEX.highlight,
  },
  doc: {
    primary: BRAND_HEX.support, light: BRAND_HEX.highlight,
    gradient: `linear-gradient(135deg, ${BRAND_HEX.supportDark} 0%, ${BRAND_HEX.support} 100%)`,
    tagBg: 'transparent', tagText: BRAND_HEX.supportDark, tagBgDark: BRAND_HEX.supportDark, tagTextDark: BRAND_HEX.highlight,
    accentLight: BRAND_HEX.support, accentDark: BRAND_HEX.highlight,
  },
  design: {
    primary: BRAND_HEX.cta, light: BRAND_HEX.cta,
    gradient: `linear-gradient(135deg, ${BRAND_HEX.ctaHover} 0%, ${BRAND_HEX.cta} 100%)`,
    tagBg: 'transparent', tagText: BRAND_HEX.ctaHover, tagBgDark: BRAND_HEX.ctaHover, tagTextDark: BRAND_HEX.lightSurface,
    accentLight: BRAND_HEX.cta, accentDark: "#FF9A76",
  },
  eservice: {
    primary: BRAND_HEX.highlight, light: BRAND_HEX.highlight,
    gradient: `linear-gradient(135deg, ${BRAND_HEX.supportDark} 0%, ${BRAND_HEX.support} 100%)`,
    tagBg: 'transparent', tagText: BRAND_HEX.supportDark, tagBgDark: BRAND_HEX.supportDark, tagTextDark: BRAND_HEX.highlight,
    accentLight: BRAND_HEX.support, accentDark: BRAND_HEX.highlight,
  },
  tech: {
    primary: BRAND_HEX.supportDark, light: BRAND_HEX.highlight,
    gradient: `linear-gradient(135deg, ${BRAND_HEX.foundation} 0%, ${BRAND_HEX.supportDark} 100%)`,
    tagBg: 'transparent', tagText: BRAND_HEX.supportDark, tagBgDark: BRAND_HEX.supportDark, tagTextDark: BRAND_HEX.highlight,
    accentLight: BRAND_HEX.supportDark, accentDark: BRAND_HEX.highlight,
  },
} as const

export const NEUTRAL_ICON_COLOR = {
  light: BRAND.dark100,
  dark: BRAND.techGreyDark,
} as const

export const BIZ = {
  name: "ApexbytesHub",
  tagline: "Your local tech & print partner.",
  location: "Kgotsong, Bothaville",
  phone: "075 333 8260",
  phoneE164: "+27753338260",
  email: "apexbytesza@gmail.com",
  address: "5878 Mpumalanga Section, Kgotsong, Bothaville",
  addressFull: "5878 Mpumalanga Section, Kgotsong, Bothaville, Free State, 9660",
  lat: -27.3790123,
  lng: 26.6599691,
  mapsUrl: "https://maps.app.goo.gl/v25Le9SfmCBfTh616?g_st=ac",
  founder: "Theji Meje",
  year: "2026",
  yearFounded: "2023",
  hubCount: 5,
  serviceCount: "70+",
} as const

export const waLink = (message: string) =>
  `https://wa.me/${BIZ.phoneE164.replace("+", "")}?text=${encodeURIComponent(message)}`

export const WA = {
  general: waLink(`Hi ${BIZ.name}! I'm interested in your services. Can you tell me more?`),
  print: waLink(`Hi ${BIZ.name}! I need printing services. Can you help?`),
  doc: waLink(`Hi ${BIZ.name}! I need help with a document or CV. What do I need to bring?`),
  design: waLink(`Hi ${BIZ.name}! I need design work done for my business. Can we discuss?`),
  eservice: waLink(`Hi ${BIZ.name}! I need help with an online government application. Can I come in?`),
  tech: waLink(`Hi ${BIZ.name}! I need to bring my PC in for repairs or setup. Are you available?`),
  gallery: waLink(`Hi ${BIZ.name}! I saw your portfolio and I'd like to enquire about a service.`),
  contact: waLink(`Hi ${BIZ.name}! I'd like to get in touch.`),
} as const

export const MAINTENANCE_BANNER = {
  active: true,
  version: "1",
  message: "We're upgrading our website behind the scenes. Some features may briefly change.",
  linkText: "Message us on WhatsApp",
  linkHref: WA.general,
} as const

export const HOURS = {
  printAndDoc: {
    label: "Print Hub · Document Hub",
    hours: "Mon – Sun · 07:00 – 20:00",
    note: "Open on Public Holidays",
    open: true,
  },
  techDesignEservice: {
    label: "Tech Hub · Design Hub · E-Service Hub",
    lines: ["Mon – Fri · 09:00 – 17:00", "Sat · 09:00 – 12:00"],
    note: "Sun & Public Holidays · Closed",
    open: false,
  },
  responseTime: "We typically reply within 15 minutes during business hours.",
} as const

export type HubKey = "print" | "doc" | "design" | "eservice" | "tech"

export const HUB_NAMES: Record<HubKey, string> = {
  print: "Print Hub",
  doc: "Document Hub",
  design: "Design Hub",
  eservice: "E-Service Hub",
  tech: "Tech Hub",
} as const

export type NavItem = {
  id: string
  label: string
  path: string
  isCta?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "gallery", label: "Gallery", path: "/gallery" },
  { id: "pricing", label: "Pricing", path: "/pricing" },
  { id: "about", label: "About", path: "/about" },
  { id: "tools", label: "Tools", path: "/tools" },
  { id: "contact", label: "Contact", path: "/contact", isCta: true },
] as const

export const MARQUEE_ITEMS = [
  "Print & Copy While You Wait",
  "CVs That Help You Get Hired",
  "Document Typing & Fixing",
  "Scan & Laminate Important Papers",
  "Logo Design, Flyers & Business Cards",
  "Social Media Designs for Your Business",
  "Invitations for Any Event",
  "SASSA, SARS & Online Applications Made Easy",
  "Job, NSFAS & Bursary Applications Done For You",
  "Email & Online Help",
  "Computer Setup, Software Installation & Tech Support",
] as const

export const STRIP_ITEMS = [
  { iconName: "Rocket", title: "Fast Turnaround", desc: "No long waits, quick service" },
  { iconName: "CurrencyDollar", title: "Affordable Rates", desc: "Fair pricing for everyone" },
  { iconName: "HandHeart", title: "Friendly Help", desc: "We explain, never judge" },
  { iconName: "MapPin", title: "Walk-ins Welcome", desc: `${BIZ.location}` },
] as const

export const GALLERY_CATEGORIES = [
  { id: "all", label: "All hubs" },
  { id: "print", label: "Print hub" },
  { id: "doc", label: "Document hub" },
  { id: "design", label: "Design hub" },
  { id: "eservice", label: "E-Service hub" },
  { id: "tech", label: "Tech hub" },
] as const

export const GALLERY_ALERT =
  "We are currently curating our gallery to feature our latest local business success stories. The current imagery demonstrates the visual aesthetic and service style of ApexbytesHub. Check back often for fresh project work!"

export const FAQS = [
  { question: "How do I send my files, photos, or CV information to you?", answer: "All services connect via WhatsApp where you can upload documents, notes, or images directly." },
  { question: "Where do I collect my completed documents or prints?", answer: `${BIZ.name} operates from ${BIZ.location}. We notify you when items are ready for collection.` },
  { question: "How long does it take to complete a design or document task?", answer: "Print and Document Hub tasks are same-day. Design Hub work (logos, flyers, business cards, invitations) takes 2–3 business days." },
  { question: "What are your payment terms?", answer: "Clear upfront pricing. Payment is required before or upon completion depending on service type." },
  { question: "Do you use templates for design projects?", answer: "No. All design work is custom-built using professional design tools." },
] as const

export const ABOUT_VALUES = [
  { iconName: "Target", title: "We Keep It Simple", desc: "No confusing jargon. Everything is explained clearly." },
  { iconName: "Heart", title: "Community First", desc: "We serve our neighbourhood with care and respect." },
  { iconName: "Lightning", title: "Fast & Reliable", desc: "We deliver consistently and on time." },
] as const

export const ABOUT_STANDARDS = [
  { id: 1, iconName: "Desktop", title: "Premium Vector Accuracy", description: "All design work is created professionally with no generic templates." },
  { id: 2, iconName: "Printer", title: "Megatank Economy Prints", description: "High-quality printing using continuous ink systems for affordability." },
  { id: 3, iconName: "DeviceMobile", title: "Direct WhatsApp Pipeline", description: "Fast communication and order handling through WhatsApp." },
] as const

export const CONTACT_LINKS = [
  { title: "WhatsApp Us", value: BIZ.phone, href: WA.contact, dot: BRAND.whatsapp },
  { title: "Call Us", value: BIZ.phone, href: `tel:${BIZ.phoneE164}`, dot: BRAND.blue },
  { title: "Email Us", value: BIZ.email, href: `mailto:${BIZ.email}`, dot: BRAND.orange },
  { title: "Visit Us", value: BIZ.addressFull, href: BIZ.mapsUrl, dotLight: BRAND.blueDark, dotDark: BRAND.lightBlue },
] as const

export const FOOTER_NAV = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Gallery", path: "/gallery" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
  { label: "Tools", path: "/tools" },
  { label: "Contact", path: "/contact" },
] as const 
