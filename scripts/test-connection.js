// Test database connection script
import { testDatabaseConnection } from "../lib/neon-setup.js"

async function main() {
  try {
    console.log("🔍 Testing RailConnect database connection...\n")

    const result = await testDatabaseConnection()

    console.log("\n✅ Database test completed successfully!")
    console.log("🚀 Your RailConnect application is ready to use!")
  } catch (error) {
    console.error("\n❌ Database test failed!")
    console.error("Error:", error.message)
    console.error("\n🔧 Troubleshooting steps:")
    console.error("1. Check your NEON_DATABASE_URL in .env.local")
    console.error("2. Ensure your Neon database is active")
    console.error("3. Run database setup scripts if not done already")
    process.exit(1)
  }
}

main()
