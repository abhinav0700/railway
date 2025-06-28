import { neon } from "@neondatabase/serverless"

// Neon database configuration
const DATABASE_URL = process.env.NEON_DATABASE_URL

if (!DATABASE_URL) {
  throw new Error("NEON_DATABASE_URL environment variable is required. Please add it to your .env.local file.")
}

export const sql = neon(DATABASE_URL)

// Database configuration - Change these settings as needed
export const DB_CONFIG = {
  // Connection settings
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  maxRetries: 3,
  retryDelay: 1000,

  // Application settings
  pricePerKm: 1.25, // Change this to modify price calculation (₹1.25 per km)
  maxConnectingRoutes: 5, // Maximum connecting routes to find
  searchTimeout: 10000, // Search timeout in milliseconds

  // App metadata
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
}

export interface Station {
  id: number
  name: string
  code: string
}

export interface Train {
  id: number
  name: string
  train_number: string
}

export interface TrainRoute {
  id: number
  train_id: number
  station_id: number
  sequence_number: number
  distance_from_start: number
  departure_time: string
}

export interface TrainSearchResult {
  train_name: string
  train_number: string
  departure_time: string
  arrival_time: string
  distance: number
  price: number
  route_type: "direct" | "connecting"
  connecting_train?: {
    train_name: string
    train_number: string
    departure_time: string
    arrival_time: string
    distance: number
    price: number
  }
}
