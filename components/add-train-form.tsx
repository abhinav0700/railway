"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Plus, Trash2, Train, MapPin, Clock, Save } from "lucide-react"
import type { Station } from "@/lib/database"

interface RouteStation {
  station_id: number
  station_name?: string
  departure_time: string
  arrival_time: string
  distance_from_start: number
  halt_duration: number
}

interface AddTrainFormProps {
  stations: Station[]
  onTrainAdded: () => void
}

const TRAIN_TYPES = [
  "Rajdhani",
  "Shatabdi",
  "Duronto",
  "Express",
  "Superfast",
  "Mail",
  "Passenger",
  "Jan Shatabdi",
  "Intercity",
  "Local",
]

export default function AddTrainForm({ stations, onTrainAdded }: AddTrainFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    train_number: "",
    train_type: "",
  })
  const [routes, setRoutes] = useState<RouteStation[]>([
    {
      station_id: 0,
      departure_time: "",
      arrival_time: "",
      distance_from_start: 0,
      halt_duration: 2,
    },
    {
      station_id: 0,
      departure_time: "",
      arrival_time: "",
      distance_from_start: 0,
      halt_duration: 2,
    },
  ])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const addRouteStation = () => {
    setRoutes([
      ...routes,
      {
        station_id: 0,
        departure_time: "",
        arrival_time: "",
        distance_from_start: 0,
        halt_duration: 2,
      },
    ])
  }

  const removeRouteStation = (index: number) => {
    if (routes.length > 2) {
      setRoutes(routes.filter((_, i) => i !== index))
    }
  }

  const updateRoute = (index: number, field: keyof RouteStation, value: any) => {
    const updatedRoutes = [...routes]
    updatedRoutes[index] = { ...updatedRoutes[index], [field]: value }

    // Auto-set arrival time same as departure time if not set
    if (field === "departure_time" && !updatedRoutes[index].arrival_time) {
      updatedRoutes[index].arrival_time = value
    }

    setRoutes(updatedRoutes)
  }

  const getStationName = (stationId: number) => {
    return stations.find((s) => s.id === stationId)?.name || ""
  }

  const validateForm = () => {
    if (!formData.name || !formData.train_number || !formData.train_type) {
      setError("Please fill in all train details")
      return false
    }

    if (routes.length < 2) {
      setError("At least 2 stations are required")
      return false
    }

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i]
      if (!route.station_id || !route.departure_time) {
        setError(`Please complete details for station ${i + 1}`)
        return false
      }
    }

    // Check for duplicate stations
    const stationIds = routes.map((r) => r.station_id)
    const uniqueStationIds = new Set(stationIds)
    if (stationIds.length !== uniqueStationIds.size) {
      setError("Duplicate stations are not allowed")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("/api/trains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          routes: routes.map((route) => ({
            ...route,
            station_id: Number(route.station_id),
            distance_from_start: Number(route.distance_from_start),
            halt_duration: Number(route.halt_duration),
          })),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(`Train ${formData.train_number} added successfully!`)
        setFormData({ name: "", train_number: "", train_type: "" })
        setRoutes([
          {
            station_id: 0,
            departure_time: "",
            arrival_time: "",
            distance_from_start: 0,
            halt_duration: 2,
          },
          {
            station_id: 0,
            departure_time: "",
            arrival_time: "",
            distance_from_start: 0,
            halt_duration: 2,
          },
        ])
        onTrainAdded()
        setTimeout(() => {
          setIsOpen(false)
          setSuccess("")
        }, 2000)
      } else {
        setError(data.error || data.details || "Failed to add train")
      }
    } catch (error) {
      console.error("Error adding train:", error)
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Train
      </Button>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Train className="h-6 w-6" />
          </div>
          Add New Train
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Train Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Train Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chennai Express"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Train Number</label>
              <Input
                value={formData.train_number}
                onChange={(e) => setFormData({ ...formData, train_number: e.target.value })}
                placeholder="e.g., 12163"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Train Type</label>
              <Select
                value={formData.train_type}
                onValueChange={(value) => setFormData({ ...formData, train_type: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select train type" />
                </SelectTrigger>
                <SelectContent>
                  {TRAIN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Route Stations */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-600" />
                Route Stations
              </h3>
              <Button
                type="button"
                onClick={addRouteStation}
                variant="outline"
                size="sm"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Station
              </Button>
            </div>

            <div className="space-y-3">
              {routes.map((route, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50 to-white"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                      Station {index + 1}
                    </Badge>
                    {routes.length > 2 && (
                      <Button
                        type="button"
                        onClick={() => removeRouteStation(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Station</label>
                      <Select
                        value={route.station_id.toString()}
                        onValueChange={(value) => updateRoute(index, "station_id", Number(value))}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select station" />
                        </SelectTrigger>
                        <SelectContent>
                          {stations.map((station) => (
                            <SelectItem key={station.id} value={station.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{station.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {station.code}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Departure</label>
                      <div className="relative">
                        <Input
                          type="time"
                          value={route.departure_time}
                          onChange={(e) => updateRoute(index, "departure_time", e.target.value)}
                          className="h-10 pl-8"
                        />
                        <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Distance (km)</label>
                      <Input
                        type="number"
                        value={route.distance_from_start}
                        onChange={(e) => updateRoute(index, "distance_from_start", Number(e.target.value))}
                        placeholder="0"
                        className="h-10"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Halt (min)</label>
                      <Input
                        type="number"
                        value={route.halt_duration}
                        onChange={(e) => updateRoute(index, "halt_duration", Number(e.target.value))}
                        placeholder="2"
                        className="h-10"
                        min="0"
                        max="60"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Adding Train...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Train
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
