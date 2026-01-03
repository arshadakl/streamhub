"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FavoritesContextType {
  favorites: string[]
  addFavorite: (channelId: string) => void
  removeFavorite: (channelId: string) => void
  toggleFavorite: (channelId: string) => void
  isFavorite: (channelId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | null>(null)

const STORAGE_KEY = "iptv-favorites"

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Failed to load favorites:", error)
    }
    setIsHydrated(true)
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error("Failed to save favorites:", error)
      }
    }
  }, [favorites, isHydrated])

  const addFavorite = (channelId: string) => {
    setFavorites((prev) => (prev.includes(channelId) ? prev : [...prev, channelId]))
  }

  const removeFavorite = (channelId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== channelId))
  }

  const toggleFavorite = (channelId: string) => {
    setFavorites((prev) => (prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]))
  }

  const isFavorite = (channelId: string) => {
    return favorites.includes(channelId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
