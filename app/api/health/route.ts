import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/neon-setup"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  try {
    // Check if database is configured
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        status: "partial",
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          configured: false,
          message: "Database not configured. Please set NEON_DATABASE_URL environment variable.",
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || "development",
          hasNeonUrl: !!process.env.NEON_DATABASE_URL,
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        },
        features: {
          directRoutes: false,
          connectingRoutes: false,
          priceCalculation: true,
          sorting: true,
          realTimeUpdates: false,
        },
        pricing: {
          baseRate: 1.25,
          currency: "INR",
          unit: "per_km",
        },
      })
    }

    // Test database connection
    const dbStatus = await testDatabaseConnection()

    return NextResponse.json({
      status: dbStatus.connected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        ...dbStatus,
        configured: true,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        hasNeonUrl: !!process.env.NEON_DATABASE_URL,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      },
      features: {
        directRoutes: dbStatus.connected,
        connectingRoutes: dbStatus.connected,
        priceCalculation: true,
        sorting: true,
        realTimeUpdates: false,
      },
      pricing: {
        baseRate: 1.25,
        currency: "INR",
        unit: "per_km",
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
        database: {
          connected: false,
          configured: isDatabaseAvailable(),
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || "development",
          hasNeonUrl: !!process.env.NEON_DATABASE_URL,
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        },
      },
      { status: 500 },
    )
  }
}
