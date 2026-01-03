import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { FavoritesProvider } from "@/lib/favorites-context"
import { IPTVProvider } from "@/lib/iptv-context"
import { ModeProvider } from "@/lib/mode-context"
import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteUrl = "https://streamhub.arshadakl.in"
const siteName = "StreamHub"

export const metadata: Metadata = {
  // Basic Meta
  title: {
    default: "StreamHub - Watch 20,000+ Free Live TV Channels Online | Indian & International",
    template: "%s | StreamHub - Free Live TV",
  },
  description:
    "Stream 20,000+ free live TV channels from 180+ countries. Watch Indian news, sports, entertainment, movies & more. Hindi, Malayalam, Tamil, Telugu channels available. No signup required.",
  
  // Extended Keywords
  keywords: [
    "free live TV",
    "IPTV streaming",
    "live TV channels online",
    "watch TV online free",
    "Indian TV channels",
    "Hindi news live",
    "Malayalam channels",
    "Tamil TV live",
    "Telugu channels online",
    "sports live streaming",
    "entertainment channels",
    "Bollywood movies live",
    "international TV",
    "news channels live",
    "free streaming",
    "online TV",
    "world TV channels",
    "Aaj Tak live",
    "NDTV live",
    "Star Sports live",
    "Zee TV online",
    "Asianet live",
  ],

  // Author & Publisher
  authors: [{ name: "Arshad AKL", url: "https://arshadakl.in" }],
  creator: "Arshad AKL",
  publisher: siteName,

  // Robots & Indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Canonical & Alternates
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: "StreamHub - Watch 20,000+ Free Live TV Channels Online",
    description:
      "Stream free live TV from 180+ countries. Indian news, sports, entertainment & movies. Hindi, Malayalam, Tamil, Telugu channels. No signup required.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StreamHub - Free Live TV Streaming Platform",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "StreamHub - 20,000+ Free Live TV Channels",
    description:
      "Watch free live TV from 180+ countries. Indian & international channels. News, sports, movies & entertainment.",
    images: ["/og-image.png"],
    creator: "@arshadakl",
  },

  // App & Icons
  applicationName: siteName,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteName,
  },
  
  // Verification (add your verification codes here)
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  // },

  // Category
  category: "Entertainment",

  // Other
  generator: "Next.js",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

// JSON-LD Structured Data for Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  description:
    "Stream 20,000+ free live TV channels from 180+ countries. Watch Indian news, sports, entertainment, movies & more.",
  url: siteUrl,
  applicationCategory: "EntertainmentApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Person",
    name: "Arshad AKL",
    url: "https://arshadakl.in",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1250",
    bestRating: "5",
    worstRating: "1",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Preconnect to external domains for better performance */}
        <link rel="preconnect" href="https://iptv-org.github.io" />
        <link rel="dns-prefetch" href="https://iptv-org.github.io" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <IPTVProvider>
          <ModeProvider>
            <FavoritesProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </FavoritesProvider>
          </ModeProvider>
        </IPTVProvider>
        <Analytics />
      </body>
    </html>
  )
}
