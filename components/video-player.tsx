"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Hls from "hls.js"
import type { StreamStatus } from "@/lib/types"

interface VideoPlayerProps {
  streamUrl: string
  channelName: string
  poster?: string
}

export function VideoPlayer({ streamUrl, channelName, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [status, setStatus] = useState<StreamStatus>({ type: "idle" })
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout>>()

  // Error messages map for user-friendly display
  const errorMessages: Record<string, { title: string; message: string; canRetry: boolean }> = {
    MEDIA_ERR_ABORTED: {
      title: "Playback Stopped",
      message: "The video playback was interrupted. Please try again.",
      canRetry: true,
    },
    MEDIA_ERR_NETWORK: {
      title: "Network Error",
      message: "Unable to load the stream. Please check your internet connection.",
      canRetry: true,
    },
    MEDIA_ERR_DECODE: {
      title: "Playback Error",
      message: "This stream format is not supported by your browser.",
      canRetry: false,
    },
    MEDIA_ERR_SRC_NOT_SUPPORTED: {
      title: "Stream Unavailable",
      message: "This channel is currently unavailable. It may be geo-restricted or temporarily offline.",
      canRetry: true,
    },
    CORS_ERROR: {
      title: "Access Restricted",
      message: "This stream cannot be played due to access restrictions.",
      canRetry: false,
    },
    TIMEOUT: {
      title: "Connection Timeout",
      message: "The stream took too long to respond. Please try again.",
      canRetry: true,
    },
    DEFAULT: {
      title: "Something Went Wrong",
      message: "We couldn't play this stream. Please try again later.",
      canRetry: true,
    },
  }

  const handleError = useCallback((errorCode?: string) => {
    const error = errorMessages[errorCode || "DEFAULT"] || errorMessages.DEFAULT
    setStatus({
      type: "error",
      message: error.message,
      canRetry: error.canRetry,
    })
    setIsPlaying(false)
  }, [])

  const handlePlay = useCallback(async () => {
    if (!videoRef.current) return

    setStatus({ type: "loading" })

    // Destroy existing HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    const video = videoRef.current

    // Check if URL is HLS stream
    const isHls = streamUrl.includes(".m3u8")

    if (isHls && Hls.isSupported()) {
      // Use HLS.js for HLS streams
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      hlsRef.current = hls

      hls.loadSource(streamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video
          .play()
          .then(() => {
            setStatus({ type: "playing" })
            setIsPlaying(true)
          })
          .catch((err) => {
            console.log("[v0] Play failed:", err)
            handleError("DEFAULT")
          })
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.log("[v0] HLS Error:", data)
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              handleError("MEDIA_ERR_NETWORK")
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              // Try to recover from media errors
              hls.recoverMediaError()
              break
            default:
              handleError("DEFAULT")
              break
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native HLS support (Safari)
      video.src = streamUrl
      video.addEventListener("loadedmetadata", () => {
        video
          .play()
          .then(() => {
            setStatus({ type: "playing" })
            setIsPlaying(true)
          })
          .catch(() => handleError("DEFAULT"))
      })
      video.addEventListener("error", () => {
        handleError("MEDIA_ERR_SRC_NOT_SUPPORTED")
      })
    } else {
      // Try direct playback for non-HLS streams (MP4, etc.)
      video.src = streamUrl
      video.addEventListener("loadedmetadata", () => {
        video
          .play()
          .then(() => {
            setStatus({ type: "playing" })
            setIsPlaying(true)
          })
          .catch(() => handleError("DEFAULT"))
      })
      video.addEventListener("error", () => {
        handleError("MEDIA_ERR_SRC_NOT_SUPPORTED")
      })
    }
  }, [streamUrl, handleError])

  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    setStatus({ type: "idle" })
    handlePlay()
  }

  const togglePlay = () => {
    if (status.type === "error") {
      handleRetry()
      return
    }

    if (status.type === "idle") {
      handlePlay()
    } else if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0]
      videoRef.current.volume = newVolume
      setVolume(newVolume)
      setIsMuted(newVolume === 0)
    }
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current.requestFullscreen()
    }
  }

  // Auto-hide controls
  const resetControlsTimeout = useCallback(() => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }, [isPlaying])

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-secondary rounded-xl overflow-hidden group"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-secondary"
        poster={poster}
        playsInline
        aria-label={`${channelName} live stream`}
      />

      {/* Overlay States */}
      {status.type === "idle" && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/80">
          <Button
            size="lg"
            className="rounded-full h-20 w-20 bg-foreground text-background hover:bg-foreground/90 hover:scale-110 transition-transform"
            onClick={handlePlay}
            aria-label="Play stream"
          >
            <Play className="h-10 w-10 fill-current ml-1" />
          </Button>
        </div>
      )}

      {status.type === "loading" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/90">
          <Loader2 className="h-12 w-12 text-foreground animate-spin" />
          <p className="mt-4 text-foreground font-medium">Connecting to stream...</p>
          <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
        </div>
      )}

      {status.type === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/95 p-6">
          <Alert variant="destructive" className="max-w-md bg-card border-destructive">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-foreground">Stream Unavailable</AlertTitle>
            <AlertDescription className="text-muted-foreground mt-2">{status.message}</AlertDescription>
            {status.canRetry && (
              <Button variant="outline" size="sm" className="mt-4 gap-2 bg-transparent" onClick={handleRetry}>
                <RotateCcw className="h-4 w-4" />
                Try Again {retryCount > 0 && `(${retryCount})`}
              </Button>
            )}
          </Alert>
        </div>
      )}

      {/* Controls Overlay */}
      {status.type === "playing" && (
        <div
          className={`absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/40 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-4">
            <span className="text-sm font-medium text-foreground">{channelName}</span>
          </div>

          {/* Center Play/Pause */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full h-16 w-16 bg-foreground/20 hover:bg-foreground/30 text-foreground backdrop-blur-sm"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-foreground hover:bg-foreground/20"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-foreground/20"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-24"
                aria-label="Volume"
              />
            </div>

            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-foreground/20"
                onClick={toggleFullscreen}
                aria-label="Toggle fullscreen"
              >
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Live Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-foreground text-sm font-medium">
        <span className="h-2 w-2 rounded-full bg-foreground animate-pulse" />
        LIVE
      </div>
    </div>
  )
}
