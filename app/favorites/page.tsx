"use client"

import { Heart } from "lucide-react"
import { ChannelCard } from "@/components/channel-card"
import { useFavorites } from "@/lib/favorites-context"
import { useIPTV } from "@/lib/iptv-context"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const { channels, isLoading } = useIPTV()

  // Get favorite channels
  const favoriteChannels = channels.filter((ch) => favorites.includes(ch.id))

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="px-6 lg:px-12 py-12">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-6 lg:px-12 py-12 border-b border-border bg-gradient-to-b from-secondary/30 to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-500/20 rounded-xl">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">My Favorites</h1>
            <p className="text-muted-foreground mt-1">
              {favoriteChannels.length} {favoriteChannels.length === 1 ? "channel" : "channels"} saved
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 lg:px-12 py-8">
        {favoriteChannels.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start adding channels to your favorites by clicking the heart icon on any channel card.
            </p>
            <Button asChild>
              <Link href="/explore">Browse Channels</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {favoriteChannels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
