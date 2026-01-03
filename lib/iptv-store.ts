// Client-side store for IPTV data with SWR-like behavior
import { API_ENDPOINTS } from "./config"
import type { Category, Channel, Country, Language } from "./types"

// Cached data
let cachedChannels: Channel[] | null = null
let cachedCountries: Country[] | null = null
let cachedLanguages: Language[] | null = null
let cachedCategories: Category[] | null = null
let dataLoaded = false
let loadingPromise: Promise<void> | null = null

// Category icons
const categoryIcons: Record<string, string> = {
  animation: "🎬",
  auto: "🚗",
  business: "💼",
  classic: "🎞️",
  comedy: "😂",
  cooking: "🍳",
  culture: "🎭",
  documentary: "📽️",
  education: "📚",
  entertainment: "🎉",
  family: "👨‍👩‍👧‍👦",
  general: "📺",
  kids: "🧒",
  legislative: "🏛️",
  lifestyle: "🌴",
  movies: "🎬",
  music: "🎵",
  news: "📰",
  outdoor: "🏕️",
  relax: "🧘",
  religious: "🙏",
  science: "🔬",
  series: "📺",
  shop: "🛒",
  sports: "⚽",
  travel: "✈️",
  weather: "🌤️",
  xxx: "🔞",
}

async function loadData(): Promise<void> {
  if (dataLoaded) return
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    try {
      // Fetch all data in parallel
      const [channelsRes, streamsRes, countriesRes, languagesRes, categoriesRes, logosRes] = await Promise.all([
        fetch(API_ENDPOINTS.channels),
        fetch(API_ENDPOINTS.streams),
        fetch(API_ENDPOINTS.countries),
        fetch(API_ENDPOINTS.languages),
        fetch(API_ENDPOINTS.categories),
        fetch(API_ENDPOINTS.logos),
      ])

      const [rawChannels, rawStreams, rawCountries, rawLanguages, rawCategories, rawLogos] = await Promise.all([
        channelsRes.json(),
        streamsRes.json(),
        countriesRes.json(),
        languagesRes.json(),
        categoriesRes.json(),
        logosRes.json(),
      ])

      // Build stream map
      const streamMap = new Map<string, { url: string; quality: string | null }>()
      for (const stream of rawStreams) {
        if (stream.channel && !streamMap.has(stream.channel)) {
          streamMap.set(stream.channel, { url: stream.url, quality: stream.quality })
        }
      }

      // Build logo map
      const logoMap = new Map<string, string>()
      for (const logo of rawLogos) {
        if (!logoMap.has(logo.channel)) {
          logoMap.set(logo.channel, logo.url)
        }
      }

      // Build language map for display names
      const langMap = new Map<string, string>()
      for (const lang of rawLanguages) {
        langMap.set(lang.code, lang.name)
      }

      // Build country map
      const countryMap = new Map<string, { name: string; flag: string; languages: string[] }>()
      for (const country of rawCountries) {
        countryMap.set(country.code, {
          name: country.name,
          flag: country.flag,
          languages: country.languages,
        })
      }

      // Transform channels - only include channels with streams
      const channelCountByCountry = new Map<string, number>()
      const channelCountByLanguage = new Map<string, number>()
      const channelCountByCategory = new Map<string, number>()

      cachedChannels = rawChannels
        .filter((ch: any) => !ch.is_nsfw && !ch.closed && streamMap.has(ch.id))
        .map((ch: any) => {
          const stream = streamMap.get(ch.id)
          const logo = logoMap.get(ch.id)
          const countryInfo = countryMap.get(ch.country)

          const channelLanguages: string[] = ch.languages || []

          // Count for stats
          channelCountByCountry.set(ch.country, (channelCountByCountry.get(ch.country) || 0) + 1)
          for (const cat of ch.categories) {
            channelCountByCategory.set(cat, (channelCountByCategory.get(cat) || 0) + 1)
          }
          for (const lang of channelLanguages) {
            channelCountByLanguage.set(lang, (channelCountByLanguage.get(lang) || 0) + 1)
          }

          return {
            id: ch.id,
            name: ch.name,
            logo: logo || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(ch.name + " TV logo")}`,
            country: ch.country,
            languages: channelLanguages, // Use channel's own languages
            categories: ch.categories,
            streamUrl: stream?.url || "",
            isLive: true,
            reliabilityScore: stream?.quality
              ? stream.quality.includes("1080")
                ? 95
                : stream.quality.includes("720")
                  ? 85
                  : 75
              : 70,
          } as Channel
        })

      // Transform countries
      cachedCountries = rawCountries
        .filter((c: any) => channelCountByCountry.has(c.code))
        .map((c: any) => ({
          code: c.code,
          name: c.name,
          flag: c.flag,
          channelCount: channelCountByCountry.get(c.code) || 0,
        }))
        .sort((a: Country, b: Country) => b.channelCount - a.channelCount)

      // Transform languages
      cachedLanguages = rawLanguages
        .filter((l: any) => channelCountByLanguage.has(l.code))
        .map((l: any) => ({
          code: l.code,
          name: l.name,
          channelCount: channelCountByLanguage.get(l.code) || 0,
        }))
        .sort((a: Language, b: Language) => b.channelCount - a.channelCount)

      // Transform categories
      cachedCategories = rawCategories
        .filter((c: any) => channelCountByCategory.has(c.id))
        .map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: categoryIcons[c.id] || "📺",
          channelCount: channelCountByCategory.get(c.id) || 0,
        }))
        .sort((a: Category, b: Category) => b.channelCount - a.channelCount)

      dataLoaded = true
    } catch (error) {
      console.error("Failed to load IPTV data:", error)
      throw error
    }
  })()

  return loadingPromise
}

// Getters that ensure data is loaded
export async function getChannels(): Promise<Channel[]> {
  await loadData()
  return cachedChannels || []
}

export async function getCountries(): Promise<Country[]> {
  await loadData()
  return cachedCountries || []
}

export async function getLanguages(): Promise<Language[]> {
  await loadData()
  return cachedLanguages || []
}

export async function getCategories(): Promise<Category[]> {
  await loadData()
  return cachedCategories || []
}

export async function getChannelById(id: string): Promise<Channel | undefined> {
  const channels = await getChannels()
  return channels.find((ch) => ch.id === id)
}

export async function getChannelsByCountry(countryCode: string): Promise<Channel[]> {
  const channels = await getChannels()
  return channels.filter((ch) => ch.country.toLowerCase() === countryCode.toLowerCase())
}

export async function getChannelsByCategory(categoryId: string): Promise<Channel[]> {
  const channels = await getChannels()
  return channels.filter((ch) => ch.categories.includes(categoryId))
}

export async function getChannelsByLanguage(langCode: string): Promise<Channel[]> {
  const channels = await getChannels()
  return channels.filter((ch) => ch.languages.includes(langCode))
}

export async function searchChannels(query: string, limit = 10): Promise<Channel[]> {
  const channels = await getChannels()
  const lowerQuery = query.toLowerCase()
  return channels.filter((ch) => ch.name.toLowerCase().includes(lowerQuery)).slice(0, limit)
}

export async function filterChannels(filters: {
  countries?: string[]
  languages?: string[]
  categories?: string[]
  search?: string
}): Promise<Channel[]> {
  const channels = await getChannels()

  return channels.filter((ch) => {
    if (filters.countries?.length && !filters.countries.includes(ch.country)) {
      return false
    }
    if (filters.languages?.length && !ch.languages.some((l) => filters.languages!.includes(l))) {
      return false
    }
    if (filters.categories?.length && !ch.categories.some((c) => filters.categories!.includes(c))) {
      return false
    }
    if (filters.search) {
      const search = filters.search.toLowerCase()
      if (!ch.name.toLowerCase().includes(search)) {
        return false
      }
    }
    return true
  })
}

// Get featured/popular channels
export async function getFeaturedChannels(isInternational: boolean): Promise<Channel[]> {
  const channels = await getChannels()

  if (isInternational) {
    // Popular international channels
    return channels.filter((ch) => ch.reliabilityScore >= 80).slice(0, 10)
  } else {
    // Indian channels first
    const indian = channels.filter((ch) => ch.country === "IN")
    return indian.slice(0, 10)
  }
}

export async function getPopularChannels(isInternational: boolean): Promise<Channel[]> {
  const channels = await getChannels()

  if (isInternational) {
    return channels.filter((ch) => ch.reliabilityScore >= 70).slice(0, 20)
  } else {
    const indian = channels.filter((ch) => ch.country === "IN")
    const others = channels.filter((ch) => ch.country !== "IN")
    return [...indian.slice(0, 15), ...others.slice(0, 5)]
  }
}

// Check if data is loaded
export function isDataLoaded(): boolean {
  return dataLoaded
}

// Preload data
export function preloadData(): void {
  loadData()
}
