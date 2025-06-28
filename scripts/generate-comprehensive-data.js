// Enhanced test data generation script for production-ready data
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL)

// Comprehensive Indian railway stations data
const majorStations = [
  // Metro Cities & Major Junctions
  { name: "New Delhi", code: "NDLS", state: "Delhi", zone: "NR", lat: 28.6448, lng: 77.2097 },
  { name: "Mumbai Central", code: "MMCT", state: "Maharashtra", zone: "WR", lat: 18.969, lng: 72.8205 },
  { name: "Chennai Central", code: "MAS", state: "Tamil Nadu", zone: "SR", lat: 13.0827, lng: 80.2707 },
  { name: "Howrah Junction", code: "HWH", state: "West Bengal", zone: "ER", lat: 22.5726, lng: 88.3639 },
  { name: "Bangalore City", code: "SBC", state: "Karnataka", zone: "SWR", lat: 12.9716, lng: 77.5946 },

  // Add 50+ more stations for comprehensive coverage
  { name: "Hyderabad Deccan", code: "HYB", state: "Telangana", zone: "SCR", lat: 17.385, lng: 78.4867 },
  { name: "Pune Junction", code: "PUNE", state: "Maharashtra", zone: "CR", lat: 18.5204, lng: 73.8567 },
  { name: "Ahmedabad Junction", code: "ADI", state: "Gujarat", zone: "WR", lat: 23.0225, lng: 72.5714 },
  { name: "Kolkata", code: "KOAA", state: "West Bengal", zone: "ER", lat: 22.5726, lng: 88.3639 },
  { name: "Jaipur Junction", code: "JP", state: "Rajasthan", zone: "NWR", lat: 26.9124, lng: 75.7873 },

  // Continue with more stations...
]

const trainTypes = [
  "Rajdhani Express",
  "Shatabdi Express",
  "Duronto Express",
  "Garib Rath",
  "Jan Shatabdi",
  "Superfast Express",
  "Express",
  "Mail",
  "Passenger",
  "Intercity Express",
  "Double Decker",
  "Humsafar Express",
  "Tejas Express",
  "Vande Bharat Express",
  "Gatimaan Express",
]

const trainNames = [
  "Golden Temple",
  "Himalayan Queen",
  "Deccan Queen",
  "Flying Ranee",
  "Gitanjali",
  "Coromandel",
  "Grand Trunk",
  "Karnataka",
  "Tamil Nadu",
  "Kerala",
  "Konkan Kanya",
  "Mumbai Rajdhani",
  "Chennai Rajdhani",
  "Bangalore Rajdhani",
  "Bhopal Shatabdi",
  "Mysore Shatabdi",
]

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24)
  const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)] // Realistic train timings
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

function getRandomDistance(min = 50, max = 800) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateTrainNumber(index, type) {
  const prefixes = {
    "Rajdhani Express": "123",
    "Shatabdi Express": "120",
    "Duronto Express": "122",
    "Superfast Express": "124",
    Express: "126",
    Mail: "128",
  }
  const prefix = prefixes[type] || "129"
  return `${prefix}${(index % 100).toString().padStart(2, "0")}`
}

async function generateComprehensiveData() {
  console.log("🚀 Starting comprehensive test data generation...")

  try {
    // First, insert all major stations
    console.log("📍 Inserting major railway stations...")
    for (const station of majorStations) {
      await sql`
        INSERT INTO stations (name, code, state, zone, latitude, longitude) 
        VALUES (${station.name}, ${station.code}, ${station.state}, ${station.zone}, ${station.lat}, ${station.lng})
        ON CONFLICT (code) DO UPDATE SET
          name = EXCLUDED.name,
          state = EXCLUDED.state,
          zone = EXCLUDED.zone,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude
      `
    }

    // Generate 1000 trains with realistic data
    console.log("🚂 Generating 1000 trains with routes...")

    for (let i = 1; i <= 1000; i++) {
      const trainType = getRandomElement(trainTypes)
      const baseName = getRandomElement(trainNames)
      const trainName = `${baseName} ${trainType}`
      const trainNumber = generateTrainNumber(i, trainType)

      // Insert train
      await sql`
        INSERT INTO trains (name, train_number, train_type) 
        VALUES (${trainName}, ${trainNumber}, ${trainType})
        ON CONFLICT (train_number) DO UPDATE SET
          name = EXCLUDED.name,
          train_type = EXCLUDED.train_type
      `

      // Generate realistic route (2-8 stations per train)
      const routeLength = Math.floor(Math.random() * 7) + 2
      const availableStations = [...majorStations]
      const route = []

      // Select random starting station
      const startStation = getRandomElement(availableStations)
      availableStations.splice(availableStations.indexOf(startStation), 1)

      let totalDistance = 0
      let currentTime = getRandomTime()

      route.push({
        station: startStation,
        sequence: 1,
        distance: 0,
        departureTime: currentTime,
        arrivalTime: currentTime,
      })

      // Add intermediate and final stations
      for (let j = 2; j <= routeLength; j++) {
        if (availableStations.length === 0) break

        const nextStation = getRandomElement(availableStations)
        availableStations.splice(availableStations.indexOf(nextStation), 1)

        const segmentDistance = getRandomDistance(100, 500)
        totalDistance += segmentDistance

        // Calculate realistic arrival time (assuming 60 km/h average speed)
        const travelHours = segmentDistance / 60
        const arrivalTime = addHoursToTime(currentTime, travelHours)
        const departureTime = addMinutesToTime(arrivalTime, Math.floor(Math.random() * 10) + 2) // 2-12 min halt

        route.push({
          station: nextStation,
          sequence: j,
          distance: totalDistance,
          arrivalTime: arrivalTime,
          departureTime: j === routeLength ? arrivalTime : departureTime, // Last station doesn't have departure
        })

        currentTime = departureTime
      }

      // Insert route data
      for (const stop of route) {
        await sql`
          INSERT INTO train_routes (
            train_id, 
            station_id, 
            sequence_number, 
            distance_from_start, 
            departure_time, 
            arrival_time,
            halt_duration
          )
          VALUES (
            (SELECT id FROM trains WHERE train_number = ${trainNumber}),
            (SELECT id FROM stations WHERE code = ${stop.station.code}),
            ${stop.sequence},
            ${stop.distance},
            ${stop.departureTime},
            ${stop.arrivalTime},
            ${stop.sequence === 1 || stop.sequence === routeLength ? 0 : Math.floor(Math.random() * 10) + 2}
          )
          ON CONFLICT (train_id, station_id) DO UPDATE SET
            sequence_number = EXCLUDED.sequence_number,
            distance_from_start = EXCLUDED.distance_from_start,
            departure_time = EXCLUDED.departure_time,
            arrival_time = EXCLUDED.arrival_time
        `
      }

      if (i % 100 === 0) {
        console.log(`✅ Generated ${i} trains...`)
      }
    }

    // Generate summary statistics
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM stations) as stations,
        (SELECT COUNT(*) FROM trains) as trains,
        (SELECT COUNT(*) FROM train_routes) as routes,
        (SELECT COUNT(DISTINCT train_type) FROM trains) as train_types
    `

    console.log("🎉 Data generation completed successfully!")
    console.log("📊 Final Statistics:")
    console.log(`   - Stations: ${stats[0].stations}`)
    console.log(`   - Trains: ${stats[0].trains}`)
    console.log(`   - Routes: ${stats[0].routes}`)
    console.log(`   - Train Types: ${stats[0].train_types}`)
  } catch (error) {
    console.error("❌ Error generating data:", error)
    throw error
  }
}

// Helper functions
function addHoursToTime(timeStr, hours) {
  const [h, m, s] = timeStr.split(":").map(Number)
  const totalMinutes = h * 60 + m + hours * 60
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMinutes = Math.floor(totalMinutes % 60)
  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

function addMinutesToTime(timeStr, minutes) {
  const [h, m, s] = timeStr.split(":").map(Number)
  const totalMinutes = h * 60 + m + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMinutes = totalMinutes % 60
  return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
}

// Run the script
generateComprehensiveData().catch(console.error)
