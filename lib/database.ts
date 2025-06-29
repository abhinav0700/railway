import { neon } from "@neondatabase/serverless"

// Neon database configuration with multiple fallback options
const DATABASE_URL =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL

if (!DATABASE_URL) {
  console.warn("⚠️ No database URL found. Database features will be disabled.")
}

// Initialize database connection
let sql: any = null

if (DATABASE_URL) {
  try {
    sql = neon(DATABASE_URL)
    console.log("✅ Database connection initialized")
  } catch (error) {
    console.error("❌ Failed to initialize database connection:", error)
  }
} else if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
  console.warn("⚠️ Database not configured. Using demo mode.")
}

// Safe database connection function
export function getSql() {
  if (!sql) {
    throw new Error("Database not configured. Please set DATABASE_URL environment variable.")
  }
  return sql
}

// Database configuration
export const DB_CONFIG = {
  // Connection settings
  connectionTimeoutMillis: 30000,
  idleTimeoutMillis: 30000,
  maxRetries: 3,
  retryDelay: 1000,

  // Application settings - ensure this is a number
  pricePerKm: Number(process.env.PRICE_PER_KM) || 1.25, // ₹1.25 per km
  maxConnectingRoutes: 5,
  searchTimeout: 10000,

  // App metadata from environment
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",

  // Database connection info
  host: process.env.PGHOST || process.env.POSTGRES_HOST,
  database: process.env.PGDATABASE || process.env.POSTGRES_DATABASE,
  user: process.env.PGUSER || process.env.POSTGRES_USER,
}

// Check if database is available
export function isDatabaseAvailable(): boolean {
  return !!DATABASE_URL && !!sql
}

// Database connection status
export function getDatabaseStatus() {
  return {
    configured: !!DATABASE_URL,
    connected: !!sql,
    host: DB_CONFIG.host,
    database: DB_CONFIG.database,
    user: DB_CONFIG.user,
    hasPooling: !!process.env.DATABASE_URL,
    hasUnpooled: !!process.env.DATABASE_URL_UNPOOLED,
    pricePerKm: DB_CONFIG.pricePerKm,
  }
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
