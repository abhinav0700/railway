import { neon } from "@neondatabase/serverless"

// Neon database configuration with build-time safety
const DATABASE_URL = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL

// Only throw error at runtime, not during build
let sql: any = null

if (DATABASE_URL) {
  sql = neon(DATABASE_URL)
} else if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  // Only warn during development, not during build
  console.warn("⚠️ NEON_DATABASE_URL not found. Database features will be disabled.")
}

// Safe database connection function
export function getSql() {
  if (!sql) {
    throw new Error("Database not configured. Please set NEON_DATABASE_URL environment variable.")
  }
  return sql
}

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

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return !!DATABASE_URL && !!sql
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
