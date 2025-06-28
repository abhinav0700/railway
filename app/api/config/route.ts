import { NextResponse } from "next/server"

// API Configuration endpoint - useful for debugging and monitoring
export async function GET() {
  return NextResponse.json({
    status: "operational",
    version: "1.0.0",
    database: {
      connected: !!process.env.DATABASE_URL || !!process.env.NEON_DATABASE_URL,
      provider: "neon",
    },
    features: {
      directRoutes: true,
      connectingRoutes: true,
      priceCalculation: true,
      sorting: true,
    },
    pricing: {
      baseRate: 1.25,
      currency: "INR",
      unit: "per_km",
    },
  })
}
