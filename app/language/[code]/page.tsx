"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ChannelCard } from "@/components/channel-card"
import { useIPTV } from "@/lib/iptv-context"
import Link from "next/link"
import type { Channel, Language } from "@/lib/types"

export default function LanguagePage() {
  const params = useParams()
  const code = decodeURIComponent(params.code as string)
  const { channels, countries, languages, categories, isLoading } = useIPTV()
  const [language, setLanguage] = useState<Language | null>(null)
  const [languageChannels, setLanguageChannels] = useState<Channel[]>([])
  const [searchComplete, setSearchComplete] = useState(false)

  useEffect(() => {
    if (!isLoading && languages.length > 0) {
      const found = languages.find(
        (l) => l.code.toLowerCase() === code.toLowerCase() || l.name.toLowerCase() === code.toLowerCase(),
      )
      setLanguage(found || null)

      if (found) {
        const chans = channels.filter((ch) =>
          ch.languages.some((lang) => lang.toLowerCase() === found.code.toLowerCase()),
        )
        setLanguageChannels(chans)
      }
      setSearchComplete(true)
    }
  }, [code, languages, channels, isLoading])

  if (isLoading || !searchComplete) {
    return (
      <div className="min-h-screen">
        <section className="relative py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-secondary/50 to-background">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-6 w-32 mt-2" />
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

  if (!language) {
    notFound()
  }

  // Get unique countries and categories for this language
  const uniqueCountries = [...new Set(languageChannels.map((ch) => ch.country))]
  const uniqueCategories = [...new Set(languageChannels.flatMap((ch) => ch.categories))]

  return (
    <div className="min-h-screen">
      {/* Hero Header */}
      <section className="relative py-16 lg:py-24 px-6 lg:px-12 bg-gradient-to-b from-secondary/50 to-background">
        <div className="max-w-4xl">
          <div className="mb-4">
            <Badge variant="secondary" className="mb-4 text-sm">
              Language
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold text-foreground">{language.name}</h1>
            <p className="text-lg text-muted-foreground mt-2">
              {languageChannels.length.toLocaleString()} channels broadcasting
            </p>
          </div>

          {/* Available Countries */}
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Available from:</p>
            <div className="flex flex-wrap gap-2">
              {uniqueCountries.slice(0, 10).map((countryCode) => {
                const country = countries.find((c) => c.code === countryCode)
                return (
                  <Link key={countryCode} href={`/country/${countryCode.toLowerCase()}`}>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {country?.flag} {country?.name || countryCode}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Category Filters */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Categories:</p>
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.slice(0, 10).map((catId) => {
                const cat = categories.find((c) => c.id === catId)
                return (
                  <Link key={catId} href={`/category/${catId}`}>
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors capitalize"
                    >
                      {cat?.icon} {cat?.name || catId}
                    </Badge>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Channel Grid */}
      <section className="px-6 lg:px-12 py-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">All {language.name} Channels</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {languageChannels.slice(0, 100).map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>

        {languageChannels.length > 100 && (
          <div className="mt-8 text-center py-6 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">
              Showing 100 of {languageChannels.length.toLocaleString()} channels. Use search to find specific channels.
            </p>
          </div>
        )}

        {languageChannels.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No channels available in this language yet.</p>
            <Link href="/explore" className="text-accent hover:underline mt-2 inline-block">
              Explore all channels
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
