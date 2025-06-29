// Advanced pricing engine with dynamic pricing based on various factors
export interface PricingFactors {
  baseDistance: number
  trainType: string
  dayOfWeek: number // 0 = Sunday, 6 = Saturday
  isWeekend: boolean
  isHoliday: boolean
  demandMultiplier: number
  seasonalMultiplier: number
  bookingClass: "sleeper" | "3ac" | "2ac" | "1ac" | "cc"
}

export interface PriceBreakdown {
  basePrice: number
  distancePrice: number
  trainTypeMultiplier: number
  demandSurcharge: number
  weekendSurcharge: number
  holidaySurcharge: number
  seasonalAdjustment: number
  totalPrice: number
  savings?: number
  originalPrice?: number
}

// Base pricing configuration
const PRICING_CONFIG = {
  // Base rates per km for different train types
  trainTypeRates: {
    Rajdhani: 2.5,
    Shatabdi: 2.2,
    Duronto: 2.0,
    Superfast: 1.8,
    Express: 1.5,
    Mail: 1.3,
    Passenger: 1.0,
    "Jan Shatabdi": 1.6,
    Intercity: 1.4,
    Local: 0.8,
  },

  // Class multipliers
  classMultipliers: {
    sleeper: 1.0,
    "3ac": 2.5,
    "2ac": 3.5,
    "1ac": 5.0,
    cc: 2.0,
  },

  // Day-based pricing
  weekendSurcharge: 0.15, // 15% extra on weekends
  holidaySurcharge: 0.25, // 25% extra on holidays

  // Demand-based pricing (simulated)
  demandMultipliers: {
    low: 0.9, // 10% discount
    medium: 1.0, // No change
    high: 1.3, // 30% premium
    peak: 1.5, // 50% premium
  },

  // Seasonal adjustments
  seasonalMultipliers: {
    summer: 1.1, // 10% increase (Apr-Jun)
    monsoon: 0.95, // 5% decrease (Jul-Sep)
    winter: 1.2, // 20% increase (Oct-Mar)
  },

  // Distance-based tiers
  distanceTiers: [
    { min: 0, max: 200, multiplier: 1.2 }, // Short distance premium
    { min: 201, max: 500, multiplier: 1.0 }, // Standard rate
    { min: 501, max: 1000, multiplier: 0.9 }, // Medium distance discount
    { min: 1001, max: 2000, multiplier: 0.8 }, // Long distance discount
    { min: 2001, max: Number.POSITIVE_INFINITY, multiplier: 0.7 }, // Ultra long discount
  ],
}

// Indian holidays (simplified - in production, use a proper holiday API)
const INDIAN_HOLIDAYS_2024 = [
  "2024-01-26", // Republic Day
  "2024-03-08", // Holi
  "2024-03-29", // Good Friday
  "2024-08-15", // Independence Day
  "2024-10-02", // Gandhi Jayanti
  "2024-10-24", // Dussehra
  "2024-11-12", // Diwali
  "2024-12-25", // Christmas
]

export function calculateDynamicPrice(
  distance: number,
  trainType: string,
  travelDate: Date,
  bookingClass: "sleeper" | "3ac" | "2ac" | "1ac" | "cc" = "sleeper",
): PriceBreakdown {
  // Get base rate for train type
  const baseRate = PRICING_CONFIG.trainTypeRates[trainType as keyof typeof PRICING_CONFIG.trainTypeRates] || 1.5

  // Calculate base price
  const basePrice = 50 // Minimum booking fee

  // Distance-based pricing with tiers
  const distanceTier =
    PRICING_CONFIG.distanceTiers.find((tier) => distance >= tier.min && distance <= tier.max) ||
    PRICING_CONFIG.distanceTiers[1]

  const distancePrice = distance * baseRate * distanceTier.multiplier

  // Train type multiplier (already included in baseRate, but for display)
  const trainTypeMultiplier = 1.0

  // Date-based factors
  const dayOfWeek = travelDate.getDay()
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
  const dateString = travelDate.toISOString().split("T")[0]
  const isHoliday = INDIAN_HOLIDAYS_2024.includes(dateString)

  // Weekend surcharge
  const weekendSurcharge = isWeekend ? (basePrice + distancePrice) * PRICING_CONFIG.weekendSurcharge : 0

  // Holiday surcharge
  const holidaySurcharge = isHoliday ? (basePrice + distancePrice) * PRICING_CONFIG.holidaySurcharge : 0

  // Demand simulation (based on day of week and route popularity)
  const demandLevel = getDemandLevel(dayOfWeek, distance)
  const demandMultiplier = PRICING_CONFIG.demandMultipliers[demandLevel]
  const demandSurcharge = (basePrice + distancePrice) * (demandMultiplier - 1)

  // Seasonal adjustment
  const season = getSeason(travelDate)
  const seasonalMultiplier = PRICING_CONFIG.seasonalMultipliers[season]
  const seasonalAdjustment = (basePrice + distancePrice) * (seasonalMultiplier - 1)

  // Class multiplier
  const classMultiplier = PRICING_CONFIG.classMultipliers[bookingClass]

  // Calculate total
  let totalPrice =
    (basePrice + distancePrice + weekendSurcharge + holidaySurcharge + demandSurcharge + seasonalAdjustment) *
    classMultiplier

  // Apply early bird discount for bookings more than 30 days in advance
  const daysInAdvance = Math.floor((travelDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  let savings = 0
  const originalPrice = totalPrice

  if (daysInAdvance > 30) {
    savings = totalPrice * 0.1 // 10% early bird discount
    totalPrice = totalPrice - savings
  } else if (daysInAdvance > 15) {
    savings = totalPrice * 0.05 // 5% advance booking discount
    totalPrice = totalPrice - savings
  }

  return {
    basePrice: Math.round(basePrice),
    distancePrice: Math.round(distancePrice),
    trainTypeMultiplier,
    demandSurcharge: Math.round(demandSurcharge),
    weekendSurcharge: Math.round(weekendSurcharge),
    holidaySurcharge: Math.round(holidaySurcharge),
    seasonalAdjustment: Math.round(seasonalAdjustment),
    totalPrice: Math.round(totalPrice),
    savings: savings > 0 ? Math.round(savings) : undefined,
    originalPrice: savings > 0 ? Math.round(originalPrice) : undefined,
  }
}

function getDemandLevel(dayOfWeek: number, distance: number): keyof typeof PRICING_CONFIG.demandMultipliers {
  // Simulate demand based on day and route
  if (dayOfWeek === 5 || dayOfWeek === 0) return "high" // Friday/Sunday high demand
  if (dayOfWeek === 6) return "peak" // Saturday peak demand
  if (distance > 1000) return "medium" // Long routes medium demand
  if (dayOfWeek >= 1 && dayOfWeek <= 4) return "low" // Weekdays low demand
  return "medium"
}

function getSeason(date: Date): keyof typeof PRICING_CONFIG.seasonalMultipliers {
  const month = date.getMonth() + 1 // 1-12
  if (month >= 4 && month <= 6) return "summer"
  if (month >= 7 && month <= 9) return "monsoon"
  return "winter"
}

// Utility function to get price for different classes
export function getPriceForAllClasses(distance: number, trainType: string, travelDate: Date) {
  const classes: Array<"sleeper" | "3ac" | "2ac" | "1ac" | "cc"> = ["sleeper", "3ac", "2ac", "1ac", "cc"]

  return classes.map((cls) => ({
    class: cls,
    name: getClassName(cls),
    ...calculateDynamicPrice(distance, trainType, travelDate, cls),
  }))
}

function getClassName(cls: string): string {
  const names = {
    sleeper: "Sleeper (SL)",
    "3ac": "3rd AC (3A)",
    "2ac": "2nd AC (2A)",
    "1ac": "1st AC (1A)",
    cc: "Chair Car (CC)",
  }
  return names[cls as keyof typeof names] || cls
}
