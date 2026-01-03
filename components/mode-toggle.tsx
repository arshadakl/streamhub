"use client"

import { Globe, Home } from "lucide-react"
import { useMode } from "@/lib/mode-context"

export function ModeToggle() {
  const { mode, setMode } = useMode()

  return (
    <div className="flex items-center gap-1 p-1 bg-secondary rounded-full">
      <button
        onClick={() => setMode("normal")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
          ${
            mode === "normal"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        aria-pressed={mode === "normal"}
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">India</span>
      </button>
      <button
        onClick={() => setMode("international")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
          ${
            mode === "international"
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        aria-pressed={mode === "international"}
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">International</span>
      </button>
    </div>
  )
}
