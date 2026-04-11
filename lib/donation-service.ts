import { v4 as uuidv4 } from 'uuid'
import { addDonation, getDonationById, updateDonation } from './store'
import type { Donation, DonationStatus, GeminiAnalysis, ImageValidationResult, RankedNGO } from './types'

export interface DonationSubmissionInput {
  donorId: string
  donorName: string
  location?: string
  rawInput?: string
  dishName?: string
  quantity?: string
  analysis?: GeminiAnalysis
  // Enhanced fields
  imagePath?:          string
  imageValidation?:    ImageValidationResult
  preparedMinutesAgo?: number
  consentGiven?:       boolean
  riskFlag?:           string
  geminiRankedNGOs?:   RankedNGO[]
}

export interface DashboardFoodItem {
  id: string
  dishName: string
  quantity: string
  donor: string
  status: DonationStatus
}

const FLOW_STAGES: DonationStatus[] = [
  'PENDING',
  'ACCEPTED_BY_NGO',
  'SEARCHING_VOLUNTEER',
  'COMPLETED',
]

const autoFlowTimers = new Map<string, NodeJS.Timeout[]>()

function clearAutoFlow(id: string) {
  const timers = autoFlowTimers.get(id)
  if (!timers) return
  timers.forEach((timer) => clearTimeout(timer))
  autoFlowTimers.delete(id)
}

export function toDashboardFoodItem(donation: Donation): DashboardFoodItem {
  return {
    id: donation.id,
    dishName: donation.foodName,
    quantity: donation.quantity,
    donor: donation.donorName,
    status: donation.status,
  }
}

export function buildDonationFromSubmission(input: DonationSubmissionInput): Donation {
  const now = new Date()
  const resolvedDishName = input.analysis?.foodName || input.dishName || 'Food Donation'
  const resolvedQuantity = input.analysis?.quantity || input.quantity || '1 batch'

  return {
    id: uuidv4(),
    donorId: input.donorId,
    donorName: input.donorName,
    foodName: resolvedDishName,
    quantity: resolvedQuantity,
    estimatedServings: input.analysis?.estimatedServings ?? 10,
    dietaryType: input.analysis?.dietaryType ?? 'vegetarian',
    urgency: input.analysis?.urgencyLevel ?? 'MEDIUM',
    spoilageWindowHours: input.analysis?.spoilageWindowHours ?? 4,
    urgencyReason: input.analysis?.urgencyReason ?? 'Submitted by donor',
    allergenFlags: input.analysis?.allergenFlags ?? [],
    status: 'PENDING',
    location: input.location || 'Location not specified',
    rawInput: input.rawInput || input.dishName || input.analysis?.foodName || 'Manual entry',
    detectedLanguage: input.analysis?.detectedLanguage ?? 'English',
    createdAt: now,
    geminiAnalysis: input.analysis,
    // Enhanced fields
    imagePath:          input.imagePath,
    imageValidation:    input.imageValidation,
    preparedMinutesAgo: input.preparedMinutesAgo,
    consentGiven:       input.consentGiven ?? false,
    riskFlag:           input.riskFlag,
    geminiRankedNGOs:   input.geminiRankedNGOs,
  }
}

export function createDonation(input: DonationSubmissionInput): Donation {
  const donation = buildDonationFromSubmission(input)
  addDonation(donation)
  return donation
}

export function getNextFlowStatus(status: DonationStatus): DonationStatus | null {
  const idx = FLOW_STAGES.indexOf(status)
  if (idx === -1 || idx >= FLOW_STAGES.length - 1) return null
  return FLOW_STAGES[idx + 1]
}

export function transitionDonationStatus(
  currentStatus: DonationStatus,
  action: 'ngo_accept' | 'search_volunteer' | 'pickup' | 'complete',
): DonationStatus | null {
  const transitions: Record<DonationStatus, Partial<Record<'ngo_accept' | 'search_volunteer' | 'pickup' | 'complete', DonationStatus>>> = {
    PENDING: {
      ngo_accept: 'ACCEPTED_BY_NGO',
    },
    ACCEPTED_BY_NGO: {
      search_volunteer: 'SEARCHING_VOLUNTEER',
      pickup: 'IN_TRANSIT',
    },
    SEARCHING_VOLUNTEER: {
      pickup: 'IN_TRANSIT',
    },
    IN_TRANSIT: {
      complete: 'COMPLETED',
    },
    COMPLETED: {},
  }

  return transitions[currentStatus][action] ?? null
}

export function advanceDonationFlow(id: string): Donation | null {
  const current = getDonationById(id)
  if (!current) return null

  const nextStatus = getNextFlowStatus(current.status)
  if (!nextStatus) return current

  const updates: Partial<Donation> = { status: nextStatus }
  if (nextStatus === 'ACCEPTED_BY_NGO') updates.acceptedAt = new Date()
  if (nextStatus === 'COMPLETED') updates.deliveredAt = new Date()

  const updated = updateDonation(id, updates)
  return updated
}

// Simulates backend status progression for demo and testing.
export function scheduleDonationFlow(id: string, baseDelayMs = 6000): void {
  clearAutoFlow(id)

  const timers: NodeJS.Timeout[] = []
  const stagesToApply: DonationStatus[] = [
    'ACCEPTED_BY_NGO',
    'SEARCHING_VOLUNTEER',
  ]

  stagesToApply.forEach((status, index) => {
    const timer = setTimeout(() => {
      const donation = getDonationById(id)
      if (!donation) return

      const updates: Partial<Donation> = { status }
      if (status === 'ACCEPTED_BY_NGO') updates.acceptedAt = new Date()
      updateDonation(id, updates)
    }, baseDelayMs * (index + 1))

    timers.push(timer)
  })

  autoFlowTimers.set(id, timers)
}

// Simulates an NGO accepting a pending donation, then progressing remaining stages.
export function simulateNgoAcceptFlow(id: string, baseDelayMs = 5000): Donation | null {
  const current = getDonationById(id)
  if (!current) return null

  clearAutoFlow(id)

  const accepted = updateDonation(id, {
    status: 'ACCEPTED_BY_NGO',
    acceptedAt: new Date(),
  })
  if (!accepted) return null

  const timers: NodeJS.Timeout[] = []

  const searchingTimer = setTimeout(() => {
    updateDonation(id, { status: 'SEARCHING_VOLUNTEER' })
  }, baseDelayMs)

  timers.push(searchingTimer)
  autoFlowTimers.set(id, timers)

  return accepted
}
