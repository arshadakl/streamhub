"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ChannelCard } from "@/components/channel-card"
import { ExploreFilters } from "@/components/explore-filters"
import { Skeleton } from "@/components/ui/skeleton"
import { useIPTV } from "@/lib/iptv-context"

function ExplorePageSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="py-8 lg:py-12 px-6 lg:px-12 border-b border-border">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </section>
      <div className="flex flex-col lg:flex-row gap-8 px-6 lg:px-12 py-8">
        <Skeleton className="w-full lg:w-72 h-96" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ExploreContent() {
  const { channels, isLoading } = useIPTV()
  const searchParams = useSearchParams()

  if (isLoading) {
    return <ExplorePageSkeleton />
  }

  // Parse filters from URL
  const filters = {
    countries: searchParams.get("countries")?.split(",").filter(Boolean) || [],
    languages: searchParams.get("languages")?.split(",").filter(Boolean) || [],
    categories: searchParams.get("categories")?.split(",").filter(Boolean) || [],
    search: searchParams.get("search") || "",
  }

  // Apply filters
  let filteredChannels = channels.filter((ch) => {
    if (filters.countries.length && !filters.countries.includes(ch.country)) {
      return false
    }
    if (filters.languages.length && !ch.languages.some((l) => filters.languages.includes(l))) {
      return false
    }
    if (filters.categories.length && !ch.categories.some((c) => filters.categories.includes(c))) {
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

  const hasFilters = filters.countries.length || filters.languages.length || filters.categories.length || filters.search

  // Prioritize Indian channels when no filters
  if (!hasFilters) {
    const indianChannels = filteredChannels.filter((ch) => ch.country === "IN")
    const otherChannels = filteredChannels.filter((ch) => ch.country !== "IN")
    filteredChannels = [...indianChannels, ...otherChannels]
  }

  const displayLimit = 200
  const hasMore = filteredChannels.length > displayLimit
  const displayChannels = filteredChannels.slice(0, displayLimit)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-8 lg:py-12 px-6 lg:px-12 border-b border-border">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">Explore Channels</h1>
        <p className="text-muted-foreground mt-2">
          Browse {channels.length.toLocaleString()}+ channels from around the world
        </p>
      </section>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-8 px-6 lg:px-12 py-8">
        {/* Filters Sidebar */}
        <Suspense fallback={<Skeleton className="w-full lg:w-72 h-96" />}>
          <ExploreFilters />
        </Suspense>

        {/* Results */}
        <div className="flex-1">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              {hasMore ? (
                <>
                  Showing {displayLimit.toLocaleString()} of {filteredChannels.length.toLocaleString()} channels
                </>
              ) : (
                <>
                  {filteredChannels.length.toLocaleString()} {filteredChannels.length === 1 ? "channel" : "channels"}
                  {hasFilters ? " found" : " available"}
                </>
              )}
            </p>
            {!hasFilters && <span className="text-xs text-accent">Indian channels shown first</span>}
          </div>

          {/* Channel Grid */}
          {displayChannels.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {displayChannels.map((channel) => (
                  <ChannelCard key={channel.id} channel={channel} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 text-center py-6 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">
                    Use filters or search to find more channels from our {channels.length.toLocaleString()}+ collection
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <p className="text-lg text-foreground mb-2">No channels found</p>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
