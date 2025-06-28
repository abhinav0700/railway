import { NextResponse } from "next/server"
import { getAllStations } from "@/lib/train-service"

export async function GET() {
  try {
    const stations = await getAllStations()
    return NextResponse.json(stations)
  } catch (error) {
    console.error("Error fetching stations:", error)
    return NextResponse.json({ error: "Failed to fetch stations" }, { status: 500 })
  }
}
