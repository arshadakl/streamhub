"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Channel } from "@/lib/types"
import { useIPTV } from "@/lib/iptv-context"

interface HeroCarouselProps {
  channels: Channel[]
}

export function HeroCarousel({ channels }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { countries } = useIPTV()

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % channels.length)
  }, [channels.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + channels.length) % channels.length)
  }, [channels.length])

  useEffect(() => {
    if (isPaused || channels.length <= 1) return

    const timer = setInterval(goToNext, 6000)
    return () => clearInterval(timer)
  }, [isPaused, goToNext, channels.length])

  if (channels.length === 0) return null

  const currentChannel = channels[currentIndex]
  const countryData = countries.find((c) => c.code === currentChannel.country)

  return (
    <section
      className="relative h-[60vh] min-h-[400px] max-h-[700px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured channels"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentChannel.logo || "/placeholder.svg"}
          alt=""
          fill
          className="object-cover blur-sm scale-110 transition-all duration-700"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-6 lg:px-12">
        <div className="max-w-2xl space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-3">
            {currentChannel.isLive && (
              <Badge variant="destructive" className="bg-red-600 text-foreground px-3 py-1">
                <span className="mr-2 h-2 w-2 rounded-full bg-foreground animate-pulse" />
                LIVE NOW
              </Badge>
            )}
            {countryData && (
              <Badge variant="secondary" className="text-sm bg-secondary text-secondary-foreground">
                {countryData.flag} {countryData.name}
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
            {currentChannel.name}
          </h1>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {currentChannel.categories.map((cat) => (
              <Badge key={cat} variant="outline" className="capitalize border-border text-muted-foreground">
                {cat}
              </Badge>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-4 pt-2">
            <Button size="lg" className="gap-2 bg-foreground text-background hover:bg-foreground/90" asChild>
              <Link href={`/channel/${currentChannel.id}`}>
                <Play className="h-5 w-5 fill-current" />
                Watch Now
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-border text-foreground hover:bg-secondary bg-transparent"
              asChild
            >
              <Link href={`/channel/${currentChannel.id}`}>More Info</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {channels.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/50 text-foreground hover:bg-background/70 backdrop-blur-sm"
            onClick={goToPrev}
            aria-label="Previous channel"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/50 text-foreground hover:bg-background/70 backdrop-blur-sm"
            onClick={goToNext}
            aria-label="Next channel"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Dots Indicator */}
      {channels.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2" role="tablist">
          {channels.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-8 bg-foreground" : "w-1.5 bg-foreground/40 hover:bg-foreground/60"
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
