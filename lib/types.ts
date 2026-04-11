export type UrgencyLevel   = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type DonationStatus  = 'PENDING' | 'ACCEPTED_BY_NGO' | 'SEARCHING_VOLUNTEER' | 'IN_TRANSIT' | 'COMPLETED'
export type DietaryType     = 'vegetarian' | 'non-vegetarian' | 'vegan'
export type UserRole        = 'donor' | 'ngo' | 'volunteer'
export type RestaurantType  = 'restaurant' | 'cafe' | 'hostel' | 'event' | 'other'
export type VehicleType     = 'bike' | 'scooter' | 'car' | 'van' | 'truck'

// User Profile Types
export interface DonorProfile {
  id: string
  phoneNumber: string
  name: string
  address: string
  restaurantType: RestaurantType
  contactPerson?: string
  verified: boolean
  createdAt: Date
  role: 'donor'
}

export interface NGOUserProfile {
  id: string
  phoneNumber: string
  name: string
  address: string
  capacity: number
  dietaryPref: DietaryType | 'any'
  hasVolunteer: boolean
  contactPerson?: string
  verified: boolean
  createdAt: Date
  role: 'ngo'
}

export interface VolunteerProfile {
  id: string
  phoneNumber: string
  name: string
  address: string
  vehicleType: VehicleType
  availability?: string
  verified: boolean
  createdAt: Date
  role: 'volunteer'
}

export type UserProfile = DonorProfile | NGOUserProfile | VolunteerProfile

export interface NGOProfile {
  id: string
  name: string
  distance: string
  distanceKm: number
  capacity: number
  dietaryPref: DietaryType | 'any'
  acceptanceRate: number   // 0-100
  hasVolunteer: boolean
  confidence?: number      // 0-100 – set by Gemini match
}

export interface Donation {
  id: string
  donorId: string
  donorName: string
  foodName: string
  quantity: string
  estimatedServings: number
  dietaryType: DietaryType
  urgency: UrgencyLevel
  spoilageWindowHours: number
  urgencyReason: string
  allergenFlags: string[]
  status: DonationStatus
  ngoMatch?: NGOProfile
  volunteerId?: string
  volunteerName?: string
  location: string
  rawInput: string
  detectedLanguage?: string
  createdAt: Date
  matchedAt?: Date
  acceptedAt?: Date
  deliveredAt?: Date
  geminiAnalysis?: GeminiAnalysis
  certificate?: FoodSafetyCertificate

  // ── Enhanced fields ─────────────────────────────────────────
  imagePath?:        string                // public URL of uploaded food photo
  imageValidation?:  ImageValidationResult // Gemini Vision result
  preparedMinutesAgo?: number             // donor-provided time since food was made
  consentGiven?:     boolean              // donor confirmed safety consent
  riskFlag?:         string               // shown to NGO if WARNING/REJECT
  geminiRankedNGOs?: RankedNGO[]          // Gemini-ranked NGO candidates
}

/** Result of Gemini Vision scanning the donor's food photo */
export interface ImageValidationResult {
  result:     'GOOD' | 'WARNING' | 'REJECT'
  reason:     string
  confidence: number   // 0–100
}

/** NGO ranked by Gemini decision engine */
export interface RankedNGO extends NGOProfile {
  geminiReason: string  // why Gemini chose this NGO
  rank:         number  // 1 = best
}

export interface GeminiAnalysis {
  foodName: string
  quantity: string
  estimatedServings: number
  dietaryType: DietaryType
  urgencyLevel: UrgencyLevel
  spoilageWindowHours: number
  urgencyReason: string
  allergenFlags: string[]
  locationHint: string
  recommendedAction: string
  confidence: number
  detectedLanguage: string
}

export interface FoodSafetyCertificate {
  safetyStatus: 'SAFE' | 'CAUTION' | 'UNSAFE'
  assessmentSummary: string
  timeFromCookToDelivery: string
  safeConsumptionWindow: string
  servingSuggestion: string
  allergenWarning: string | null
  fssaiNote: string
  certifiedBy: string
  certId?: string
  generatedAt?: string
}

export interface ImpactStats {
  totalDonations: number
  mealsRescued: number
  activeDonations: number
  deliveredToday: number
  co2AvoidedKg: number
  volunteersActive: number
}
