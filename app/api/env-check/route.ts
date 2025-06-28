import { NextResponse } from "next/server"

export async function GET() {
  const envVars = {
    // Public environment variables (safe to expose)
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION,
    NODE_ENV: process.env.NODE_ENV,

    // Private environment variables (only check if they exist)
    hasNeonUrl: !!process.env.NEON_DATABASE_URL,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
  }

  const missingVars = []

  if (!envVars.NEXT_PUBLIC_APP_NAME) {
    missingVars.push("NEXT_PUBLIC_APP_NAME")
  }

  if (!envVars.NEXT_PUBLIC_APP_VERSION) {
    missingVars.push("NEXT_PUBLIC_APP_VERSION")
  }

  if (!envVars.hasNeonUrl && !envVars.hasDatabaseUrl) {
    missingVars.push("NEON_DATABASE_URL or DATABASE_URL")
  }

  return NextResponse.json({
    status: missingVars.length === 0 ? "complete" : "incomplete",
    environment: envVars,
    missing: missingVars,
    recommendations:
      missingVars.length > 0
        ? [
            "Create a .env.local file in your project root",
            "Add the missing environment variables",
            "Restart your development server",
            "Visit /admin to verify the setup",
          ]
        : ["All environment variables are properly configured!", "Visit /admin to monitor your application status"],
  })
}
