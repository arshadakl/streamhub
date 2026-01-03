"use client"

import { HomeLoading } from "@/app/_components/home-loading"
import { StatsBanner } from "@/app/_components/stats-banner"
import { useHomePageData } from "@/app/_hooks/use-home-page-data"
import { CategoryGrid } from "@/components/category-grid"
import { ChannelRow } from "@/components/channel-row"
import { CountryList } from "@/components/country-list"
import { HeroCarousel } from "@/components/hero-carousel"

export default function HomePage() {
  const {
    isLoading,
    isInternational,
    totalChannels,
    countriesCount,
    categoriesCount,
    featuredChannels,
    popularChannels,
    newsChannels,
    sportsChannels,
    entertainmentChannels,
    moviesChannels,
    displayCategories,
    displayCountries,
  } = useHomePageData()

  // Loading state
  if (isLoading) {
    return <HomeLoading />
  }

  return (
    <div className="min-h-screen">
      {/* Stats Banner */}
      <StatsBanner
        totalChannels={totalChannels}
        countriesCount={countriesCount}
        categoriesCount={categoriesCount}
        isInternational={isInternational}
      />

      {/* Hero Section */}
      <HeroCarousel channels={featuredChannels} />

      {/* Popular Channels */}
      <ChannelRow
        title={isInternational ? "Popular Worldwide" : "Popular in India"}
        channels={popularChannels}
        cardSize="large"
        seeAllHref="/explore"
      />

      {/* Categories */}
      <CategoryGrid categories={displayCategories} />

      {/* News */}
      {newsChannels.length > 0 && (
        <ChannelRow
          title={isInternational ? "News & Current Affairs" : "Indian News Channels"}
          channels={newsChannels}
          seeAllHref="/category/news"
        />
      )}

      {/* Sports */}
      {sportsChannels.length > 0 && (
        <ChannelRow
          title={isInternational ? "Sports" : "Indian Sports Channels"}
          channels={sportsChannels}
          seeAllHref="/category/sports"
        />
      )}

      {/* Entertainment */}
      {entertainmentChannels.length > 0 && (
        <ChannelRow
          title={isInternational ? "Entertainment" : "Indian Entertainment"}
          channels={entertainmentChannels}
          seeAllHref="/category/entertainment"
        />
      )}

      {/* Movies */}
      {moviesChannels.length > 0 && (
        <ChannelRow
          title={isInternational ? "Movies" : "Bollywood & Indian Movies"}
          channels={moviesChannels}
          seeAllHref="/category/movies"
        />
      )}

      {/* Countries */}
      <CountryList countries={displayCountries} />
    </div>
  )
}
