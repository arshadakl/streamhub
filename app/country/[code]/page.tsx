"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChannelCard } from "@/components/channel-card"
import { useIPTV } from "@/lib/iptv-context"
import Link from "next/link"
import type { Channel, Country } from "@/lib/types"

export default function CountryPage() {
  const params = useParams()
  const code = decodeURIComponent(params.code as string).toUpperCase()
  const { channels, countries, languages, categories, isLoading } = useIPTV()
  const [country, setCountry] = useState<Country | null>(null)
  const [countryChannels, setCountryChannels] = useState<Channel[]>([])
  const [searchComplete, setSearchComplete] = useState(false)

  useEffect(() => {
    if (!isLoading && countries.length > 0) {
      const found = countries.find((c) => c.code.toUpperCase() === code)
      setCountry(found || null)

      if (found) {
        let chans = channels.filter((ch) => ch.country.toUpperCase() === code)

        if (code === "IN") {
          chans = chans.sort((a, b) => {
            const aIsMalayalam = a.languages.some((l) => l.toLowerCase() === "mal")
            const bIsMalayalam = b.languages.some((l) => l.toLowerCase() === "mal")
            if (aIsMalayalam && !bIsMalayalam) return -1
            if (!aIsMalayalam && bIsMalayalam) return 1
            return 0
          })
        }

        setCountryChannels(chans)
      }
      setSearchComplete(true)
    }
  }, [code, countries, channels, isLoading])

  if (isLoading || !searchComplete) {
    return (
      <div className="min-h-screen">
        <section className="relative py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-secondary/50 to-background">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="w-24 h-24 rounded-lg" />
            <div>
              <Skeleton className="h-12 w-48" />
              <Skeleton className="h-6 w-32 mt-2" />
            </div>
          </div>
        </section>
        <section className="px-6 lg:px-12 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="h-[150px] rounded-xl" />
            ))}
          </div>
        </section>
      </div>
    )
  }

  if (!country) {
    notFound()
  }

  // Get unique languages and categories for this country
  const uniqueLanguages = [...new Set(countryChannels.flatMap((ch) => ch.languages))]
  const uniqueCategories = [...new Set(countryChannels.flatMap((ch) => ch.categories))]

  const sortedLanguages =
    code === "IN"
      ? uniqueLanguages.sort((a, b) => {
          if (a.toLowerCase() === "mal") return -1
          if (b.toLowerCase() === "mal") return 1
          return 0
        })
      : uniqueLanguages

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl lg:text-8xl" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <div>
              <h1 className="text-3xl lg:text-5xl font-bold text-foreground">{country.name}</h1>
              <p className="text-lg text-muted-foreground mt-2">
                {countryChannels.length.toLocaleString()} channels available
              </p>
            </div>
          </div>

          {/* Quick Filters - use sortedLanguages */}
          <div className="flex flex-wrap gap-2 mt-6">
            {sortedLanguages.slice(0, 8).map((langCode) => {
              const lang = languages.find((l) => l.code.toLowerCase() === langCode.toLowerCase())
              return (
                <Link key={langCode} href={`/language/${encodeURIComponent(langCode.toLowerCase())}`}>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {lang?.name || langCode}
                  </Badge>
                </Link>
              )
            })}
            {uniqueCategories.slice(0, 8).map((catId) => {
              const cat = categories.find((c) => c.id.toLowerCase() === catId.toLowerCase())
              return (
                <Link key={catId} href={`/category/${encodeURIComponent(catId.toLowerCase())}`}>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {cat?.name || catId}
                  </Badge>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Channel Grid */}
      <section className="px-6 lg:px-12 py-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">All Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {countryChannels.slice(0, 100).map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>

        {countryChannels.length > 100 && (
          <div className="mt-8 text-center py-6 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">
              Showing 100 of {countryChannels.length.toLocaleString()} channels. Use search to find specific channels.
            </p>
          </div>
        )}

        {countryChannels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No channels available for this country yet.</p>
            <Link href="/explore" className="text-accent hover:underline mt-2 inline-block">
              Explore all channels
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
