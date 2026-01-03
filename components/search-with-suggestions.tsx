"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Tv } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useIPTV } from "@/lib/iptv-context"
import type { Channel } from "@/lib/types"

export function SearchWithSuggestions() {
  const router = useRouter()
  const { channels } = useIPTV()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<Channel[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(
    (value: string) => {
      setQuery(value)
      if (value.trim().length > 0) {
        const lowerQuery = value.toLowerCase()
        const results = channels.filter((ch) => ch.name.toLowerCase().includes(lowerQuery)).slice(0, 10)
        setSuggestions(results)
        setSelectedIndex(-1)
      } else {
        setSuggestions([])
      }
    },
    [channels],
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        router.push(`/channel/${encodeURIComponent(suggestions[selectedIndex].id)}`)
        handleClose()
      } else if (query.trim()) {
        router.push(`/explore?search=${encodeURIComponent(query)}`)
        handleClose()
      }
    } else if (e.key === "Escape") {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setQuery("")
    setSuggestions([])
    setSelectedIndex(-1)
  }

  const handleSelectChannel = (channel: Channel) => {
    router.push(`/channel/${encodeURIComponent(channel.id)}`)
    handleClose()
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            ref={inputRef}
            type="search"
            placeholder={`Search ${channels.length.toLocaleString()}+ channels...`}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-56 md:w-72 bg-secondary border-border text-foreground placeholder:text-muted-foreground pr-8"
            autoFocus
            aria-label="Search channels"
            aria-expanded={suggestions.length > 0}
            aria-controls="search-suggestions"
            role="combobox"
          />
          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close search">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div
          id="search-suggestions"
          className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50"
          role="listbox"
        >
          {suggestions.map((channel, index) => (
            <button
              key={channel.id}
              onClick={() => handleSelectChannel(channel)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${index === selectedIndex ? "bg-accent" : "hover:bg-secondary"}
                ${index !== suggestions.length - 1 ? "border-b border-border" : ""}`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {channel.logo.includes("placeholder") ? (
                  <Tv className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <img
                    src={channel.logo || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{channel.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {channel.categories.join(", ")} • {channel.country}
                </p>
              </div>
              {channel.isLive && (
                <span className="flex items-center gap-1 text-xs text-green-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  LIVE
                </span>
              )}
            </button>
          ))}
          {query.trim() && (
            <button
              onClick={() => {
                router.push(`/explore?search=${encodeURIComponent(query)}`)
                handleClose()
              }}
              className="w-full px-4 py-3 text-left text-sm text-accent hover:bg-secondary transition-colors border-t border-border"
            >
              Search all channels for "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  )
}
