"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Zap } from "lucide-react"

interface ConnectionStatus {
  status: "healthy" | "unhealthy" | "checking"
  database: {
    connected: boolean
    stations?: number
    trains?: number
    routes?: number
  }
  environment: {
    appName: string
    version: string
    hasNeonUrl: boolean
    nodeEnv: string
  }
  timestamp?: string
  error?: string
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    status: "checking",
    database: { connected: false },
    environment: {
      appName: "RailConnect",
      version: "1.0.0",
      hasNeonUrl: false,
      nodeEnv: "development",
    },
  })
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        status: "unhealthy",
        database: { connected: false },
        environment: {
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
          hasNeonUrl: false,
          nodeEnv: "development",
        },
        error: "Failed to connect to API",
      })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
    // Auto-refresh every 30 seconds
    const interval = setInterval(checkConnection, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    switch (status.status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "healthy":
        return "bg-green-50 border-green-200"
      case "unhealthy":
        return "bg-red-50 border-red-200"
      default:
        return "bg-yellow-50 border-yellow-200"
    }
  }

  return (
    <Card className={`${getStatusColor()} border-2`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold text-lg">
                {status.environment.appName} v{status.environment.version}
              </h3>
              <p className="text-sm text-gray-600">System Status</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="flex items-center gap-2 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Database Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Database</span>
              <Badge variant={status.database.connected ? "default" : "destructive"}>
                {status.database.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {status.database.connected && (
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-blue-600">{status.database.stations || 0}</div>
                  <div className="text-gray-600">Stations</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-green-600">{status.database.trains || 0}</div>
                  <div className="text-gray-600">Trains</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-purple-600">{status.database.routes || 0}</div>
                  <div className="text-gray-600">Routes</div>
                </div>
              </div>
            )}
          </div>

          {/* Environment Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span className="font-medium">Environment</span>
              <Badge variant="outline">{status.environment.nodeEnv}</Badge>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Neon Database:</span>
                <Badge variant={status.environment.hasNeonUrl ? "default" : "destructive"}>
                  {status.environment.hasNeonUrl ? "Configured" : "Missing"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Name:</span>
                <span className="font-medium">{status.environment.appName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Version:</span>
                <span className="font-medium">{status.environment.version}</span>
              </div>
            </div>
          </div>
        </div>

        {status.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-medium">Error: {status.error}</p>
          </div>
        )}

        {status.timestamp && (
          <div className="mt-4 text-xs text-gray-500 text-center">
            Last checked: {new Date(status.timestamp).toLocaleString()}
          </div>
        )}

        {/* Setup Instructions */}
        {!status.database.connected && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Setup Required</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>1. Add your Neon database URL to .env.local:</p>
              <code className="block bg-blue-100 p-2 rounded text-xs">
                NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.neon.tech/neondb
              </code>
              <p>2. Run database setup scripts:</p>
              <code className="block bg-blue-100 p-2 rounded text-xs">npm run db:setup && npm run db:seed</code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
