import { v4 as uuidv4 } from 'uuid'
import type { Donation, NGOProfile, ImpactStats, DietaryType } from './types'

// ─── NGO Registry ────────────────────────────────────────────────────────────

export const NGO_REGISTRY: NGOProfile[] = [
  {
    id: 'ngo-1',
    name: 'Roti Bank Delhi',
    distance: '2.3 km',
    distanceKm: 2.3,
    capacity: 60,
    dietaryPref: 'any',
    acceptanceRate: 96,
    hasVolunteer: true,
  },
  {
    id: 'ngo-2',
    name: 'Asha Foundation',
    distance: '3.1 km',
    distanceKm: 3.1,
    capacity: 40,
    dietaryPref: 'vegetarian',
    acceptanceRate: 91,
    hasVolunteer: true,
  },
  {
    id: 'ngo-3',
    name: 'Sewa Samiti',
    distance: '4.8 km',
    distanceKm: 4.8,
    capacity: 80,
    dietaryPref: 'any',
    acceptanceRate: 88,
    hasVolunteer: false,
  },
  {
    id: 'ngo-4',
    name: 'Helping Hands NGO',
    distance: '6.2 km',
    distanceKm: 6.2,
    capacity: 35,
    dietaryPref: 'vegetarian',
    acceptanceRate: 85,
    hasVolunteer: true,
  },
]

// ─── In-Memory Store ─────────────────────────────────────────────────────────

const donations: Donation[] = [
  {
    id: uuidv4(),
    donorId: 'donor-1',
    donorName: 'Grand Palace Banquet',
    foodName: 'Veg Biryani + Dal Makhani',
    quantity: '45 plates (~12 kg)',
    estimatedServings: 45,
    dietaryType: 'vegetarian',
    urgency: 'HIGH',
    spoilageWindowHours: 4,
    urgencyReason: 'Freshly cooked; no refrigeration available',
    allergenFlags: ['dairy', 'nuts'],
    status: 'COMPLETED',
    ngoMatch: { ...NGO_REGISTRY[0], confidence: 94 },
    volunteerName: 'Priya Sharma',
    location: 'Sector 15, Noida',
    rawInput: '45 plate biryani ready hai, jaldi uthwao',
    detectedLanguage: 'Hindi',
    createdAt: new Date(Date.now() - 7_200_000),
    matchedAt: new Date(Date.now() - 6_800_000),
    deliveredAt: new Date(Date.now() - 5_400_000),
  },
  {
    id: uuidv4(),
    donorId: 'donor-2',
    donorName: 'InnoTech Corporate Cafeteria',
    foodName: 'Paneer Tikka + Chapati',
    quantity: '30 plates (~7 kg)',
    estimatedServings: 30,
    dietaryType: 'vegetarian',
    urgency: 'MEDIUM',
    spoilageWindowHours: 6,
    urgencyReason: 'Cooked 1 hour ago; mild refrigeration available',
    allergenFlags: ['dairy'],
    status: 'IN_TRANSIT',
    ngoMatch: { ...NGO_REGISTRY[1], confidence: 89 },
    volunteerName: 'Rahul Gupta',
    location: 'Cyber City, Gurugram',
    rawInput: 'We have leftover paneer tikka and chapatis from today\'s lunch',
    detectedLanguage: 'English',
    createdAt: new Date(Date.now() - 3_600_000),
    matchedAt: new Date(Date.now() - 3_200_000),
  },
  {
    id: uuidv4(),
    donorId: 'donor-3',
    donorName: 'Mehul\'s Dhaba',
    foodName: 'Rajma Chawal',
    quantity: '20 plates (~5 kg)',
    estimatedServings: 20,
    dietaryType: 'vegetarian',
    urgency: 'HIGH',
    spoilageWindowHours: 3,
    urgencyReason: 'Hot food, no cold storage',
    allergenFlags: [],
    status: 'SEARCHING_VOLUNTEER',
    ngoMatch: { ...NGO_REGISTRY[0], confidence: 91 },
    location: 'Rajouri Garden, Delhi',
    rawInput: '20 logo ka rajma chawal ready hai, abhi lo',
    detectedLanguage: 'Hindi',
    createdAt: new Date(Date.now() - 1_800_000),
    matchedAt: new Date(Date.now() - 1_500_000),
  },
  {
    id: uuidv4(),
    donorId: 'donor-1',
    donorName: 'Sunrise Hotel',
    foodName: 'Non-Veg Pulao + Raita',
    quantity: '15 plates (~4 kg)',
    estimatedServings: 15,
    dietaryType: 'non-vegetarian',
    urgency: 'CRITICAL',
    spoilageWindowHours: 1,
    urgencyReason: 'Chicken-based dish; degrading rapidly in summer heat',
    allergenFlags: ['dairy'],
    status: 'PENDING',
    location: 'Connaught Place, Delhi',
    rawInput: 'Urgent - leftover chicken pulao, need pickup ASAP',
    detectedLanguage: 'English',
    createdAt: new Date(Date.now() - 600_000),
  },
]

// ─── Store API ────────────────────────────────────────────────────────────────

export function getAllDonations(): Donation[] {
  return [...donations].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

export function getDonationById(id: string): Donation | undefined {
  return donations.find((d) => d.id === id)
}

export function addDonation(d: Donation): void {
  donations.unshift(d)
}

export function updateDonation(
  id: string,
  updates: Partial<Donation>,
): Donation | null {
  const idx = donations.findIndex((d) => d.id === id)
  if (idx === -1) return null
  donations[idx] = { ...donations[idx], ...updates }
  return donations[idx]
}

export function getImpactStats(): ImpactStats {
  const delivered     = donations.filter((d) => d.status === 'COMPLETED')
  const active        = donations.filter((d) =>
    ['PENDING', 'ACCEPTED_BY_NGO', 'SEARCHING_VOLUNTEER', 'IN_TRANSIT'].includes(d.status),
  )
  const today         = new Date()
  today.setHours(0, 0, 0, 0)
  const deliveredToday = delivered.filter(
    (d) => d.deliveredAt && d.deliveredAt >= today,
  )
  const mealsRescued  = delivered.reduce((s, d) => s + d.estimatedServings, 0)

  return {
    totalDonations:   donations.length,
    mealsRescued,
    activeDonations:  active.length,
    deliveredToday:   deliveredToday.length,
    co2AvoidedKg:     Math.round(mealsRescued * 0.2),
    volunteersActive: 3,
  }
}

// ─── NGO Matching (server-side fallback) ─────────────────────────────────────

export function matchNGO(
  dietaryType: string,
  servings: number,
): NGOProfile[] {
  return NGO_REGISTRY
    .filter((n) => n.dietaryPref === 'any' || n.dietaryPref === dietaryType)
    .filter((n) => n.capacity >= servings * 0.5)
    // Prioritize NGOs that can self-collect before falling back to platform volunteers.
    .sort((a, b) => {
      if (a.hasVolunteer !== b.hasVolunteer) return a.hasVolunteer ? -1 : 1
      return a.distanceKm - b.distanceKm
    })
    .map((n, i) => ({
      ...n,
      confidence: Math.max(60, 96 - i * 5 - Math.floor(n.distanceKm * 2)),
    }))
    .slice(0, 3)
}

export function registerNGOProfile(input: {
  name: string
  capacity: number
  dietaryPref: DietaryType | 'any'
  hasVolunteer: boolean
}): NGOProfile {
  const existing = NGO_REGISTRY.find(
    (ngo) => ngo.name.toLowerCase().trim() === input.name.toLowerCase().trim(),
  )
  if (existing) {
    existing.capacity = input.capacity
    existing.dietaryPref = input.dietaryPref
    existing.hasVolunteer = input.hasVolunteer
    return existing
  }

  const profile: NGOProfile = {
    id: `ngo-${NGO_REGISTRY.length + 1}`,
    name: input.name,
    distance: '5.0 km',
    distanceKm: 5,
    capacity: input.capacity,
    dietaryPref: input.dietaryPref,
    acceptanceRate: 85,
    hasVolunteer: input.hasVolunteer,
  }
  NGO_REGISTRY.push(profile)
  return profile
}
