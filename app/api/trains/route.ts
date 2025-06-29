import { type NextRequest, NextResponse } from "next/server"
import { getSql, isDatabaseAvailable } from "@/lib/database"

// GET - Fetch all trains
export async function GET() {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json({
        data: [],
        meta: {
          total: 0,
          mock: true,
          message: "Database not configured. Please set DATABASE_URL to manage trains.",
        },
      })
    }

    const sql = getSql()
    const trains = await sql`
      SELECT 
        t.id,
        t.name,
        t.train_number,
        t.train_type,
        t.is_active,
        t.created_at,
        COUNT(tr.id) as route_count
      FROM trains t
      LEFT JOIN train_routes tr ON t.id = tr.train_id AND tr.is_active = true
      WHERE t.is_active = true
      GROUP BY t.id, t.name, t.train_number, t.train_type, t.is_active, t.created_at
      ORDER BY t.created_at DESC
    `

    return NextResponse.json({
      data: trains,
      meta: {
        total: trains.length,
        mock: false,
      },
    })
  } catch (error) {
    console.error("Error fetching trains:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch trains",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// POST - Add new train
export async function POST(request: NextRequest) {
  try {
    if (!isDatabaseAvailable()) {
      return NextResponse.json(
        {
          error: "Database not configured",
          message: "Please set DATABASE_URL to add trains.",
        },
        { status: 503 },
      )
    }

    const body = await request.json()
    const { name, train_number, train_type, routes } = body

    // Validate required fields
    if (!name || !train_number || !train_type) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "name, train_number, and train_type are required",
        },
        { status: 400 },
      )
    }

    // Validate routes
    if (!routes || !Array.isArray(routes) || routes.length < 2) {
      return NextResponse.json(
        {
          error: "Invalid routes",
          details: "At least 2 route stations are required",
        },
        { status: 400 },
      )
    }

    const sql = getSql()

    // Check if train number already exists
    const existingTrain = await sql`
      SELECT id FROM trains WHERE train_number = ${train_number}
    `

    if (existingTrain.length > 0) {
      return NextResponse.json(
        {
          error: "Train number already exists",
          details: `Train number ${train_number} is already in use`,
        },
        { status: 409 },
      )
    }

    // Insert train
    const trainResult = await sql`
      INSERT INTO trains (name, train_number, train_type)
      VALUES (${name}, ${train_number}, ${train_type})
      RETURNING id, name, train_number, train_type, created_at
    `

    const trainId = trainResult[0].id

    // Insert routes
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      await sql`
        INSERT INTO train_routes (
          train_id, 
          station_id, 
          sequence_number, 
          distance_from_start, 
          departure_time, 
          arrival_time,
          halt_duration
        )
        VALUES (
          ${trainId},
          ${route.station_id},
          ${i + 1},
          ${route.distance_from_start || 0},
          ${route.departure_time},
          ${route.arrival_time || route.departure_time},
          ${route.halt_duration || 2}
        )
      `
    }

    return NextResponse.json({
      success: true,
      data: trainResult[0],
      message: `Train ${train_number} added successfully with ${routes.length} stations`,
    })
  } catch (error) {
    console.error("Error adding train:", error)
    return NextResponse.json(
      {
        error: "Failed to add train",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
