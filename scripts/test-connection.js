// Enhanced test connection script with your Neon credentials
import { testDatabaseConnection } from "../lib/neon-setup.js"

async function main() {
  try {
    console.log("🔍 Testing RailConnect database connection...")
    console.log("🗄️ Using Neon Database: ep-crimson-meadow-a4n91tly")
    console.log("")

    const result = await testDatabaseConnection()

    if (result.connected) {
      console.log("\n✅ Database connection successful!")
      console.log("📊 Database Statistics:")
      console.log(`   - Host: ${process.env.PGHOST || "Not set"}`)
      console.log(`   - Database: ${process.env.PGDATABASE || "Not set"}`)
      console.log(`   - User: ${process.env.PGUSER || "Not set"}`)
      console.log(`   - Stations: ${result.stations}`)
      console.log(`   - Trains: ${result.trains}`)
      console.log(`   - Routes: ${result.routes}`)
      console.log("\n🚀 Your RailConnect application is ready!")
      console.log("💡 Next steps:")
      console.log("   - Run 'npm run dev' to start the application")
      console.log("   - Visit http://localhost:3000 to use the app")
      console.log("   - Visit http://localhost:3000/admin for admin dashboard")
    } else {
      console.log("\n⚠️ Database connection failed!")
      console.log("🔧 Troubleshooting:")
      console.log("   1. Check if your .env.local file exists")
      console.log("   2. Verify DATABASE_URL is correctly set")
      console.log("   3. Ensure your Neon database is active")
      console.log("   4. Run database setup scripts:")
      console.log("      npm run db:setup")
      console.log("      npm run db:seed")
    }
  } catch (error) {
    console.error("\n❌ Connection test failed!")
    console.error("Error:", error.message)
    console.error("\n🔧 Setup Instructions:")
    console.error("1. Create .env.local file with your database credentials")
    console.error("2. Run: npm run db:setup")
    console.error("3. Run: npm run db:seed")
    console.error("4. Run: npm run db:test")
    process.exit(1)
  }
}

main()
