import { getSql, isDatabaseAvailable } from "./database"

export async function testDatabaseConnection() {
  try {
    if (!isDatabaseAvailable()) {
      throw new Error("Database not configured. Please set NEON_DATABASE_URL environment variable.")
    }

    console.log("🔍 Testing Neon database connection...")
    const sql = getSql()

    // Test basic connection
    const result = await sql`SELECT NOW() as current_time, version() as db_version`
    console.log("✅ Database connected successfully!")
    console.log("📅 Current time:", result[0].current_time)
    console.log("🗄️ Database version:", result[0].db_version.split(" ")[0])

    // Test tables exist
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `

    console.log("📋 Available tables:", tables.map((t) => t.table_name).join(", "))

    // Test data counts
    const stationCount = await sql`SELECT COUNT(*) as count FROM stations WHERE is_active = true`
    const trainCount = await sql`SELECT COUNT(*) as count FROM trains WHERE is_active = true`
    const routeCount = await sql`SELECT COUNT(*) as count FROM train_routes WHERE is_active = true`

    console.log("📊 Data summary:")
    console.log(`   - Stations: ${stationCount[0].count}`)
    console.log(`   - Trains: ${trainCount[0].count}`)
    console.log(`   - Routes: ${routeCount[0].count}`)

    return {
      connected: true,
      tables: tables.length,
      stations: Number(stationCount[0].count),
      trains: Number(trainCount[0].count),
      routes: Number(routeCount[0].count),
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return {
      connected: false,
      tables: 0,
      stations: 0,
      trains: 0,
      routes: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function setupDatabase() {
  try {
    if (!isDatabaseAvailable()) {
      console.log("⚠️ Database not available. Skipping setup.")
      return false
    }

    console.log("🚀 Setting up database...")
    const sql = getSql()

    // Check if setup is needed
    const tables = await sql`
      SELECT COUNT(*) as count
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('stations', 'trains', 'train_routes')
    `

    if (Number(tables[0].count) < 3) {
      console.log("⚠️ Database setup required. Please run the SQL scripts first.")
      return false
    }

    console.log("✅ Database setup complete!")
    return true
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    return false
  }
}
