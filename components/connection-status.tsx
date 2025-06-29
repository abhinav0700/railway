"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database, Zap, Shield } from "lucide-react"

interface ConnectionStatus {
  status: "healthy" | "unhealthy" | "partial" | "checking"
  database: {
    connected: boolean
    configured: boolean
    host?: string
    database?: string
    user?: string
    hasPooling?: boolean
    stations?: number
    trains?: number
    routes?: number
    message?: string
  }
  environment: {
    appName: string
    version: string
    hasNeonUrl: boolean
    nodeEnv: string
  }
  features: {
    directRoutes: boolean
    connectingRoutes: boolean
    priceCalculation: boolean
    sorting: boolean
    realTimeUpdates: boolean
    authentication: boolean
  }
  timestamp?: string
  error?: string
}

export default function ConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    status: "checking",
    database: { connected: false, configured: false },
    environment: {
      appName: "RailConnect",
      version: "1.0.0",
      hasNeonUrl: false,
      nodeEnv: "development",
    },
    features: {
      directRoutes: false,
      connectingRoutes: false,
      priceCalculation: true,
      sorting: true,
      realTimeUpdates: false,
      authentication: false,
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
        database: { connected: false, configured: false },
        environment: {
          appName: process.env.NEXT_PUBLIC_APP_NAME || "RailConnect",
          version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
          hasNeonUrl: false,
          nodeEnv: "development",
        },
        features: {
          directRoutes: false,
          connectingRoutes: false,
          priceCalculation: true,
          sorting: true,
          realTimeUpdates: false,
          authentication: false,
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
      case "partial":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "unhealthy":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = () => {
    switch (status.status) {
      case "healthy":
        return "bg-green-50 border-green-200"
      case "partial":
        return "bg-yellow-50 border-yellow-200"
      case "unhealthy":
        return "bg-red-50 border-red-200"
      default:
        return "bg-gray-50 border-gray-200"
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
              <p className="text-sm text-gray-600">System Status: {status.status}</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Database Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              <span className="font-medium">Database</span>
              <Badge variant={status.database.connected ? "default" : "destructive"}>
                {status.database.connected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            {status.database.configured && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Host:</span>
                  <span className="font-mono text-xs">{status.database.host?.split(".")[0]}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="font-medium">{status.database.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">User:</span>
                  <span className="font-medium">{status.database.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pooling:</span>
                  <Badge variant={status.database.hasPooling ? "default" : "secondary"}>
                    {status.database.hasPooling ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            )}

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

          {/* Features Status */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="font-medium">Features</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Direct Routes:</span>
                <Badge variant={status.features.directRoutes ? "default" : "secondary"}>
                  {status.features.directRoutes ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Connecting Routes:</span>
                <Badge variant={status.features.connectingRoutes ? "default" : "secondary"}>
                  {status.features.connectingRoutes ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Calculation:</span>
                <Badge variant={status.features.priceCalculation ? "default" : "secondary"}>
                  {status.features.priceCalculation ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Real-time Updates:</span>
                <Badge variant="secondary">Coming Soon</Badge>
              </div>
            </div>
          </div>
        </div>

        {status.database.message && (
          <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm font-medium">{status.database.message}</p>
          </div>
        )}

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

        {/* Quick Setup Guide */}
        {status.status !== "healthy" && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Setup</h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Your database credentials are configured ✅</p>
              <p>2. Run database setup commands:</p>
              <div className="bg-blue-100 p-2 rounded text-xs font-mono">
                <div>npm run db:setup</div>
                <div>npm run db:seed</div>
                <div>npm run db:generate</div>
              </div>
              <p>3. Restart your development server</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
