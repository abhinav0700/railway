import { NextResponse } from "next/server"
import { testDatabaseConnection } from "@/lib/neon-setup"

export async function GET() {
  try {
    const dbStatus = await testDatabaseConnection()

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: {
        nodeEnv: process.env.NODE_ENV || "development",
        hasNeonUrl: !!process.env.NEON_DATABASE_URL,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
        version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      },
      features: {
        directRoutes: true,
        connectingRoutes: true,
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
        database: { connected: false },
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
