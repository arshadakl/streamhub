"use client"

import { useIPTV } from "@/lib/iptv-context"
import { Tv } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const { channels, countries, categories } = useIPTV()

  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="px-6 lg:px-12 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-foreground mb-4">
              <Tv className="h-6 w-6" />
              <span className="font-bold text-lg">StreamHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Your gateway to {channels.length.toLocaleString()}+ live TV channels from around the world.
            </p>
            <p className="text-xs text-muted-foreground">
              {countries.length} Countries • {categories.length} Categories
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Built by{" "}
              <a
                href="https://arshadakl.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                arshadakl.in
              </a>
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
                  Explore All
                </Link>
              </li>
              <li>
                <Link href="/category/news" className="text-muted-foreground hover:text-foreground transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/category/sports" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link
                  href="/category/entertainment"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Entertainment
                </Link>
              </li>
              <li>
                <Link href="/category/movies" className="text-muted-foreground hover:text-foreground transition-colors">
                  Movies
                </Link>
              </li>
            </ul>
          </div>

          {/* Countries - India first */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Countries</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/country/in" className="text-muted-foreground hover:text-foreground transition-colors">
                  India
                </Link>
              </li>
              <li>
                <Link href="/country/us" className="text-muted-foreground hover:text-foreground transition-colors">
                  United States
                </Link>
              </li>
              <li>
                <Link href="/country/gb" className="text-muted-foreground hover:text-foreground transition-colors">
                  United Kingdom
                </Link>
              </li>
              <li>
                <Link href="/country/pk" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pakistan
                </Link>
              </li>
              <li>
                <Link href="/country/bd" className="text-muted-foreground hover:text-foreground transition-colors">
                  Bangladesh
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} StreamHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
