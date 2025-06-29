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

    // Validate and parse station IDs
    const sourceId = Number.parseInt(source, 10)
    const destinationId = Number.parseInt(destination, 10)

    if (isNaN(sourceId) || isNaN(destinationId)) {
      return NextResponse.json({ error: "Invalid station IDs. Must be valid integers." }, { status: 400 })
    }

    if (sourceId === destinationId) {
      return NextResponse.json({ error: "Source and destination cannot be the same" }, { status: 400 })
    }

    // Check if source and destination are positive integers
    if (sourceId <= 0 || destinationId <= 0) {
      return NextResponse.json({ error: "Station IDs must be positive integers" }, { status: 400 })
    }

    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        data: [],
        meta: {
          total: 0,
          mock: true,
          message: "Database not configured. Please set DATABASE_URL to search trains.",
        },
      })
    }

    console.log(`Searching trains from station ${sourceId} to station ${destinationId}`)

    const trains = await searchTrains(sourceId, destinationId)

    console.log(`Found ${trains.length} trains`)

    return NextResponse.json({
      data: trains,
      meta: {
        total: trains.length,
        mock: false,
        sourceId,
        destinationId,
      },
    })
  } catch (error) {
    console.error("Error searching trains:", error)

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    const errorDetails = error instanceof Error ? error.stack : "No stack trace available"

    console.error("Error details:", errorDetails)

    return NextResponse.json(
      {
        error: "Failed to search trains",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
