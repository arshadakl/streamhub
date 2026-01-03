import { POPULAR_MALAYALAM } from "@/app/_constants/popular-channels"
import type { Channel } from "@/lib/types"

/**
 * Find channels by name patterns, optionally filtered by country
 * @param channels - Array of all channels to search
 * @param namePatterns - Array of name patterns to match (case-insensitive)
 * @param countryCode - Optional country code to filter by
 * @returns Array of matched channels (deduplicated)
 */
export function findChannelsByNames(
    channels: Channel[],
    namePatterns: readonly string[],
    countryCode?: string
): Channel[] {
    const found: Channel[] = []
    const addedIds = new Set<string>()

    for (const pattern of namePatterns) {
        const matches = channels.filter((ch) => {
            if (addedIds.has(ch.id)) return false
            // If countryCode is provided, validate that the channel is from that country
            if (countryCode && ch.country !== countryCode) return false
            const name = ch.name.toLowerCase()
            return name.includes(pattern.toLowerCase())
        })
        for (const match of matches) {
            if (!addedIds.has(match.id)) {
                found.push(match)
                addedIds.add(match.id)
            }
        }
    }
    return found
}

/**
 * Get channels for a specific category with fallback name matching
 * @param channels - Array of all channels
 * @param categoryName - Category name to match
 * @param fallbackNames - Fallback name patterns if no category match
 * @param isInternational - Whether in international mode
 * @param isIndianCategory - Whether this is an Indian-specific category
 * @returns Array of channels for the category (max 20)
 */
export function getCategoryChannels(
    channels: Channel[],
    categoryName: string,
    fallbackNames: readonly string[],
    isInternational: boolean,
    isIndianCategory: boolean = false
): Channel[] {
    const categoryLower = categoryName.toLowerCase()
    let categoryChannels = channels.filter((ch) =>
        ch.categories.some(
            (cat) => cat.toLowerCase() === categoryLower || cat.toLowerCase().includes(categoryLower)
        )
    )

    // If no category matches, search by channel names
    // For Indian categories when not in international mode, filter by country=IN
    if (categoryChannels.length === 0) {
        const countryFilter = isIndianCategory && !isInternational ? "IN" : undefined
        categoryChannels = findChannelsByNames(channels, fallbackNames, countryFilter)
    }

    if (isInternational) {
        return categoryChannels.slice(0, 20)
    }

    // For India mode, prioritize Indian channels, then Malayalam within Indian
    const indianCategoryChannels = categoryChannels.filter((ch) => ch.country === "IN")
    const otherCategoryChannels = categoryChannels.filter((ch) => ch.country !== "IN")

    // Prioritize Malayalam channels within Indian channels
    const malayalamChannels = indianCategoryChannels.filter(
        (ch) =>
            ch.languages.some((lang) => lang.toLowerCase().includes("mal")) ||
            POPULAR_MALAYALAM.some((name) => ch.name.toLowerCase().includes(name.toLowerCase()))
    )
    const otherIndianCategoryChannels = indianCategoryChannels.filter(
        (ch) => !malayalamChannels.includes(ch)
    )

    return [...malayalamChannels, ...otherIndianCategoryChannels, ...otherCategoryChannels].slice(0, 20)
}

/**
 * Get featured channels based on mode
 * @param channels - Array of all channels
 * @param isInternational - Whether in international mode
 * @param featuredPatterns - Patterns to match for featured channels
 * @returns Array of featured channels (max 10)
 */
export function getFeaturedChannels(
    channels: Channel[],
    isInternational: boolean,
    featuredPatterns: readonly string[]
): Channel[] {
    if (isInternational) {
        return channels.filter((ch) => ch.reliabilityScore >= 80).slice(0, 10)
    }

    const indianChannels = channels.filter((ch) => ch.country === "IN")

    // Try to find popular Indian channels by name - validate country=IN
    const popularByName = findChannelsByNames(channels, featuredPatterns, "IN")
    if (popularByName.length >= 5) return popularByName.slice(0, 10)
    if (indianChannels.length > 0) return indianChannels.slice(0, 10)
    return channels.slice(0, 10)
}

/**
 * Get popular channels based on mode
 * @param channels - Array of all channels
 * @param isInternational - Whether in international mode
 * @param popularPatterns - Patterns to match for popular channels
 * @returns Array of popular channels (max 20)
 */
export function getPopularChannels(
    channels: Channel[],
    isInternational: boolean,
    popularPatterns: readonly string[]
): Channel[] {
    if (isInternational) {
        return channels.filter((ch) => ch.reliabilityScore >= 70).slice(0, 20)
    }

    const indianChannels = channels.filter((ch) => ch.country === "IN")
    const otherChannels = channels.filter((ch) => ch.country !== "IN")

    // Validate country=IN for Indian channel lists
    const popularByName = findChannelsByNames(channels, popularPatterns, "IN")
    if (popularByName.length > 0) {
        const remaining = indianChannels.filter((ch) => !popularByName.includes(ch))
        return [...popularByName, ...remaining].slice(0, 20)
    }
    return [...indianChannels.slice(0, 15), ...otherChannels.slice(0, 5)]
}

/**
 * Sort countries with India first (when not in international mode)
 * @param countries - Array of countries to sort
 * @param isInternational - Whether in international mode
 * @returns Sorted array of countries
 */
export function sortCountries<T extends { code: string; channelCount: number }>(
    countries: T[],
    isInternational: boolean
): T[] {
    if (isInternational) {
        return countries
    }

    return [...countries].sort((a, b) => {
        if (a.code === "IN") return -1
        if (b.code === "IN") return 1
        return b.channelCount - a.channelCount
    })
}
