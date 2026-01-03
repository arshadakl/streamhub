"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Channel, Country, Language, Category } from "./types"
import { getChannels, getCountries, getLanguages, getCategories, preloadData } from "./iptv-store"

interface IPTVContextType {
  channels: Channel[]
  countries: Country[]
  languages: Language[]
  categories: Category[]
  isLoading: boolean
  error: string | null
  totalChannels: number
}

const IPTVContext = createContext<IPTVContextType | undefined>(undefined)

export function IPTVProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true)
        preloadData()

        const [ch, co, la, ca] = await Promise.all([getChannels(), getCountries(), getLanguages(), getCategories()])

        setChannels(ch)
        setCountries(co)
        setLanguages(la)
        setCategories(ca)
        setError(null)
      } catch (err) {
        setError("Failed to load channel data. Please try again.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  return (
    <IPTVContext.Provider
      value={{
        channels,
        countries,
        languages,
        categories,
        isLoading,
        error,
        totalChannels: channels.length,
      }}
    >
      {children}
    </IPTVContext.Provider>
  )
}

export function useIPTV() {
  const context = useContext(IPTVContext)
  if (!context) {
    throw new Error("useIPTV must be used within an IPTVProvider")
  }
  return context
}
