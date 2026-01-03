"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChannelCard } from "./channel-card"
import type { Channel } from "@/lib/types"

interface ChannelRowProps {
  title: string
  channels: Channel[]
  seeAllHref?: string
  cardSize?: "default" | "large"
}

export function ChannelRow({ title, channels, seeAllHref, cardSize = "default" }: ChannelRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  if (channels.length === 0) return null

  return (
    <section className="py-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 lg:px-12 mb-4">
        <h2 className="text-xl lg:text-2xl font-semibold text-foreground">{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <a href={seeAllHref}>See All</a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-6 lg:px-12 pb-2"
        role="list"
        aria-label={`${title} channels`}
      >
        {channels.map((channel) => (
          <div key={channel.id} role="listitem">
            <ChannelCard channel={channel} size={cardSize} />
          </div>
        ))}
      </div>
    </section>
  )
}
