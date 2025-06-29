import { getSql, type Station, type TrainSearchResult, DB_CONFIG, isDatabaseAvailable } from "./database"

const PRICE_PER_KM = DB_CONFIG.pricePerKm

async function withRetry<T>(operation: () => Promise<T>, retries = DB_CONFIG.maxRetries): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, DB_CONFIG.retryDelay))
      return withRetry(operation, retries - 1)
    }
    throw error
  }
}

export async function getAllStations(): Promise<Station[]> {
  if (!isDatabaseAvailable()) {
    // Return mock data for demo purposes when database is not available
    return [
      { id: 1, name: "New Delhi", code: "NDLS" },
      { id: 2, name: "Mumbai Central", code: "MMCT" },
      { id: 3, name: "Chennai Central", code: "MAS" },
      { id: 4, name: "Bangalore City", code: "SBC" },
      { id: 5, name: "Kolkata", code: "KOAA" },
    ]
  }

  return withRetry(async () => {
    const sql = getSql()
    const stations = await sql`
      SELECT id, name, code 
      FROM stations 
      WHERE is_active = true
      ORDER BY name
    `
    return stations as Station[]
  })
}

export async function searchTrains(
  sourceStationId: number,
  destinationStationId: number,
): Promise<TrainSearchResult[]> {
  if (!isDatabaseAvailable()) {
    // Return empty array when database is not available
    return []
  }

  // First, try to find direct routes
  const directRoutes = await findDirectRoutes(sourceStationId, destinationStationId)

  // If no direct routes, try to find connecting routes
  let connectingRoutes: TrainSearchResult[] = []
  if (directRoutes.length === 0) {
    connectingRoutes = await findConnectingRoutes(sourceStationId, destinationStationId)
  }

  return [...directRoutes, ...connectingRoutes]
}

async function findDirectRoutes(sourceStationId: number, destinationStationId: number): Promise<TrainSearchResult[]> {
  const sql = getSql()

  // Fixed SQL query - calculate price in JavaScript instead of SQL
  const routes = await sql`
    WITH route_info AS (
      SELECT 
        t.name as train_name,
        t.train_number,
        source_route.departure_time as departure_time,
        dest_route.departure_time as arrival_time,
        (dest_route.distance_from_start - source_route.distance_from_start) as distance
      FROM trains t
      JOIN train_routes source_route ON t.id = source_route.train_id
      JOIN train_routes dest_route ON t.id = dest_route.train_id
      WHERE source_route.station_id = ${sourceStationId}
        AND dest_route.station_id = ${destinationStationId}
        AND source_route.sequence_number < dest_route.sequence_number
        AND t.is_active = true
        AND source_route.is_active = true
        AND dest_route.is_active = true
    )
    SELECT 
      train_name,
      train_number,
      departure_time,
      arrival_time,
      distance
    FROM route_info
    ORDER BY distance ASC, departure_time ASC
  `

  // Calculate price in JavaScript
  return routes.map((route) => ({
    ...route,
    route_type: "direct" as const,
    price: Number(route.distance) * PRICE_PER_KM,
    distance: Number(route.distance),
  }))
}

async function findConnectingRoutes(
  sourceStationId: number,
  destinationStationId: number,
): Promise<TrainSearchResult[]> {
  const sql = getSql()

  // Find stations that can serve as connection points
  const connectionPoints = await sql`
    SELECT DISTINCT s.id, s.name
    FROM stations s
    JOIN train_routes tr1 ON s.id = tr1.station_id
    JOIN train_routes tr2 ON s.id = tr2.station_id
    WHERE tr1.train_id IN (
      SELECT DISTINCT train_id 
      FROM train_routes 
      WHERE station_id = ${sourceStationId} AND is_active = true
    )
    AND tr2.train_id IN (
      SELECT DISTINCT train_id 
      FROM train_routes 
      WHERE station_id = ${destinationStationId} AND is_active = true
    )
    AND s.id NOT IN (${sourceStationId}, ${destinationStationId})
    AND s.is_active = true
    AND tr1.is_active = true
    AND tr2.is_active = true
    LIMIT 10
  `

  const connectingRoutes: TrainSearchResult[] = []

  for (const connection of connectionPoints) {
    try {
      // Find first leg (source to connection)
      const firstLeg = await sql`
        SELECT 
          t.name as train_name,
          t.train_number,
          source_route.departure_time,
          conn_route.departure_time as arrival_time,
          (conn_route.distance_from_start - source_route.distance_from_start) as distance
        FROM trains t
        JOIN train_routes source_route ON t.id = source_route.train_id
        JOIN train_routes conn_route ON t.id = conn_route.train_id
        WHERE source_route.station_id = ${sourceStationId}
          AND conn_route.station_id = ${connection.id}
          AND source_route.sequence_number < conn_route.sequence_number
          AND t.is_active = true
          AND source_route.is_active = true
          AND conn_route.is_active = true
        ORDER BY source_route.departure_time ASC
        LIMIT 1
      `

      if (firstLeg.length === 0) continue

      // Find second leg (connection to destination) that departs after first leg arrives
      const secondLeg = await sql`
        SELECT 
          t.name as train_name,
          t.train_number,
          conn_route.departure_time,
          dest_route.departure_time as arrival_time,
          (dest_route.distance_from_start - conn_route.distance_from_start) as distance
        FROM trains t
        JOIN train_routes conn_route ON t.id = conn_route.train_id
        JOIN train_routes dest_route ON t.id = dest_route.train_id
        WHERE conn_route.station_id = ${connection.id}
          AND dest_route.station_id = ${destinationStationId}
          AND conn_route.sequence_number < dest_route.sequence_number
          AND conn_route.departure_time >= ${firstLeg[0].arrival_time}
          AND t.is_active = true
          AND conn_route.is_active = true
          AND dest_route.is_active = true
        ORDER BY conn_route.departure_time ASC
        LIMIT 1
      `

      if (secondLeg.length === 0) continue

      // Calculate prices in JavaScript
      const firstLegDistance = Number(firstLeg[0].distance)
      const secondLegDistance = Number(secondLeg[0].distance)
      const firstLegPrice = firstLegDistance * PRICE_PER_KM
      const secondLegPrice = secondLegDistance * PRICE_PER_KM

      connectingRoutes.push({
        train_name: firstLeg[0].train_name,
        train_number: firstLeg[0].train_number,
        departure_time: firstLeg[0].departure_time,
        arrival_time: firstLeg[0].arrival_time,
        distance: firstLegDistance,
        price: firstLegPrice,
        route_type: "connecting",
        connecting_train: {
          train_name: secondLeg[0].train_name,
          train_number: secondLeg[0].train_number,
          departure_time: secondLeg[0].departure_time,
          arrival_time: secondLeg[0].arrival_time,
          distance: secondLegDistance,
          price: secondLegPrice,
        },
      })
    } catch (error) {
      console.error(`Error processing connection point ${connection.name}:`, error)
      continue
    }
  }

  return connectingRoutes.sort((a, b) => {
    const totalPriceA = a.price + (a.connecting_train?.price || 0)
    const totalPriceB = b.price + (b.connecting_train?.price || 0)
    return totalPriceA - totalPriceB
  })
}
