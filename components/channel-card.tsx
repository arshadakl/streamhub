"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/lib/favorites-context"
import { useIPTV } from "@/lib/iptv-context"
import type { Channel } from "@/lib/types"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ChannelCardProps {
  channel: Channel
  size?: "default" | "large"
}

export function ChannelCard({ channel, size = "default" }: ChannelCardProps) {
  const [imageError, setImageError] = useState(false)
  const { countries, languages } = useIPTV()
  const { isFavorite, toggleFavorite } = useFavorites()
  const countryData = countries.find((c) => c.code === channel.country)
  const favorite = isFavorite(channel.id)

  const isLarge = size === "large"

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(channel.id)
  }

  return (
    <Link
      href={`/channel/${encodeURIComponent(channel.id)}`}
      className={`
        block group relative flex-shrink-0 rounded-xl overflow-hidden bg-card
        transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-accent/20
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${isLarge ? "w-[320px] h-[200px]" : "w-[240px] h-[150px]"}
      `}
      aria-label={`Watch ${channel.name} from ${countryData?.name || channel.country}`}
    >
      {/* Channel Logo/Thumbnail */}
      <div className="absolute inset-0 bg-secondary">
        {!imageError ? (
          <Image
            src={channel.logo || "/placeholder.svg"}
            alt={`${channel.name} logo`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            sizes={isLarge ? "320px" : "240px"}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-4xl font-bold">{channel.name.charAt(0)}</span>
          </div>
        )}
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />

      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-3 left-3 h-8 w-8 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-all ${
          favorite ? "text-red-500" : "text-muted-foreground opacity-0 group-hover:opacity-100"
        }`}
        onClick={handleFavoriteClick}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />
      </Button>

      {/* Live Badge */}
      {channel.isLive && (
        <div className="absolute top-3 right-3">
          <Badge variant="destructive" className="bg-red-600 text-foreground text-xs font-medium px-2 py-0.5">
            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" />
            LIVE
          </Badge>
        </div>
      )}

      {/* Channel Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className={`font-semibold text-foreground truncate ${isLarge ? "text-lg" : "text-base"}`}>
          {channel.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {countryData && (
            <Badge variant="secondary" className="text-xs bg-secondary/80 text-secondary-foreground">
              {countryData.flag} {countryData.name}
            </Badge>
          )}
          {channel.languages[0] && (
            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
              {languages.find((l) => l.code === channel.languages[0])?.name || channel.languages[0]}
            </Badge>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-xl ring-2 ring-accent/50" />
      </div>
    </Link>
  )
}
