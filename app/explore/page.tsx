import { Suspense } from "react"
import { ExploreContent } from "@/components/explore-content"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Explore Channels - StreamHub",
  description: "Discover and filter live TV channels by country, language, and category. Indian channels prioritized.",
}

function ExplorePageSkeleton() {
  return (
    <div className="min-h-screen">
      <section className="py-8 lg:py-12 px-6 lg:px-12 border-b border-border">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </section>
      <div className="flex flex-col lg:flex-row gap-8 px-6 lg:px-12 py-8">
        <Skeleton className="w-full lg:w-72 h-96" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExplorePageSkeleton />}>
      <ExploreContent />
    </Suspense>
  )
}
