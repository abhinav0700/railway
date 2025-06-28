// Test data generation script for 1000 trains
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL)

// Indian cities and their codes
const cities = [
  { name: "Mumbai", code: "MUM" },
  { name: "Delhi", code: "DEL" },
  { name: "Bangalore", code: "BLR" },
  { name: "Chennai", code: "CHN" },
  { name: "Kolkata", code: "KOL" },
  { name: "Hyderabad", code: "HYD" },
  { name: "Pune", code: "PUN" },
  { name: "Ahmedabad", code: "AMD" },
  { name: "Jaipur", code: "JAI" },
  { name: "Lucknow", code: "LKO" },
  { name: "Kanpur", code: "CNB" },
  { name: "Nagpur", code: "NGP" },
  { name: "Indore", code: "INDB" },
  { name: "Thane", code: "TNA" },
  { name: "Bhopal", code: "BPL" },
  { name: "Visakhapatnam", code: "VSKP" },
  { name: "Pimpri", code: "PCMC" },
  { name: "Patna", code: "PNBE" },
  { name: "Vadodara", code: "BRC" },
  { name: "Ghaziabad", code: "GZB" },
  { name: "Ludhiana", code: "LDH" },
  { name: "Agra", code: "AGC" },
  { name: "Nashik", code: "NK" },
  { name: "Faridabad", code: "FDB" },
  { name: "Meerut", code: "MTC" },
  { name: "Rajkot", code: "RJT" },
  { name: "Kalyan", code: "KYN" },
  { name: "Vasai", code: "BSR" },
  { name: "Varanasi", code: "BSB" },
  { name: "Srinagar", code: "SINA" },
  { name: "Aurangabad", code: "AWB" },
  { name: "Dhanbad", code: "DHN" },
  { name: "Amritsar", code: "ASR" },
  { name: "Navi Mumbai", code: "PANV" },
  { name: "Allahabad", code: "ALD" },
  { name: "Ranchi", code: "RNC" },
  { name: "Howrah", code: "HWH" },
  { name: "Coimbatore", code: "CBE" },
  { name: "Jabalpur", code: "JBP" },
  { name: "Gwalior", code: "GWL" },
  { name: "Vijayawada", code: "BZA" },
  { name: "Jodhpur", code: "JU" },
  { name: "Madurai", code: "MDU" },
  { name: "Raipur", code: "R" },
  { name: "Kota", code: "KOTA" },
  { name: "Chandigarh", code: "CDG" },
  { name: "Guwahati", code: "GHY" },
  { name: "Solapur", code: "SUR" },
  { name: "Hubli", code: "UBL" },
  { name: "Tiruchirappalli", code: "TPJ" },
  { name: "Bareilly", code: "BE" },
  { name: "Mysore", code: "MYS" },
  { name: "Tiruppur", code: "TUP" },
  { name: "Gurgaon", code: "GGN" },
  { name: "Aligarh", code: "ALJN" },
  { name: "Jalandhar", code: "JRC" },
  { name: "Bhubaneswar", code: "BBS" },
  { name: "Salem", code: "SA" },
  { name: "Warangal", code: "WL" },
  { name: "Guntur", code: "GNT" },
  { name: "Bhiwandi", code: "BIRD" },
  { name: "Saharanpur", code: "SRE" },
  { name: "Gorakhpur", code: "GKP" },
  { name: "Bikaner", code: "BKN" },
  { name: "Amravati", code: "AMI" },
  { name: "Noida", code: "NDLS" },
  { name: "Jamshedpur", code: "TATA" },
  { name: "Bhilai", code: "BIA" },
  { name: "Cuttack", code: "CTC" },
  { name: "Firozabad", code: "FZD" },
  { name: "Kochi", code: "ERS" },
  { name: "Nellore", code: "NLR" },
  { name: "Bhavnagar", code: "BVC" },
  { name: "Dehradun", code: "DDN" },
  { name: "Durgapur", code: "DGR" },
  { name: "Asansol", code: "ASN" },
  { name: "Rourkela", code: "ROU" },
  { name: "Nanded", code: "NED" },
  { name: "Kolhapur", code: "KOP" },
  { name: "Ajmer", code: "AII" },
  { name: "Akola", code: "AK" },
  { name: "Gulbarga", code: "GR" },
  { name: "Jamnagar", code: "JAM" },
  { name: "Ujjain", code: "UJN" },
  { name: "Loni", code: "LNI" },
  { name: "Siliguri", code: "SGUJ" },
  { name: "Jhansi", code: "JHS" },
  { name: "Ulhasnagar", code: "ULN" },
  { name: "Jammu", code: "JAT" },
  { name: "Sangli", code: "SLI" },
  { name: "Mangalore", code: "MAJN" },
  { name: "Erode", code: "ED" },
  { name: "Belgaum", code: "BGM" },
  { name: "Ambattur", code: "ABU" },
  { name: "Tirunelveli", code: "TEN" },
  { name: "Malegaon", code: "MMR" },
  { name: "Gaya", code: "GAYA" },
  { name: "Jalgaon", code: "JL" },
  { name: "Udaipur", code: "UDZ" },
  { name: "Maheshtala", code: "MJT" },
]

const trainPrefixes = [
  "Express",
  "Mail",
  "Passenger",
  "Superfast",
  "Rajdhani",
  "Shatabdi",
  "Duronto",
  "Garib Rath",
  "Jan Shatabdi",
  "Intercity",
  "Local",
  "Special",
]

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomTime() {
  const hours = Math.floor(Math.random() * 24)
  const minutes = Math.floor(Math.random() * 60)
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`
}

function getRandomDistance(min = 50, max = 500) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function generateTestData() {
  console.log("Starting test data generation...")

  try {
    // Insert all cities as stations
    console.log("Inserting stations...")
    for (const city of cities) {
      await sql`
        INSERT INTO stations (name, code) 
        VALUES (${city.name}, ${city.code})
        ON CONFLICT (code) DO NOTHING
      `
    }

    // Generate 1000 trains
    console.log("Generating 1000 trains...")
    const trains = []

    for (let i = 1; i <= 1000; i++) {
      const sourceCity = getRandomElement(cities)
      const trainName = `${sourceCity.name} ${getRandomElement(trainPrefixes)}`
      const trainNumber = `TR${i.toString().padStart(4, "0")}`

      trains.push({ name: trainName, number: trainNumber })

      // Insert train
      await sql`
        INSERT INTO trains (name, train_number) 
        VALUES (${trainName}, ${trainNumber})
        ON CONFLICT (train_number) DO NOTHING
      `

      // Generate route for this train (3-8 stations per train)
      const routeLength = Math.floor(Math.random() * 6) + 3
      const usedCities = new Set()
      const route = []

      // Start with a random city
      const currentCity = getRandomElement(cities)
      usedCities.add(currentCity.code)
      route.push({
        city: currentCity,
        sequence: 1,
        distance: 0,
        time: getRandomTime(),
      })

      // Add remaining stations
      let totalDistance = 0
      for (let j = 2; j <= routeLength; j++) {
        let nextCity
        do {
          nextCity = getRandomElement(cities)
        } while (usedCities.has(nextCity.code))

        usedCities.add(nextCity.code)
        totalDistance += getRandomDistance()

        route.push({
          city: nextCity,
          sequence: j,
          distance: totalDistance,
          time: getRandomTime(),
        })
      }

      // Sort route by time to ensure logical progression
      route.sort((a, b) => a.time.localeCompare(b.time))

      // Insert route
      for (let k = 0; k < route.length; k++) {
        const station = route[k]
        await sql`
          INSERT INTO train_routes (train_id, station_id, sequence_number, distance_from_start, departure_time)
          VALUES (
            (SELECT id FROM trains WHERE train_number = ${trainNumber}),
            (SELECT id FROM stations WHERE code = ${station.city.code}),
            ${k + 1},
            ${station.distance},
            ${station.time}
          )
          ON CONFLICT (train_id, station_id) DO NOTHING
        `
      }

      if (i % 100 === 0) {
        console.log(`Generated ${i} trains...`)
      }
    }

    console.log("Test data generation completed successfully!")
    console.log(`Generated:`)
    console.log(`- ${cities.length} stations`)
    console.log(`- 1000 trains`)
    console.log(`- Approximately ${1000 * 5} train routes`)
  } catch (error) {
    console.error("Error generating test data:", error)
  }
}

// Run the script
generateTestData()
