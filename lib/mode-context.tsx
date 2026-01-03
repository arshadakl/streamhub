"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Mode = "normal" | "international"

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  isInternational: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("normal")

  // Persist mode preference
  useEffect(() => {
    const saved = localStorage.getItem("iptv-mode")
    if (saved === "international" || saved === "normal") {
      setMode(saved)
    }
  }, [])

  const handleSetMode = (newMode: Mode) => {
    setMode(newMode)
    localStorage.setItem("iptv-mode", newMode)
  }

  return (
    <ModeContext.Provider value={{ mode, setMode: handleSetMode, isInternational: mode === "international" }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode() {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
