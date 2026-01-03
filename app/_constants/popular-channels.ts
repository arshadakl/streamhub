/**
 * Popular channel name patterns for filtering and prioritizing channels
 * These patterns are used to match channel names (case-insensitive)
 */

export const POPULAR_INDIAN_NEWS = [
    "aaj tak",
    "ndtv",
    "republic",
    "zee news",
    "india tv",
    "news18",
    "abp news",
    "times now",
    "cnbc",
    "dd news",
    "dd india",
    "rajya sabha",
    "lok sabha",
    "asianet news",
    "media one",
    "manorama news",
    "mathrubhumi news",
    "news 24",
    "kairali",
    "ReporterTV",
    "tv9",
    "news nation",
    "good news today",
    "india today",
] as const

export const POPULAR_INDIAN_SPORTS = [
    "star sports",
    "sony sports",
    "dd sports",
    "sony ten",
    "sony six",
    "eurosport",
    "ten sports",
    "sports18",
    "fancode",
    "willow",
] as const

export const POPULAR_INDIAN_ENTERTAINMENT = [
    "star plus",
    "zee tv",
    "colors",
    "sony",
    "star bharat",
    "sab tv",
    "asianet",
    "surya tv",
    "mazhavil manorama",
    "flowers",
    "kairali tv",
    "zee kannada",
    "star maa",
    "sun tv",
    "zee tamil",
    "colors tamil",
    "star vijay",
    "zee marathi",
    "colors bangla",
    "zee bangla",
    "star jalsha",
    "dangal",
    "enterr10",
    "shemaroo",
    "rishtey",
] as const

export const POPULAR_INDIAN_MOVIES = [
    "star gold",
    "zee cinema",
    "sony max",
    "colors cineplex",
    "zee bollywood",
    "movies ok",
    "sony wah",
    "zee action",
    "b4u movies",
    "zee anmol cinema",
    "asianet movies",
    "surya movies",
    "kiran tv",
    "udaya movies",
    "star maa movies",
    "gemini movies",
    "sun tv movies",
    "kalaignar movies",
    "zee thirai",
    "colors kannada cinema",
    "zee picchar",
] as const

export const POPULAR_MALAYALAM = [
    "asianet",
    "mathrubhumi",
    "mazhavil manorama",
    "flowers",
    "surya tv",
    "24 news",
    "kairali",
    "amrita tv",
    "media one",
    "reporter",
    "manorama news",
    "asianet news",
    "kaumudy",
    "news 18 kerala",
    "safari tv",
    "asianet plus",
    "asianet movies",
    "surya movies",
    "zee keralam",
] as const

// Type exports for the popular channel arrays
export type PopularIndianNews = (typeof POPULAR_INDIAN_NEWS)[number]
export type PopularIndianSports = (typeof POPULAR_INDIAN_SPORTS)[number]
export type PopularIndianEntertainment = (typeof POPULAR_INDIAN_ENTERTAINMENT)[number]
export type PopularIndianMovies = (typeof POPULAR_INDIAN_MOVIES)[number]
export type PopularMalayalam = (typeof POPULAR_MALAYALAM)[number]
