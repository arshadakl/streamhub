import Link from "next/link"
import type { Category } from "@/lib/types"

interface CategoryGridProps {
  categories: Category[]
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <section className="py-8 px-6 lg:px-12">
      <h2 className="text-xl lg:text-2xl font-semibold text-foreground mb-6">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="group flex flex-col items-center justify-center p-6 rounded-xl bg-card border border-border
              transition-all duration-300 hover:bg-secondary hover:border-accent/50 hover:scale-105
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="text-3xl">{category.icon}</span>
            <span className="mt-3 text-sm font-medium text-foreground">{category.name}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {category.channelCount.toLocaleString()} channels
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
