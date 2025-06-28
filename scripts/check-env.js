// Environment variable checker script
console.log("🔍 Checking Environment Variables...\n")

const requiredVars = ["NEON_DATABASE_URL", "NEXT_PUBLIC_APP_NAME", "NEXT_PUBLIC_APP_VERSION"]

const optionalVars = ["NODE_ENV", "PRICE_PER_KM", "ENABLE_CONNECTING_ROUTES"]

let allGood = true

console.log("📋 Required Variables:")
requiredVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? "✅ SET" : "❌ MISSING"
  console.log(`   ${varName}: ${status}`)
  if (!value) allGood = false
})

console.log("\n📋 Optional Variables:")
optionalVars.forEach((varName) => {
  const value = process.env[varName]
  const status = value ? `✅ ${value}` : "⚪ Not set (using default)"
  console.log(`   ${varName}: ${status}`)
})

console.log("\n" + "=".repeat(50))

if (allGood) {
  console.log("🎉 All required environment variables are set!")
  console.log("🚀 You can now run: npm run dev")
} else {
  console.log("⚠️  Some required environment variables are missing.")
  console.log("📝 Please check your .env.local file and add the missing variables.")
  console.log("📖 See .env.example for reference.")
}

console.log("\n🔗 Useful commands:")
console.log("   npm run db:test     - Test database connection")
console.log("   npm run dev         - Start development server")
console.log("   Visit /admin        - Check system status")
console.log("   Visit /api/env-check - Check environment via API")
