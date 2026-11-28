// lib/data/sa-locations.ts
// School data source: Department of Basic Education EMIS national ordinary
// schools masterlist, 2023 release (24,941 open schools after de-duplication).
// This is a 2023 snapshot, not a live 2026 roll. Users can always type a school
// that is missing or renamed.
//
// Town data source: Wikipedia's "List of populated places in South Africa",
// cleaned of address fragments and supplemented with major towns so the city
// dropdown stays usable. It is a convenience list, not an official register;
// the custom option accepts any town or village that is missing.

export const SA_PROVINCE_FILES: Record<string, string> = {
  "Eastern Cape": "eastern-cape",
  "Free State": "free-state",
  "Gauteng": "gauteng",
  "KwaZulu-Natal": "kwazulu-natal",
  "Limpopo": "limpopo",
  "Mpumalanga": "mpumalanga",
  "Northern Cape": "northern-cape",
  "North West": "north-west",
  "Western Cape": "western-cape",
}

type RawSchool = [string, string, string, string]

const schoolCache = new Map<string, Promise<string[]>>()
const townCache = new Map<string, Promise<string[]>>()

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "force-cache" })
  if (!response.ok) throw new Error(`Could not load ${url}`)
  return response.json() as Promise<T>
}

function provinceSlug(province: string): string | undefined {
  return SA_PROVINCE_FILES[province]
}

export function loadSchools(province: string): Promise<string[]> {
  const slug = provinceSlug(province)
  if (!slug) return Promise.resolve([])
  const existing = schoolCache.get(slug)
  if (existing) return existing
  const request = fetchJson<RawSchool[]>(`/data/sa-schools/${slug}.json`).then((rows) => {
    const seen = new Set<string>()
    const options: string[] = []
    for (const [name, town] of rows) {
      const cleanName = name.trim()
      if (!cleanName) continue
      const label = town.trim() ? `${cleanName} — ${town.trim()}` : cleanName
      if (seen.has(label)) continue
      seen.add(label)
      options.push(label)
    }
    return options.sort((a, b) => a.localeCompare(b))
  })
  schoolCache.set(slug, request)
  return request
}

export function loadTowns(province: string): Promise<string[]> {
  const slug = provinceSlug(province)
  if (!slug) return Promise.resolve([])
  const existing = townCache.get(slug)
  if (existing) return existing
  const request = fetchJson<string[]>(`/data/sa-towns/${slug}.json`).then((rows) => {
    const seen = new Set<string>()
    const options: string[] = []
    for (const raw of rows) {
      const town = raw.trim()
      if (town.length < 2) continue
      if (/^[#?]/.test(town)) continue
      if (/^[^a-zA-Z]+$/.test(town)) continue
      if (/^(n\/a|none|unknown|not applicable)$/i.test(town)) continue
      const key = town.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      options.push(town)
    }
    return options.sort((a, b) => a.localeCompare(b))
  })
  townCache.set(slug, request)
  return request
}
