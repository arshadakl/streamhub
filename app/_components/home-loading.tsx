import { Skeleton } from "@/components/ui/skeleton"

/**
 * Loading skeleton for the home page
 * Displays while channels are being fetched from IPTV-org
 */
export function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Loading Banner */}
      <div className="bg-gradient-to-r from-accent/10 via-transparent to-accent/10 border-b border-border">
        <div className="px-6 lg:px-12 py-3 flex items-center justify-center gap-6 text-sm">
          <span className="text-muted-foreground">Loading channels from IPTV-org...</span>
        </div>
      </div>
      
      {/* Hero Skeleton */}
      <Skeleton className="h-[60vh] w-full" />
      
      {/* Content Skeleton */}
      <div className="px-6 lg:px-12 py-6 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="w-[240px] h-[150px] flex-shrink-0 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}
