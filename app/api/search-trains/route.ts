import { type NextRequest, NextResponse } from "next/server"
import { searchTrains } from "@/lib/train-service"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get("source")
    const destination = searchParams.get("destination")

    if (!source || !destination) {
      return NextResponse.json({ error: "Source and destination are required" }, { status: 400 })
    }

    const sourceId = Number.parseInt(source)
    const destinationId = Number.parseInt(destination)

    if (isNaN(sourceId) || isNaN(destinationId)) {
      return NextResponse.json({ error: "Invalid station IDs" }, { status: 400 })
    }

    if (sourceId === destinationId) {
      return NextResponse.json({ error: "Source and destination cannot be the same" }, { status: 400 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        data: [],
        meta: {
          total: 0,
          mock: true,
          message: "Database not configured. Please set NEON_DATABASE_URL to search trains.",
        },
      })
    }

    const trains = await searchTrains(sourceId, destinationId)
    return NextResponse.json({
      data: trains,
      meta: {
        total: trains.length,
        mock: false,
      },
    })
  } catch (error) {
    console.error("Error searching trains:", error)
    return NextResponse.json(
      {
        error: "Failed to search trains",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
