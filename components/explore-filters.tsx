"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useCallback, useTransition } from "react"
import { Search, X, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useIPTV } from "@/lib/iptv-context"

export function ExploreFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const { countries, languages, categories } = useIPTV()

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [isFiltersOpen, setIsFiltersOpen] = useState(true)

  // Parse current filters from URL
  const selectedCountries = searchParams.get("countries")?.split(",").filter(Boolean) || []
  const selectedLanguages = searchParams.get("languages")?.split(",").filter(Boolean) || []
  const selectedCategories = searchParams.get("categories")?.split(",").filter(Boolean) || []

  const updateFilters = useCallback(
    (key: string, values: string[]) => {
      const params = new URLSearchParams(searchParams.toString())

      if (values.length > 0) {
        params.set(key, values.join(","))
      } else {
        params.delete(key)
      }

      startTransition(() => {
        router.push(`/explore?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams],
  )

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value)
      const params = new URLSearchParams(searchParams.toString())

      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }

      startTransition(() => {
        router.push(`/explore?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams],
  )

  const toggleFilter = (key: string, value: string, currentValues: string[]) => {
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    updateFilters(key, newValues)
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    router.push("/explore", { scroll: false })
  }

  const hasActiveFilters =
    searchQuery || selectedCountries.length > 0 || selectedLanguages.length > 0 || selectedCategories.length > 0

  // Sort countries with India first
  const sortedCountries = [...countries].sort((a, b) => {
    if (a.code === "IN") return -1
    if (b.code === "IN") return 1
    return b.channelCount - a.channelCount
  })

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-20 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
            aria-label="Search channels"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Filters</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground h-auto p-0">
              Clear all
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map((code) => {
              const country = countries.find((c) => c.code === code)
              return (
                <Badge
                  key={code}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleFilter("countries", code, selectedCountries)}
                >
                  {country?.flag} {country?.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
            {selectedLanguages.map((code) => {
              const lang = languages.find((l) => l.code === code)
              return (
                <Badge
                  key={code}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => toggleFilter("languages", code, selectedLanguages)}
                >
                  {lang?.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c.id === id)
              return (
                <Badge
                  key={id}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground capitalize"
                  onClick={() => toggleFilter("categories", id, selectedCategories)}
                >
                  {cat?.name}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )
            })}
          </div>
        )}

        {/* Filter Sections */}
        <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent">
              <span className="text-sm text-muted-foreground">Filter Options</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${isFiltersOpen ? "rotate-180" : ""}`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pt-4">
            {/* Countries */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Countries</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sortedCountries.slice(0, 30).map((country) => (
                  <label key={country.code} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedCountries.includes(country.code)}
                      onCheckedChange={() => toggleFilter("countries", country.code, selectedCountries)}
                      aria-label={`Filter by ${country.name}`}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {country.flag} {country.name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{country.channelCount}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Languages</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {languages.slice(0, 30).map((lang) => (
                  <label key={lang.code} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedLanguages.includes(lang.code)}
                      onCheckedChange={() => toggleFilter("languages", lang.code, selectedLanguages)}
                      aria-label={`Filter by ${lang.name}`}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {lang.name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{lang.channelCount}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={selectedCategories.includes(cat.id)}
                      onCheckedChange={() => toggleFilter("categories", cat.id, selectedCategories)}
                      aria-label={`Filter by ${cat.name}`}
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {cat.icon} {cat.name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">{cat.channelCount}</span>
                  </label>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Loading indicator */}
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Updating...
          </div>
        )}
      </div>
    </aside>
  )
}
