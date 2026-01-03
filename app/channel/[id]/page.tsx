"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Signal, Globe, Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { VideoPlayer } from "@/components/video-player"
import { RelatedChannels } from "@/components/related-channels"
import { useIPTV } from "@/lib/iptv-context"
import type { Channel } from "@/lib/types"

export default function ChannelPage() {
  const params = useParams()
  const id = decodeURIComponent(params.id as string)
  const { channels, countries, languages, categories, isLoading } = useIPTV()
  const [channel, setChannel] = useState<Channel | null>(null)
  const [searchComplete, setSearchComplete] = useState(false)

  useEffect(() => {
    if (!isLoading && channels.length > 0) {
      let found = channels.find((ch) => ch.id === id)
      if (!found) {
        found = channels.find((ch) => ch.id.toLowerCase() === id.toLowerCase())
      }
      console.log("[v0] Searching for channel:", id, "Found:", found?.name || "not found")
      setChannel(found || null)
      setSearchComplete(true)
    }
  }, [id, channels, isLoading])

  if (isLoading || !searchComplete) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-12 py-4 border-b border-border">
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="px-6 lg:px-12 py-8">
          <div className="max-w-6xl mx-auto">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="mt-8 flex gap-4">
              <Skeleton className="w-16 h-16 rounded-xl" />
              <div className="flex-1">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-3xl font-bold text-foreground mb-4">Channel Not Found</h1>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          The channel &quot;{id}&quot; could not be found. It may have been removed or the URL might be incorrect.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    )
  }

  const countryData = countries.find((c) => c.code === channel.country)

  // Get related channels
  const relatedByCategory = channels.filter(
    (ch) => ch.id !== channel.id && ch.categories.some((cat) => channel.categories.includes(cat)),
  )
  const relatedByCountry = channels.filter((ch) => ch.id !== channel.id && ch.country === channel.country)
  const relatedChannels = [...new Map([...relatedByCategory, ...relatedByCountry].map((ch) => [ch.id, ch])).values()]

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="px-6 lg:px-12 py-4 border-b border-border">
        <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground hover:text-foreground">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      {/* Main Content */}
      <div className="px-6 lg:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Video Player */}
          <VideoPlayer streamUrl={channel.streamUrl} channelName={channel.name} poster={channel.logo} />

          {/* Channel Info */}
          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* Left: Main Info */}
            <div className="flex-1">
              <div className="flex items-start gap-4">
                {/* Logo */}
                <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-secondary">
                  <Image
                    src={channel.logo || "/placeholder.svg"}
                    alt={`${channel.name} logo`}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title & Meta */}
                <div className="min-w-0">
                  <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{channel.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {channel.isLive && (
                      <Badge variant="destructive" className="bg-red-600 text-foreground">
                        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
                        LIVE
                      </Badge>
                    )}
                    {countryData && (
                      <Badge variant="secondary">
                        {countryData.flag} {countryData.name}
                      </Badge>
                    )}
                    {channel.categories.map((cat) => (
                      <Link key={cat} href={`/category/${cat}`}>
                        <Badge
                          variant="outline"
                          className="capitalize cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                          {categories.find((c) => c.id === cat)?.name || cat}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Watch {channel.name} live stream. Enjoy high-quality{" "}
                {channel.categories.map((c) => c.toLowerCase()).join(", ")} content from{" "}
                {countryData?.name || channel.country}. Available in{" "}
                {channel.languages.map((l) => languages.find((lang) => lang.code === l)?.name || l).join(", ")}.
              </p>
            </div>

            {/* Right: Stats & Actions */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h2 className="font-semibold text-foreground">Channel Info</h2>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Signal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Reliability:</span>
                    <span className="ml-auto font-medium text-foreground">{channel.reliabilityScore}%</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Country:</span>
                    <Link
                      href={`/country/${channel.country.toLowerCase()}`}
                      className="ml-auto font-medium text-foreground hover:text-accent"
                    >
                      {countryData?.name || channel.country}
                    </Link>
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Languages:</span>
                    <span className="ml-auto font-medium text-foreground">
                      {channel.languages.map((l) => languages.find((lang) => lang.code === l)?.name || l).join(", ") ||
                        "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Reliability Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Stream Quality</span>
                    <span
                      className={
                        channel.reliabilityScore >= 90
                          ? "text-green-500"
                          : channel.reliabilityScore >= 70
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                    >
                      {channel.reliabilityScore >= 90 ? "Excellent" : channel.reliabilityScore >= 70 ? "Good" : "Fair"}
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        channel.reliabilityScore >= 90
                          ? "bg-green-500"
                          : channel.reliabilityScore >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${channel.reliabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Channels */}
          <RelatedChannels channels={relatedChannels} currentChannelId={channel.id} />
        </div>
      </div>
    </div>
  )
}
