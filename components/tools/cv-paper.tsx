// components/tools/cv-paper.tsx
"use client"

import Image from "next/image"
import type { CSSProperties, ReactNode } from "react"
import { formatPickerValue } from "./date-picker"

export type CvStyle = "traditional" | "modern"
export type CvRegion = "sa" | "intl"

export type CvRole = { id: number; title: string; company: string; employmentType: string; startDate: string; endDate: string; current: boolean; responsibilities: string }
export type CvEducation = { id: number; type: string; qualification: string; institution: string; startDate: string; endDate: string; current: boolean; notes: string }
export type CvReferee = { id: number; name: string; position: string; phone: string; email: string }
export type CvLanguage = { name: string; level: string }

export type CvData = {
  style: CvStyle
  region: CvRegion
  fullName: string
  professionalTitle: string
  phone: string
  email: string
  city: string
  province: string
  country: string
  website: string
  profile: string
  idNumber: string
  dateOfBirth: string
  nationality: string
  maritalStatus: string
  driverLicense: string
  photo: string | null
  noExperience: boolean
  roles: CvRole[]
  education: CvEducation[]
  skills: string[]
  languages: CvLanguage[]
  certifications: string[]
  refsOnRequest: boolean
  referees: CvReferee[]
}

export const newRole = (id: number): CvRole => ({ id, title: "", company: "", employmentType: "", startDate: "", endDate: "", current: false, responsibilities: "" })
export const newEducation = (id: number): CvEducation => ({ id, type: "", qualification: "", institution: "", startDate: "", endDate: "", current: false, notes: "" })
export const newReferee = (id: number): CvReferee => ({ id, name: "", position: "", phone: "", email: "" })

export const EMPTY_CV: CvData = {
  style: "traditional",
  region: "sa",
  fullName: "",
  professionalTitle: "",
  phone: "",
  email: "",
  city: "",
  province: "",
  country: "",
  website: "",
  profile: "",
  idNumber: "",
  dateOfBirth: "",
  nationality: "",
  maritalStatus: "",
  driverLicense: "",
  photo: null,
  noExperience: false,
  roles: [newRole(1)],
  education: [newEducation(1)],
  skills: [],
  languages: [],
  certifications: [],
  refsOnRequest: true,
  referees: [],
}

export const PROVINCES = ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape"]

export function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean)
}

export function dateRange(start: string, end: string, current: boolean, currentLabel = "Present"): string {
  const from = formatPickerValue(start, "month")
  const to = current ? currentLabel : formatPickerValue(end, "month")
  if (from && to) return `${from} — ${to}`
  return from || to
}

export function contactItems(data: CvData): string[] {
  const place = [data.city, data.region === "sa" ? data.province : data.country].filter(Boolean).join(", ")
  return [data.phone, data.email, place, data.website].filter(Boolean)
}

export function personalDetails(data: CvData): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = []
  if (data.region === "sa") {
    if (data.idNumber.trim()) rows.push({ label: "ID number", value: data.idNumber.trim() })
    if (data.dateOfBirth) rows.push({ label: "Date of birth", value: formatPickerValue(data.dateOfBirth, "day") })
    if (data.nationality.trim()) rows.push({ label: "Nationality", value: data.nationality.trim() })
    if (data.maritalStatus) rows.push({ label: "Marital status", value: data.maritalStatus })
  }
  if (data.driverLicense) rows.push({ label: "Driver's licence", value: data.driverLicense })
  return rows
}

const roleHasContent = (role: CvRole) => Boolean(role.title.trim() || role.company.trim() || role.responsibilities.trim())
const educationHasContent = (item: CvEducation) => Boolean(item.qualification.trim() || item.institution.trim() || item.type)

const INK = "#10211F"
const TEAL = "#14544F"
const MINT = "#D6EBE6"
const MUTED = "#4B5D5A"
const GHOST = "#9AA8A5"
const RULE = "#DCE7E4"
const SERIF = 'Georgia, "Times New Roman", serif'
const SANS = 'var(--font-dm-sans), "DM Sans", system-ui, sans-serif'

function SectionTitle({ children, centered = false }: { children: ReactNode; centered?: boolean }) {
  return (
    <div style={{ color: TEAL, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: centered ? "center" : "left", marginBottom: 6 }}>
      {children}
    </div>
  )
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 6, marginTop: 2 }}>
      <span style={{ color: TEAL }}>•</span>
      <span style={{ minWidth: 0 }}>{children}</span>
    </div>
  )
}

function Block({ children, centered = false, last = false }: { children: ReactNode; centered?: boolean; last?: boolean }) {
  return <div style={{ marginTop: 16, paddingTop: centered ? 14 : 0, borderTop: centered && !last ? `1px solid ${RULE}` : undefined }}>{children}</div>
}

function Experience({ data, centered }: { data: CvData; centered: boolean }) {
  const roles = data.roles.filter(roleHasContent)
  if (data.noExperience || roles.length === 0) return null
  return (
    <Block centered={centered}>
      <SectionTitle centered={centered}>Experience</SectionTitle>
      {roles.map((role) => (
        <div key={role.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 11.5 }}>{role.title || "Job title"}</div>
            <div style={{ color: TEAL, fontSize: 9.5, fontWeight: 600, whiteSpace: "nowrap" }}>{dateRange(role.startDate, role.endDate, role.current)}</div>
          </div>
          <div style={{ color: MUTED }}>{[role.company, role.employmentType].filter(Boolean).join(" • ")}</div>
          {splitLines(role.responsibilities).map((line, index) => <Bullet key={index}>{line}</Bullet>)}
        </div>
      ))}
    </Block>
  )
}

function Education({ data, centered }: { data: CvData; centered: boolean }) {
  const items = data.education.filter(educationHasContent)
  if (items.length === 0) return null
  return (
    <Block centered={centered}>
      <SectionTitle centered={centered}>Education</SectionTitle>
      {items.map((item) => (
        <div key={item.id} style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 11.5 }}>{item.qualification || item.type}</div>
            <div style={{ color: TEAL, fontSize: 9.5, fontWeight: 600, whiteSpace: "nowrap" }}>{dateRange(item.startDate, item.endDate, item.current, "Studying")}</div>
          </div>
          <div style={{ color: MUTED }}>{[item.institution, item.qualification ? item.type : ""].filter(Boolean).join(" • ")}</div>
          {item.notes.trim() && <div style={{ marginTop: 2 }}>{item.notes.trim()}</div>}
        </div>
      ))}
    </Block>
  )
}

function Certifications({ data, centered }: { data: CvData; centered: boolean }) {
  if (data.certifications.length === 0) return null
  return (
    <Block centered={centered}>
      <SectionTitle centered={centered}>Certifications</SectionTitle>
      {data.certifications.map((item, index) => <Bullet key={`${item}-${index}`}>{item}</Bullet>)}
    </Block>
  )
}

function References({ data, centered }: { data: CvData; centered: boolean }) {
  return (
    <Block centered={centered} last>
      <SectionTitle centered={centered}>References</SectionTitle>
      {data.refsOnRequest ? (
        <div style={{ color: MUTED, textAlign: centered ? "center" : "left" }}>References available on request</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          {data.referees.filter((ref) => ref.name.trim()).map((ref) => (
            <div key={ref.id}>
              <div style={{ fontWeight: 700 }}>{ref.name}</div>
              {ref.position && <div style={{ color: MUTED }}>{ref.position}</div>}
              <div style={{ color: MUTED }}>{[ref.phone, ref.email].filter(Boolean).join(" • ")}</div>
            </div>
          ))}
        </div>
      )}
    </Block>
  )
}

function PhotoCircle({ src, size }: { src: string; size: number }) {
  return <Image unoptimized src={src} alt="Profile photo" width={size} height={size} style={{ width: size, height: size, objectFit: "cover", borderRadius: "50%" }} />
}

function Traditional({ data }: { data: CvData }) {
  const contact = contactItems(data)
  const details = personalDetails(data)
  const photo = data.region === "sa" ? data.photo : null
  return (
    <div style={{ padding: "34px 32px 30px" }}>
      <div style={{ textAlign: "center" }}>
        {photo && <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><PhotoCircle src={photo} size={76} /></div>}
        <div style={{ fontFamily: SERIF, fontSize: 28, lineHeight: 1.1, fontWeight: 500, color: data.fullName ? INK : GHOST }}>{data.fullName || "Your full name"}</div>
        <div style={{ marginTop: 8, color: data.professionalTitle ? TEAL : GHOST, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 10, fontWeight: 600 }}>{data.professionalTitle || "Professional title"}</div>
        <div style={{ marginTop: 10, color: contact.length ? MUTED : GHOST, fontSize: 10 }}>{contact.length ? contact.join("  •  ") : "Phone  •  Email  •  Town or city"}</div>
      </div>
      <div style={{ marginTop: 18, borderRadius: 14, background: MINT, padding: "14px 18px" }}>
        <SectionTitle centered>Profile</SectionTitle>
        <div style={{ color: data.profile ? INK : GHOST, whiteSpace: "pre-line" }}>{data.profile || "Your short introduction will appear here."}</div>
      </div>
      <Experience data={data} centered />
      <Education data={data} centered />
      {data.skills.length > 0 && (
        <Block centered>
          <SectionTitle centered>Skills</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 5 }}>
            {data.skills.map((skill) => (
              <span key={skill} style={{ background: TEAL, color: "#FFFFFF", borderRadius: 999, padding: "3px 10px", fontSize: 9.5, fontWeight: 600 }}>{skill}</span>
            ))}
          </div>
        </Block>
      )}
      <Certifications data={data} centered />
      {data.languages.length > 0 && (
        <Block centered>
          <SectionTitle centered>Languages</SectionTitle>
          <div style={{ textAlign: "center" }}>{data.languages.map((item) => (item.level ? `${item.name} — ${item.level}` : item.name)).join("   •   ")}</div>
        </Block>
      )}
      {details.length > 0 && (
        <Block centered>
          <SectionTitle centered>Personal details</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 16px" }}>
            {details.map((row) => (
              <div key={row.label}><span style={{ color: MUTED }}>{row.label}: </span><span style={{ fontWeight: 600 }}>{row.value}</span></div>
            ))}
          </div>
        </Block>
      )}
      <References data={data} centered />
    </div>
  )
}

function ModernSidebar({ data }: { data: CvData }) {
  const contact = contactItems(data)
  const details = personalDetails(data)
  const photo = data.region === "sa" ? data.photo : null
  return (
    <div style={{ background: MINT, padding: "30px 14px" }}>
      {photo && <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><PhotoCircle src={photo} size={72} /></div>}
      <SectionTitle>Contact</SectionTitle>
      {contact.length ? contact.map((item) => <div key={item} style={{ marginBottom: 4 }}>{item}</div>) : <div style={{ color: GHOST }}>Phone, email and town</div>}
      {details.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionTitle>Personal details</SectionTitle>
          {details.map((row) => (
            <div key={row.label} style={{ marginBottom: 5 }}>
              <div style={{ color: MUTED, fontSize: 9 }}>{row.label}</div>
              <div style={{ fontWeight: 600 }}>{row.value}</div>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionTitle>Skills</SectionTitle>
          {data.skills.map((skill) => <Bullet key={skill}>{skill}</Bullet>)}
        </div>
      )}
      {data.languages.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <SectionTitle>Languages</SectionTitle>
          {data.languages.map((item) => (
            <div key={item.name} style={{ marginBottom: 4 }}>
              <span style={{ fontWeight: 600 }}>{item.name}</span>
              {item.level && <span style={{ color: MUTED }}> — {item.level}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ModernMain({ data }: { data: CvData }) {
  return (
    <div style={{ padding: "30px 20px 28px" }}>
      <div style={{ fontFamily: SERIF, fontSize: 25, lineHeight: 1.1, fontWeight: 500, color: data.fullName ? INK : GHOST }}>{data.fullName || "Your full name"}</div>
      <div style={{ marginTop: 7, color: data.professionalTitle ? TEAL : GHOST, letterSpacing: "0.18em", textTransform: "uppercase", fontSize: 9.5, fontWeight: 600 }}>{data.professionalTitle || "Professional title"}</div>
      <div style={{ marginTop: 16 }}>
        <SectionTitle>Profile</SectionTitle>
        <div style={{ color: data.profile ? INK : GHOST, whiteSpace: "pre-line" }}>{data.profile || "Your short introduction will appear here."}</div>
      </div>
      <Experience data={data} centered={false} />
      <Education data={data} centered={false} />
      <Certifications data={data} centered={false} />
      <References data={data} centered={false} />
    </div>
  )
}

export function CvPaper({ data }: { data: CvData }) {
  const modern = data.style === "modern"
  const base: CSSProperties = {
    width: "100%",
    maxWidth: 620,
    margin: "0 auto",
    aspectRatio: "210 / 297",
    boxSizing: "border-box",
    background: "#FFFFFF",
    color: INK,
    fontFamily: SANS,
    fontSize: 10.5,
    lineHeight: 1.5,
    overflowWrap: "anywhere",
    textAlign: "left",
    boxShadow: "0 18px 42px -24px rgba(15,23,42,.6)",
  }
  if (modern) {
    return (
      <div style={{ ...base, display: "grid", gridTemplateColumns: "34% 1fr" }}>
        <ModernSidebar data={data} />
        <ModernMain data={data} />
      </div>
    )
  }
  return (
    <div style={base}>
      <Traditional data={data} />
    </div>
  )
}
