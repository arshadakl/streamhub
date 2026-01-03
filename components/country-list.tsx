import Link from "next/link"
import type { Country } from "@/lib/types"

interface CountryListProps {
  countries: Country[]
  title?: string
}

export function CountryList({ countries, title = "Popular Countries" }: CountryListProps) {
  return (
    <section className="py-8 px-6 lg:px-12">
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {countries.map((country) => (
          <Link
            key={country.code}
            href={`/country/${country.code.toLowerCase()}`}
            className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border
              transition-all duration-300 hover:bg-secondary hover:border-accent/50
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-2xl" role="img" aria-label={country.name}>
              {country.flag}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{country.name}</p>
              <p className="text-xs text-muted-foreground">{country.channelCount} channels</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
