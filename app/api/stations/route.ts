import { NextResponse } from "next/server"
import { getAllStations } from "@/lib/train-service"
import { isDatabaseAvailable } from "@/lib/database"

export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      // Return mock data when database is not configured
      const mockStations = [
        { id: 1, name: "New Delhi", code: "NDLS" },
        { id: 2, name: "Mumbai Central", code: "MMCT" },
        { id: 3, name: "Chennai Central", code: "MAS" },
        { id: 4, name: "Bangalore City", code: "SBC" },
        { id: 5, name: "Kolkata", code: "KOAA" },
        { id: 6, name: "Hyderabad Deccan", code: "HYB" },
        { id: 7, name: "Pune Junction", code: "PUNE" },
        { id: 8, name: "Ahmedabad Junction", code: "ADI" },
        { id: 9, name: "Jaipur Junction", code: "JP" },
        { id: 10, name: "Lucknow", code: "LKO" },
      ]

      return NextResponse.json({
        data: mockStations,
        meta: {
          total: mockStations.length,
          mock: true,
          message: "Database not configured. Showing demo data.",
        },
      })
    }

    const stations = await getAllStations()
    return NextResponse.json({
      data: stations,
      meta: {
        total: stations.length,
        mock: false,
      },
    })
  } catch (error) {
    console.error("Error fetching stations:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
