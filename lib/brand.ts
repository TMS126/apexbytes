// lib/brand.ts — full file, paste over the current one
/**
 * ────────────────────────────────────────────────────────────────────────────
 * APEXBYTES HUB — CORE BUSINESS LAYER
 * lib/brand.ts
 * ────────────────────────────────────────────────────────────────────────────
 */

export const TOKEN = {
  brandBlue: "var(--brand-blue)",
  brandOrange: "var(--brand-orange)",
  brandGreen: "var(--brand-green)",
  warningBg: "var(--brand-warning-bg)",
  errorBg: "var(--brand-error-bg)",
  errorText: "var(--brand-error-text)",
  onBrandBlue: "var(--on-brand-blue)",
  onBrandOrange: "var(--on-brand-orange)",
  onBrandGreen: "var(--on-brand-green)",
  onBrandTeal: "var(--on-brand-teal)",
  onWhatsapp: "var(--on-whatsapp)",
  onWhatsappAccessible: "var(--on-whatsapp-accessible)",
  onPastel: "var(--on-pastel)",
  onNeutralDark: "var(--on-neutral-dark)",
  onDestructive: "var(--on-destructive)",
  blueText: "var(--brand-blue-text)",
  orangeText: "var(--brand-orange-text)",
  greenText: "var(--brand-green-text)",
  white: "var(--brand-white)",
  neutral400: "var(--brand-neutral-400)",
  neutral500: "var(--brand-neutral-500)",
} as const

export const HEX = {
  light: {
    page: "#F1F1EC", card: "#E8E8E2",
    blue: "#1E6FA8", blueMid: "#15537D", blueDark: "#0F3F66",
    green: "#4A8011", greenDeep: "#2F5E0B",
    orange: "#FA5215", orangeDark: "#B06225", orangeBrown: "#8D4D1F",
    teal: "#3E7473", tealDark: "#2C5E60", tealLight: "#D3E9E5",
    warningBg: "#A84516",
    lightBlue: "#A9D6F2", lightGreen: "#CDEB9F", lightOrange: "#F9D1B0",
    dark100: "#25283E", dark200: "#43455A", techGreyDark: "#B8CCE0",
  },
  dark: {
    page: "#25283E", card: "#2D314B",
    blue: "#A9D6F2", blueMid: "#D9EEFA", blueDark: "#EEF8FD",
    green: "#CDEB9F", greenDeep: "#E5F6C9",
    orange: "#FF9B73", orangeDark: "#F9D1B0", orangeBrown: "#FFE5D3",
    teal: "#9AD4CE", tealDark: "#BCE5E0", tealLight: "#284947",
    warningBg: "#E08A64",
    lightBlue: "#D9EEFA", lightGreen: "#E5F6C9", lightOrange: "#FFE5D3",
    dark100: "#25283E", dark200: "#43455A", techGreyDark: "#B8CCE0",
  },
  neutral100: "#E8E8E2", neutral200: "#ECECE7", neutral300: "#D5D5CE",
  neutral400: "#858581", neutral500: "#62625F",
  white: "#FFFFFF",
  whatsapp: "#25D366", whatsappDark: "#1ebe5a",
  whatsappAccessible: "#178540", whatsappAccessibleDark: "#125F2F",
  whatsappText: "#0f172a",
} as const

export function pickHex<K extends keyof typeof HEX.light>(role: K, isDark: boolean): string {
  return isDark ? HEX.dark[role] : HEX.light[role]
}

export const BRAND = {
  green: "var(--brand-green)",
  orange: "var(--brand-orange)",
  lightBlue: "var(--brand-light-blue)",
  lightGreen: "var(--brand-light-green)",
  lightOrange: "var(--brand-light-orange)",
  blue: "var(--brand-blue)",
  blueMid: "var(--brand-blue-mid)",
  blueDark: "var(--brand-blue-dark)",
  teal: "var(--brand-teal)",
  tealDark: "var(--brand-teal-dark)",
  tealLight: "var(--brand-teal-light)",
  greenDark: "var(--brand-green-dark)",
  greenDeep: "var(--brand-green-deep)",
  orangeDark: "var(--brand-orange-dark)",
  orangeBrown: "var(--brand-orange-brown)",
  neutral100: "var(--brand-neutral-100)",
  neutral200: "var(--brand-neutral-200)",
  neutral300: "var(--brand-neutral-300)",
  neutral400: "var(--brand-neutral-400)",
  neutral500: "var(--brand-neutral-500)",
  dark100: "var(--brand-dark-100)",
  dark200: "var(--brand-dark-200)",
  techGreyDark: "var(--brand-tech-grey-dark)",
  white: "var(--brand-white)",
  whatsapp: "var(--brand-whatsapp)",
  whatsappDark: "var(--brand-whatsapp-dark)",
  whatsappAccessible: "var(--brand-whatsapp-accessible)",
  whatsappAccessibleDark: "var(--brand-whatsapp-accessible-dark)",
  whatsappText: "var(--brand-whatsapp-text)",
  adobePdfRed: "var(--brand-adobe-pdf-red)",
} as const

export const THEME_BG = {
  light: { page: "var(--background)", card: "var(--card)" },
  dark: { page: "var(--background)", card: "var(--card)" },
} as const

export const THEME_HEX = {
  light: { page: HEX.light.page, card: HEX.light.card },
  dark: { page: HEX.dark.page, card: HEX.dark.card },
} as const

export const HUB_COLORS = {
  print: {
    primary: "var(--hub-print-primary)", light: "var(--hub-print-light)",
    gradient: "linear-gradient(135deg, var(--hub-print-primary) 0%, var(--brand-blue-mid) 100%)",
    tagBg: "var(--hub-tag-bg-light)", tagText: "var(--hub-tag-text-light)", tagBgDark: "var(--hub-print-tag-bg-dark)", tagTextDark: "var(--hub-tag-text-dark)",
    accentLight: "var(--hub-print-primary)", accentDark: "var(--hub-print-light)",
  },
  doc: {
    primary: "var(--hub-doc-primary)", light: "var(--hub-doc-light)",
    gradient: "linear-gradient(135deg, var(--brand-green-deep) 0%, var(--hub-doc-primary) 100%)",
    tagBg: "var(--hub-tag-bg-light)", tagText: "var(--hub-tag-text-light)", tagBgDark: "var(--hub-doc-tag-bg-dark)", tagTextDark: "var(--hub-tag-text-dark)",
    accentLight: "var(--hub-doc-primary)", accentDark: "var(--hub-doc-light)",
  },
  design: {
    primary: "var(--hub-design-primary)", light: "var(--hub-design-light)",
    gradient: "linear-gradient(135deg, var(--brand-orange-brown) 0%, var(--brand-orange) 100%)",
    tagBg: "var(--hub-tag-bg-light)", tagText: "var(--hub-tag-text-light)", tagBgDark: "var(--hub-design-tag-bg-dark)", tagTextDark: "var(--hub-tag-text-dark)",
    accentLight: "var(--hub-design-primary)", accentDark: "var(--hub-design-light)",
  },
  eservice: {
    primary: "var(--hub-eservice-primary)", light: "var(--hub-eservice-light)",
    gradient: "linear-gradient(135deg, var(--hub-eservice-primary) 0%, var(--brand-teal-dark) 100%)",
    tagBg: "var(--hub-tag-bg-light)", tagText: "var(--hub-tag-text-light)", tagBgDark: "var(--hub-eservice-tag-bg-dark)", tagTextDark: "var(--hub-tag-text-dark)",
    accentLight: "var(--hub-eservice-primary)", accentDark: "var(--hub-eservice-light)",
  },
  tech: {
    primary: "var(--hub-tech-primary)", light: "var(--hub-tech-light)",
    gradient: "linear-gradient(135deg, var(--hub-tech-primary) 0%, var(--brand-dark-200) 100%)",
    tagBg: "var(--hub-tag-bg-light)", tagText: "var(--hub-tag-text-light)", tagBgDark: "var(--hub-tech-tag-bg-dark)", tagTextDark: "var(--hub-tag-text-dark)",
    accentLight: "var(--hub-tech-primary)", accentDark: "var(--hub-tech-light)",
  },
} as const

export const HUB_HEX_COLORS = {
  print: { primary: HEX.light.blue, light: HEX.dark.blue, tagBgDark: "#1E40AF" },
  doc: { primary: HEX.light.green, light: HEX.dark.green, tagBgDark: "#166534" },
  design: { primary: HEX.light.orangeDark, light: HEX.dark.orangeDark, tagBgDark: "#9A3412" },
  eservice: { primary: HEX.light.teal, light: HEX.dark.teal, tagBgDark: HEX.light.tealDark },
  tech: { primary: HEX.light.dark100, light: HEX.light.techGreyDark, tagBgDark: "#1F2937" },
} as const

export const OG_COLORS = {
  background: HEX.light.blueDark,
  backgroundMid: HEX.light.blueMid,
  blue: HEX.light.blue,
  green: HEX.light.green,
  orange: HEX.light.orangeDark,
  white: HEX.white,
  muted: HEX.light.lightBlue,
} as const

export const WEATHER_THEME = {
  sun: { light: "#F59E0B", dark: "#FCD34D" },
  moon: { light: "#818CF8", dark: "#A5B4FC" },
  cloud: { light: "#9CA3AF", dark: "#CBD5E1" },
  rain: { light: "#60A5FA", dark: "#93C5FD" },
  storm: { light: "#A78BFA", dark: "#C4B5FD" },
  snow: { light: "#7DD3FC", dark: "#BAE6FD" },
} as const

export const WHATSAPP_THEME = {
  header: { light: "#075E54", dark: "#1F2C34" },
  wallpaper: { light: "#E5DDD5", dark: "#0B141A" },
  bubbleIn: { light: "#FFFFFF", dark: "#202C33" },
  bubbleOut: { light: "#D9FDD3", dark: "#005C4B" },
  text: { light: "#111B21", dark: "#E9EDEF" },
  sub: { light: "#667781", dark: "#8696A0" },
  composeBar: { light: "#F0F2F5", dark: "#1F2C34" },
  composeField: { light: "#FFFFFF", dark: "#2A3942" },
  accent: { light: "#25D366", dark: "#25D366" },
  tick: { light: "#53BDEB", dark: "#53BDEB" },
  avatarBg: { light: "#E9EDEF", dark: "#2A3942" },
} as const

export const NEUTRAL_ICON_COLOR = {
  light: "var(--neutral-icon-light)",
  dark: "var(--neutral-icon-dark)",
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
  version: "2",
  message: "Upgrades rolling out — everything still works.", 
linkText: "We're live on WhatsApp", 
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
