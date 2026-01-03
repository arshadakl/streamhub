import {
    POPULAR_INDIAN_ENTERTAINMENT,
    POPULAR_INDIAN_MOVIES,
    POPULAR_INDIAN_NEWS,
    POPULAR_INDIAN_SPORTS,
    POPULAR_MALAYALAM,
} from "@/app/_constants/popular-channels"
import {
    getCategoryChannels,
    getFeaturedChannels,
    getPopularChannels,
    sortCountries,
} from "@/app/_utils/channel-utils"
import { useIPTV } from "@/lib/iptv-context"
import { useMode } from "@/lib/mode-context"
import { useMemo } from "react"

/**
 * Custom hook that provides all data needed for the home page
 * Handles mode-based channel selection and sorting
 */
export function useHomePageData() {
    const { isInternational } = useMode()
    const { channels, countries, categories, isLoading, totalChannels } = useIPTV()

    // Featured channel patterns - combining popular channels from different categories
    const featuredPatterns = useMemo(
        () => [
            ...POPULAR_MALAYALAM.slice(0, 5),
            ...POPULAR_INDIAN_NEWS.slice(0, 5),
            ...POPULAR_INDIAN_ENTERTAINMENT.slice(0, 5),
        ],
        []
    )

    // Popular channel patterns
    const popularPatterns = useMemo(
        () => [
            ...POPULAR_MALAYALAM,
            ...POPULAR_INDIAN_NEWS.slice(0, 10),
            ...POPULAR_INDIAN_ENTERTAINMENT.slice(0, 10),
        ],
        []
    )

    // Memoized featured channels
    const featuredChannels = useMemo(
        () => getFeaturedChannels(channels, isInternational, featuredPatterns),
        [channels, isInternational, featuredPatterns]
    )

    // Memoized popular channels
    const popularChannels = useMemo(
        () => getPopularChannels(channels, isInternational, popularPatterns),
        [channels, isInternational, popularPatterns]
    )

    // Memoized category channels
    const newsChannels = useMemo(
        () => getCategoryChannels(channels, "news", POPULAR_INDIAN_NEWS, isInternational, true),
        [channels, isInternational]
    )

    const sportsChannels = useMemo(
        () => getCategoryChannels(channels, "sports", POPULAR_INDIAN_SPORTS, isInternational, true),
        [channels, isInternational]
    )

    const entertainmentChannels = useMemo(
        () =>
            getCategoryChannels(channels, "entertainment", POPULAR_INDIAN_ENTERTAINMENT, isInternational, true),
        [channels, isInternational]
    )

    const moviesChannels = useMemo(
        () => getCategoryChannels(channels, "movies", POPULAR_INDIAN_MOVIES, isInternational, true),
        [channels, isInternational]
    )

    // Memoized sorted countries
    const sortedCountries = useMemo(
        () => sortCountries(countries, isInternational),
        [countries, isInternational]
    )

    return {
        // Loading state
        isLoading,

        // Mode
        isInternational,

        // Stats
        totalChannels,
        countriesCount: countries.length,
        categoriesCount: categories.length,

        // Channels
        featuredChannels,
        popularChannels,
        newsChannels,
        sportsChannels,
        entertainmentChannels,
        moviesChannels,

        // Categories (limited to first 7)
        displayCategories: categories.slice(0, 7),

        // Countries (limited to first 16)
        displayCountries: sortedCountries.slice(0, 16),
    }
}
