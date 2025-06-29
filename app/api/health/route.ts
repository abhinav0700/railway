import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/neon-setup"
import { isDatabaseAvailable, getDatabaseStatus } from "@/lib/database"

export async function GET() {
  try {
    const dbStatus = getDatabaseStatus()

    // Check if database is configured
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        status: "partial",
        timestamp: new Date().toISOString(),
        database: {
          ...dbStatus,
          connected: false,
          message: "Database configured but connection failed. Please check your credentials.",
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || "development",
          hasNeonUrl: !!process.env.DATABASE_URL,
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        },
        features: {
          directRoutes: false,
          connectingRoutes: false,
          priceCalculation: true,
          sorting: true,
          realTimeUpdates: false,
          authentication: false,
        },
        pricing: {
          baseRate: 1.25,
          currency: "INR",
          unit: "per_km",
        },
      })
    }

    // Test database connection
    const connectionTest = await testDatabaseConnection()

    return NextResponse.json({
      status: connectionTest.connected ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      database: {
        ...dbStatus,
        ...connectionTest,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        hasNeonUrl: !!process.env.DATABASE_URL,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      },
      features: {
        directRoutes: connectionTest.connected,
        connectingRoutes: connectionTest.connected,
        priceCalculation: true,
        sorting: true,
        realTimeUpdates: false,
        authentication: false,
      },
      pricing: {
        baseRate: Number(process.env.PRICE_PER_KM) || 1.25,
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
          ...getDatabaseStatus(),
          connected: false,
        },
        environment: {
          nodeEnv: process.env.NODE_ENV || "development",
          hasNeonUrl: !!process.env.DATABASE_URL,
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
        },
      },
      { status: 500 },
    )
  }
}
