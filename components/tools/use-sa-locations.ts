"use client"

import { useEffect, useState } from "react"
import { loadSchools, loadTowns } from "@/lib/data/sa-locations"

type LocationState = {
  province: string
  options: string[]
  error: string | null
}

type LocationResult = {
  options: string[]
  loading: boolean
  error: string | null
}

const EMPTY: LocationState = { province: "", options: [], error: null }

function useLocationOptions(province: string, loader: (province: string) => Promise<string[]>, errorMessage: string): LocationResult {
  const [state, setState] = useState<LocationState>(EMPTY)

  useEffect(() => {
    let active = true
    if (!province) return
    loader(province)
      .then((options) => {
        if (active) setState({ province, options, error: null })
      })
      .catch(() => {
        if (active) setState({ province, options: [], error: errorMessage })
      })
    return () => {
      active = false
    }
  }, [province, loader, errorMessage])

  const current = state.province === province
  return {
    options: current ? state.options : [],
    loading: Boolean(province) && !current,
    error: current ? state.error : null,
  }
}

export function useSaSchools(province: string): LocationResult {
  return useLocationOptions(province, loadSchools, "Could not load the school list. Type the school name instead.")
}

export function useSaTowns(province: string): LocationResult {
  return useLocationOptions(province, loadTowns, "Could not load the town list. Type the town or city instead.")
}
