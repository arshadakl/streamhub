/**
 * Application Configuration
 *
 * Centralized configuration for the IPTV Directory App.
 * Environment variables should be prefixed with NEXT_PUBLIC_ to be available on the client side.

 */

// IPTV API Configuration
export const IPTV_API_BASE_URL =
    process.env.NEXT_PUBLIC_IPTV_API_BASE_URL || ""

// API Endpoints
export const API_ENDPOINTS = {
    channels: `${IPTV_API_BASE_URL}/channels.json`,
    streams: `${IPTV_API_BASE_URL}/streams.json`,
    countries: `${IPTV_API_BASE_URL}/countries.json`,
    languages: `${IPTV_API_BASE_URL}/languages.json`,
    categories: `${IPTV_API_BASE_URL}/categories.json`,
    logos: `${IPTV_API_BASE_URL}/logos.json`,
} as const
