// IPTV-org API Integration
// Fetches real channel data from https://iptv-org.github.io/api/

import { API_ENDPOINTS } from "./config"

// Raw API types from IPTV-org
export interface RawChannel {
  id: string
  name: string
  alt_names: string[]
  network: string | null
  owners: string[]
  country: string
  categories: string[]
  is_nsfw: boolean
  launched: string | null
  closed: string | null
  replaced_by: string | null
  website: string | null
}

export interface RawStream {
  channel: string | null
  feed: string | null
  title: string
  url: string
  referrer: string | null
  user_agent: string | null
  quality: string | null
}

export interface RawCountry {
  name: string
  code: string
  languages: string[]
  flag: string
}

export interface RawLanguage {
  name: string
  code: string
}

export interface RawCategory {
  id: string
  name: string
  description: string
}

export interface RawLogo {
  channel: string
  feed: string | null
  tags: string[]
  width: number
  height: number
  format: string | null
  url: string
}

// Fetch functions with caching
let channelsCache: RawChannel[] | null = null
let streamsCache: RawStream[] | null = null
let countriesCache: RawCountry[] | null = null
let languagesCache: RawLanguage[] | null = null
let categoriesCache: RawCategory[] | null = null
let logosCache: RawLogo[] | null = null

export async function fetchChannels(): Promise<RawChannel[]> {
  if (channelsCache) return channelsCache
  const res = await fetch(API_ENDPOINTS.channels, { next: { revalidate: 3600 } })
  channelsCache = await res.json()
  return channelsCache!
}

export async function fetchStreams(): Promise<RawStream[]> {
  if (streamsCache) return streamsCache
  const res = await fetch(API_ENDPOINTS.streams, { next: { revalidate: 3600 } })
  streamsCache = await res.json()
  return streamsCache!
}

export async function fetchCountries(): Promise<RawCountry[]> {
  if (countriesCache) return countriesCache
  const res = await fetch(API_ENDPOINTS.countries, { next: { revalidate: 86400 } })
  countriesCache = await res.json()
  return countriesCache!
}

export async function fetchLanguages(): Promise<RawLanguage[]> {
  if (languagesCache) return languagesCache
  const res = await fetch(API_ENDPOINTS.languages, { next: { revalidate: 86400 } })
  languagesCache = await res.json()
  return languagesCache!
}

export async function fetchCategories(): Promise<RawCategory[]> {
  if (categoriesCache) return categoriesCache
  const res = await fetch(API_ENDPOINTS.categories, { next: { revalidate: 86400 } })
  categoriesCache = await res.json()
  return categoriesCache!
}

export async function fetchLogos(): Promise<RawLogo[]> {
  if (logosCache) return logosCache
  const res = await fetch(API_ENDPOINTS.logos, { next: { revalidate: 3600 } })
  logosCache = await res.json()
  return logosCache!
}

// Combined fetch for all data needed
export async function fetchAllIPTVData() {
  const [channels, streams, countries, languages, categories, logos] = await Promise.all([
    fetchChannels(),
    fetchStreams(),
    fetchCountries(),
    fetchLanguages(),
    fetchCategories(),
    fetchLogos(),
  ])

  // Create stream URL map (channel ID -> stream URL)
  const streamMap = new Map<string, RawStream>()
  for (const stream of streams) {
    if (stream.channel && !streamMap.has(stream.channel)) {
      streamMap.set(stream.channel, stream)
    }
  }

  // Create logo map (channel ID -> logo URL)
  const logoMap = new Map<string, string>()
  for (const logo of logos) {
    if (!logoMap.has(logo.channel)) {
      logoMap.set(logo.channel, logo.url)
    }
  }

  return {
    channels,
    streams,
    streamMap,
    countries,
    languages,
    categories,
    logoMap,
  }
}
