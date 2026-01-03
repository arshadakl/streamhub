// Core Channel type for normalized IPTV data
export interface Channel {
  id: string
  name: string
  logo: string
  country: string
  languages: string[]
  categories: string[]
  streamUrl: string
  isLive: boolean
  reliabilityScore: number
}

// Country metadata
export interface Country {
  code: string
  name: string
  flag: string
  channelCount: number
}

// Language metadata
export interface Language {
  code: string
  name: string
  channelCount: number
}

// Category metadata
export interface Category {
  id: string
  name: string
  icon: string
  channelCount: number
}

// Filter state for explore page
export interface FilterState {
  countries: string[]
  languages: string[]
  categories: string[]
  search: string
}

// Stream status for error handling
export type StreamStatus =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "playing" }
  | { type: "error"; message: string; canRetry: boolean }

// API response wrapper
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}
