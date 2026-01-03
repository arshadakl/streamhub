interface StatsBannerProps {
  totalChannels: number
  countriesCount: number
  categoriesCount: number
  isInternational: boolean
}

/**
 * Stats banner displaying channel, country, and category counts
 * Also shows the current mode (International vs India)
 */
export function StatsBanner({
  totalChannels,
  countriesCount,
  categoriesCount,
  isInternational,
}: StatsBannerProps) {
  return (
    <div className="bg-gradient-to-r from-accent/10 via-transparent to-accent/10 border-b border-border">
      <div className="px-6 lg:px-12 py-3 flex items-center justify-center gap-6 text-sm">
        <span className="text-muted-foreground">
          <span className="font-semibold text-foreground">{totalChannels.toLocaleString()}+</span> Live
          Channels
        </span>
        <span className="hidden sm:inline text-border">|</span>
        <span className="hidden sm:inline text-muted-foreground">
          <span className="font-semibold text-foreground">{countriesCount}</span> Countries
        </span>
        <span className="hidden sm:inline text-border">|</span>
        <span className="hidden sm:inline text-muted-foreground">
          <span className="font-semibold text-foreground">{categoriesCount}</span> Categories
        </span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">
          Mode: <span className="font-semibold text-accent">{isInternational ? "International" : "India"}</span>
        </span>
      </div>
    </div>
  )
}
