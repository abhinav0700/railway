"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import AddTrainForm from "./add-train-form"
import {
  MapPin,
  Clock,
  IndianRupee,
  Route,
  RefreshCw,
  ArrowUpDown,
  AlertTriangle,
  Calendar,
  Star,
  Zap,
  ArrowRight,
  Sparkles,
  TrendingUp,
} from "lucide-react"
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
    travelDate?: string
  }
}

export default function TrainSearch() {
  const [stations, setStations] = useState<Station[]>([])
  const [sourceStation, setSourceStation] = useState<string>("")
  const [destinationStation, setDestinationStation] = useState<string>("")
  const [travelDate, setTravelDate] = useState<string>("")
  const [trains, setTrains] = useState<TrainSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [stationsLoading, setStationsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"price" | "time" | "duration">("price")
  const [error, setError] = useState<string>("")
  const [isMockData, setIsMockData] = useState(false)
  const [mockMessage, setMockMessage] = useState<string>("")
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    fetchStations()
    // Set default travel date to tomorrow
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setTravelDate(tomorrow.toISOString().split("T")[0])
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
    if (!sourceStation || !destinationStation || !travelDate) return

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
    setHasSearched(true)

    try {
      console.log(`Searching trains from ${sourceId} to ${destinationId} for ${travelDate}`)

      const response = await fetch(
        `/api/search-trains?source=${sourceId}&destination=${destinationId}&date=${travelDate}`,
      )
      const data: TrainsResponse = await response.json()

      if (response.ok) {
        if ("data" in data) {
          setTrains(data.data)
          if (data.meta.message && data.meta.mock) {
            setError(data.meta.message)
          } else if (data.data.length === 0) {
            setError("No trains found for the selected route and date. Try a different route or date.")
          }
        } else {
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
    } else if (sortBy === "time") {
      return a.departure_time.localeCompare(b.departure_time)
    } else {
      // Sort by duration (arrival - departure)
      const durationA = calculateDuration(a.departure_time, a.arrival_time)
      const durationB = calculateDuration(b.departure_time, b.arrival_time)
      return durationA - durationB
    }
  })

  const calculateDuration = (departure: string, arrival: string): number => {
    const dep = new Date(`2000-01-01T${departure}`)
    const arr = new Date(`2000-01-01T${arrival}`)
    if (arr < dep) arr.setDate(arr.getDate() + 1) // Next day arrival
    return arr.getTime() - dep.getTime()
  }

  const formatDuration = (departure: string, arrival: string): string => {
    const duration = calculateDuration(departure, arrival)
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatTime = (time: string) => {
    try {
      return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return time
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

  const getTrainTypeIcon = (trainType?: string) => {
    if (!trainType) return <Route className="h-4 w-4 text-gray-500" />
    if (trainType.includes("Rajdhani") || trainType.includes("Shatabdi"))
      return <Star className="h-4 w-4 text-yellow-500" />
    if (trainType.includes("Express")) return <Zap className="h-4 w-4 text-blue-500" />
    return <Route className="h-4 w-4 text-gray-500" />
  }

  const getTrainTypeColor = (trainType?: string) => {
    if (!trainType) return "bg-gray-100 text-gray-800"
    if (trainType.includes("Rajdhani")) return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800"
    if (trainType.includes("Shatabdi")) return "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800"
    if (trainType.includes("Express")) return "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800"
    if (trainType.includes("Mail")) return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800"
    return "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800"
  }

  if (stationsLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="relative">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-500 animate-pulse" />
              </div>
              <span className="text-lg font-medium text-gray-700">Loading stations...</span>
              <p className="text-sm text-gray-500 mt-2">Preparing your journey options</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Mock Data Warning */}
      {isMockData && mockMessage && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-900">Demo Mode</p>
                <p className="text-sm text-orange-700">{mockMessage}</p>
                <p className="text-xs text-orange-600 mt-1">
                  Visit{" "}
                  <a href="/admin" className="underline font-medium hover:text-orange-800">
                    /admin
                  </a>{" "}
                  for setup instructions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Train Form */}
      <div className="flex justify-end">
        <AddTrainForm stations={stations} onTrainAdded={fetchStations} />
      </div>

      {/* Search Card */}
      <Card className="shadow-2xl border-0 bg-white overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <span>Find Your Perfect Train Journey</span>
              <p className="text-sm text-blue-100 font-normal mt-1">
                Smart search with dynamic pricing • Base rate: ₹1.25/km
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-br from-white to-gray-50">
          {error && !isMockData && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-end">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                From
              </label>
              <Select value={sourceStation} onValueChange={setSourceStation}>
                <SelectTrigger className="h-12 text-base border-2 border-gray-200 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Select departure station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{station.name}</span>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
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
                className="h-12 w-12 rounded-full border-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 bg-transparent transition-all duration-300"
                disabled={!sourceStation && !destinationStation}
              >
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </Button>
            </div>

            <div className="lg:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                To
              </label>
              <Select value={destinationStation} onValueChange={setDestinationStation}>
                <SelectTrigger className="h-12 text-base border-2 border-gray-200 hover:border-purple-300 transition-colors">
                  <SelectValue placeholder="Select destination station" />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id.toString()}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{station.name}</span>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                          {station.code}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-600" />
                Date
              </label>
              <div className="relative">
                <Input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  max={new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                  className="h-12 text-base pl-10 border-2 border-gray-200 hover:border-green-300 transition-colors"
                />
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
              </div>
            </div>

            <Button
              onClick={searchTrains}
              disabled={!sourceStation || !destinationStation || !travelDate || loading}
              className="h-12 text-base font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all duration-300"
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

      {/* Loading State */}
      {loading && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="relative inline-block">
                <LoadingSpinner size="lg" className="mb-4" />
                <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-blue-500 animate-pulse" />
                <TrendingUp className="absolute -bottom-2 -left-2 h-6 w-6 text-purple-500 animate-bounce" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Searching for the best trains...</h3>
              <p className="text-gray-600">
                Analyzing routes from {getSourceStationName()} to {getDestinationStationName()}
              </p>
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {hasSearched && !loading && (
        <>
          {trains.length > 0 && (
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      {getSourceStationName()} → {getDestinationStationName()}
                    </CardTitle>
                    <p className="text-emerald-100 mt-1">
                      {trains.length} train{trains.length !== 1 ? "s" : ""} found for{" "}
                      {new Date(travelDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-emerald-100">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value: "price" | "time" | "duration") => setSortBy(value)}>
                      <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
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
                        <SelectItem value="duration">
                          <div className="flex items-center gap-2">
                            <Route className="h-4 w-4" />
                            Duration
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
                    <div
                      key={`${train.train_number}-${index}`}
                      className="border-b last:border-b-0 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${getTrainTypeColor(train.train_type)} shadow-sm`}>
                              {getTrainTypeIcon(train.train_type)}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{train.train_name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="font-mono bg-gray-50">
                                  {train.train_number}
                                </Badge>
                                {train.train_type && (
                                  <Badge className={`${getTrainTypeColor(train.train_type)} border-0`}>
                                    {train.train_type}
                                  </Badge>
                                )}
                                {train.route_type === "connecting" && (
                                  <Badge className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 hover:from-orange-200 hover:to-amber-200 border-0">
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
                            {train.pricing_breakdown?.savings && (
                              <div className="text-xs text-green-600 mt-1 font-medium">
                                Save ₹{train.pricing_breakdown.savings}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{formatTime(train.departure_time)}</div>
                              <div className="text-sm text-gray-600 font-medium">Departure</div>
                              <div className="text-xs text-gray-500 mt-1">{getSourceStationName()}</div>
                            </div>

                            <div className="flex-1 flex items-center justify-center px-4">
                              <div className="flex flex-col items-center gap-2">
                                <div className="text-xs text-gray-500 font-medium">
                                  {formatDuration(train.departure_time, train.arrival_time)}
                                </div>
                                <div className="flex items-center gap-2 text-gray-400">
                                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 w-16"></div>
                                  <ArrowRight className="h-5 w-5 text-blue-500" />
                                  <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 w-16"></div>
                                </div>
                                <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                  {train.distance} km
                                </div>
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

                          {/* Pricing breakdown */}
                          {train.pricing_breakdown && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600">Base fare:</span>
                                  <span className="font-medium">
                                    ₹{train.pricing_breakdown.basePrice + train.pricing_breakdown.distancePrice}
                                  </span>
                                </div>
                                {train.pricing_breakdown.demandSurcharge > 0 && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Demand:</span>
                                    <span className="text-orange-600 font-medium">
                                      +₹{train.pricing_breakdown.demandSurcharge}
                                    </span>
                                  </div>
                                )}
                                {train.pricing_breakdown.weekendSurcharge > 0 && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Weekend:</span>
                                    <span className="text-orange-600 font-medium">
                                      +₹{train.pricing_breakdown.weekendSurcharge}
                                    </span>
                                  </div>
                                )}
                                {train.pricing_breakdown.savings && (
                                  <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="text-green-600 font-medium">
                                      -₹{train.pricing_breakdown.savings}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        {train.connecting_train && (
                          <>
                            <div className="flex justify-center my-4">
                              <div className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium border border-orange-200">
                                Transfer Required
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                              <div className="flex items-center gap-2 mb-3">
                                <Route className="h-4 w-4 text-orange-600" />
                                <h4 className="font-semibold text-orange-900">Connecting Train:</h4>
                                <span className="font-bold">{train.connecting_train.train_name}</span>
                                <Badge variant="outline" className="font-mono bg-white">
                                  {train.connecting_train.train_number}
                                </Badge>
                                {train.connecting_train.train_type && (
                                  <Badge className={getTrainTypeColor(train.connecting_train.train_type)}>
                                    {train.connecting_train.train_type}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="text-center">
                                  <div className="text-xl font-bold text-gray-900">
                                    {formatTime(train.connecting_train.departure_time)}
                                  </div>
                                  <div className="text-sm text-gray-600 font-medium">Departure</div>
                                </div>

                                <div className="flex-1 flex items-center justify-center px-4">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className="text-xs text-gray-500">
                                      {formatDuration(
                                        train.connecting_train.departure_time,
                                        train.connecting_train.arrival_time,
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400">
                                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 w-16"></div>
                                      <ArrowRight className="h-4 w-4 text-orange-500" />
                                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 w-16"></div>
                                    </div>
                                    <div className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
                                      {train.connecting_train.distance} km
                                    </div>
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

          {trains.length === 0 && !error && (
            <Card className="shadow-xl border-0 bg-gradient-to-br from-gray-50 to-blue-50">
              <CardContent className="py-12">
                <EmptyState
                  icon="train"
                  title="No Trains Found"
                  description={`Sorry, we couldn't find any trains from ${getSourceStationName()} to ${getDestinationStationName()} on ${new Date(
                    travelDate,
                  ).toLocaleDateString()}. Try searching for a different route or date.`}
                />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Welcome State - Show when no search has been performed */}
      {!hasSearched && !loading && (
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <Route className="h-12 w-12 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-500 animate-pulse" />
                <TrendingUp className="absolute -bottom-2 -left-2 h-8 w-8 text-green-500 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Find Your Perfect Journey?</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                Select your departure and destination stations, choose your travel date, and discover the best trains
                with dynamic pricing starting at ₹1.25/km.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Premium Trains
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Zap className="h-4 w-4 text-blue-500" />
                  Express Routes
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <IndianRupee className="h-4 w-4 text-green-500" />
                  Dynamic Pricing
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
