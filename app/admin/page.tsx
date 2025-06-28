import ConnectionStatus from "@/components/connection-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Settings, BarChart3, Shield } from "lucide-react"

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">System monitoring and configuration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Connection Status */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Connection Status
          </h2>
          <ConnectionStatus />
        </div>

        {/* Configuration Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environment Variables</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NEXT_PUBLIC_APP_NAME</span>
                  <Badge variant="outline">{process.env.NEXT_PUBLIC_APP_NAME || "Not Set"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NEXT_PUBLIC_APP_VERSION</span>
                  <Badge variant="outline">{process.env.NEXT_PUBLIC_APP_VERSION || "Not Set"}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">NODE_ENV</span>
                  <Badge variant={process.env.NODE_ENV === "production" ? "default" : "secondary"}>
                    {process.env.NODE_ENV || "development"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Features</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Direct Routes</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Connecting Routes</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Price Calculation</span>
                  <Badge variant="default">₹1.25/km</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Real-time Updates</span>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/api/health"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                >
                  View Health API
                </a>
                <a
                  href="/api/stations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                >
                  View Stations API
                </a>
                <a
                  href="/"
                  className="block w-full text-center bg-purple-50 hover:bg-purple-100 text-purple-700 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                >
                  Back to App
                </a>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Environment Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Required Environment Variables</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
                  {`# Add these to your .env.local file:
NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_APP_NAME=RailConnect
NEXT_PUBLIC_APP_VERSION=1.0.0

# Optional configuration:
PRICE_PER_KM=1.25
ENABLE_CONNECTING_ROUTES=true
NODE_ENV=development`}
                </pre>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Database Setup Commands</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-700">
                  {`# Run these commands in order:
npm install
npm run db:setup    # Create tables and indexes
npm run db:seed     # Add sample stations and trains
npm run db:generate # Generate 1000 test trains (optional)
npm run db:test     # Verify connection
npm run dev         # Start development server`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
