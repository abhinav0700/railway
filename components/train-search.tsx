"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ArrowRight, MapPin, Clock, IndianRupee, Route, RefreshCw, ArrowUpDown, AlertTriangle } from "lucide-react"
import type { Station, TrainSearchResult } from "@/lib/database"

interface StationsResponse {
  data: Station[]
  meta: {
    total: number
    mock: boolean
    message?: string
  }
}

interface TrainsResponse {
  data: TrainSearchResult[]
  meta: {
    total: number
    mock: boolean
    message?: string
    sourceId?: number
    destinationId?: number
  }
}

export default function TrainSearch() {
  const [stations, setStations] = useState<Station[]>([])
  const [sourceStation, setSourceStation] = useState<string>("")
  const [destinationStation, setDestinationStation] = useState<string>("")
  const [trains, setTrains] = useState<TrainSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [stationsLoading, setStationsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"price" | "time">("price")
  const [error, setError] = useState<string>("")
  const [isMockData, setIsMockData] = useState(false)
  const [mockMessage, setMockMessage] = useState<string>("")

  useEffect(() => {
    fetchStations()
  }, [])

  const fetchStations = async () => {
    setStationsLoading(true)
    try {
      const response = await fetch("/api/stations")
      if (!response.ok) throw new Error("Failed to fetch stations")
      const data: StationsResponse = await response.json()

      if ("data" in data) {
        setStations(data.data)
        setIsMockData(data.meta.mock)
        if (data.meta.message) {
          setMockMessage(data.meta.message)
        }
      } else {
        // Fallback for old API format
        setStations(data as any)
      }
      setError("")
    } catch (error) {
      console.error("Error fetching stations:", error)
      setError("Failed to load stations. Please refresh the page.")
    } finally {
      setStationsLoading(false)
    }
  }

  const searchTrains = async () => {
    if (!sourceStation || !destinationStation) return

    // Validate station IDs before making the request
    const sourceId = Number.parseInt(sourceStation, 10)
    const destinationId = Number.parseInt(destinationStation, 10)

    if (isNaN(sourceId) || isNaN(destinationId)) {
      setError("Invalid station selection. Please select valid stations.")
      return
    }

    if (sourceId === destinationId) {
      setError("Source and destination cannot be the same. Please select different stations.")
      return
    }

    setLoading(true)
    setError("")
    setTrains([])

    try {
      console.log(`Searching trains from ${sourceId} to ${destinationId}`)

      const response = await fetch(`/api/search-trains?source=${sourceId}&destination=${destinationId}`)
      const data: TrainsResponse = await response.json()

      if (response.ok) {
        if ("data" in data) {
          setTrains(data.data)
          if (data.meta.message && data.meta.mock) {
            setError(data.meta.message)
          } else if (data.data.length === 0) {
            setError("No trains found for the selected route. Try a different route or check back later.")
          }
        } else {
          // Fallback for old API format
          setTrains(data as any)
        }
      } else {
        const errorData = data as any
        setError(errorData.error || errorData.details || "Failed to search trains")
        setTrains([])
      }
    } catch (error) {
      console.error("Error searching trains:", error)
      setError("Network error. Please check your connection and try again.")
      setTrains([])
    } finally {
      setLoading(false)
    }
  }

  const swapStations = () => {
    const temp = sourceStation
    setSourceStation(destinationStation)
    setDestinationStation(temp)
  }

  const sortedTrains = [...trains].sort((a, b) => {
    if (sortBy === "price") {
      const priceA = a.price + (a.connecting_train?.price || 0)
      const priceB = b.price + (b.connecting_train?.price || 0)
      return priceA - priceB
    } else {
      return a.departure_time.localeCompare(b.departure_time)
    }
  })

  const formatTime = (time: string) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return time // Return original time if formatting fails
    }
  }

  const getTotalPrice = (train: TrainSearchResult) => {
    return train.price + (train.connecting_train?.price || 0)
  }

  const getTotalDistance = (train: TrainSearchResult) => {
    return train.distance + (train.connecting_train?.distance || 0)
  }

  const getSourceStationName = () => {
    return stations.find((s) => s.id.toString() === sourceStation)?.name || ""
  }

  const getDestinationStationName = () => {
    return stations.find((s) => s.id.toString() === destinationStation)?.name || ""
  }

  if (stationsLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-lg">Loading stations...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Mock Data Warning */}
      {isMockData && mockMessage && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Demo Mode</p>
                <p className="text-sm text-orange-700">{mockMessage}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Visit{" "}
                  <a href="/admin" className="underline font-medium">
                    /admin
                  </a>{" "}
                  for setup instructions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Card */}
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg">
              <MapPin className="h-6 w-6" />
            </div>
            Find Your Perfect Train Journey
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {error && !isMockData && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-end">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">From</label>
              <Select value={sourceStation} onValueChange={setSourceStation}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select departure station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{station.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {station.code}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                size="icon"
                onClick={swapStations}
                className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                disabled={!sourceStation && !destinationStation}
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">To</label>
              <Select value={destinationStation} onValueChange={setDestinationStation}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select destination station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{station.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {station.code}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={searchTrains}
              disabled={!sourceStation || !destinationStation || loading}
              className="h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Route className="mr-2 h-5 w-5" />
                  Search Trains
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {sourceStation && destinationStation && (
        <>
          {trains.length > 0 && (
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {getSourceStationName()} → {getDestinationStationName()}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      {trains.length} train{trains.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: "price" | "time") => setSortBy(value)}>
                      <SelectTrigger className="w-40">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4" />
                            Price (Low to High)
                          </div>
                        </SelectItem>
                        <SelectItem value="time">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Departure Time
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {sortedTrains.map((train, index) => (
                    <div key={index} className="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Route className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{train.train_name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="font-mono">
                                  {train.train_number}
                                </Badge>
                                {train.route_type === "connecting" && (
                                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                                    Connecting Journey
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-green-600 flex items-center">
                              <IndianRupee className="h-6 w-6" />
                              {getTotalPrice(train).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">{getTotalDistance(train)} km total</div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{formatTime(train.departure_time)}</div>
                              <div className="text-sm text-gray-600 font-medium">Departure</div>
                              <div className="text-xs text-gray-500 mt-1">{getSourceStationName()}</div>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-4">
                              <div className="flex items-center gap-2 text-gray-400">
                                <div className="h-px bg-gray-300 flex-1"></div>
                                <ArrowRight className="h-5 w-5" />
                                <div className="h-px bg-gray-300 flex-1"></div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{formatTime(train.arrival_time)}</div>
                              <div className="text-sm text-gray-600 font-medium">
                                {train.connecting_train ? "Connection" : "Arrival"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {train.connecting_train ? "Transfer Station" : getDestinationStationName()}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-center mt-3">
                            <div className="bg-white px-3 py-1 rounded-full text-sm text-gray-600">
                              {train.distance} km • ₹{train.price.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {train.connecting_train && (
                          <>
                            <div className="flex justify-center my-4">
                              <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium">
                                Transfer Required
                              </div>
                            </div>

                            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Route className="h-4 w-4 text-orange-600" />
                                <h4 className="font-semibold text-orange-900">Connecting Train:</h4>
                                <span className="font-bold">{train.connecting_train.train_name}</span>
                                <Badge variant="outline" className="font-mono">
                                  {train.connecting_train.train_number}
                                </Badge>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-center">
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatTime(train.connecting_train.departure_time)}
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">Departure</div>
                                </div>

                                <div className="flex-1 flex items-center justify-center px-4">
                                  <div className="flex items-center gap-2 text-gray-400">
                                    <div className="h-px bg-gray-300 flex-1"></div>
                                    <ArrowRight className="h-4 w-4" />
                                    <div className="h-px bg-gray-300 flex-1"></div>
                                  </div>
                                </div>

                                <div className="text-center">
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatTime(train.connecting_train.arrival_time)}
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">Arrival</div>
                                  <div className="text-xs text-gray-500 mt-1">{getDestinationStationName()}</div>
                                </div>
                              </div>

                              <div className="flex justify-center mt-3">
                                <div className="bg-white px-3 py-1 rounded-full text-sm text-gray-600">
                                  {train.connecting_train.distance} km • ₹{train.connecting_train.price.toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {trains.length === 0 && !loading && !error && (
            <Card className="shadow-lg border-0">
              <CardContent>
                <EmptyState
                  icon="train"
                  title="No Trains Found"
                  description={`Sorry, we couldn't find any trains from ${getSourceStationName()} to ${getDestinationStationName()}. Try searching for a different route or check back later.`}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
