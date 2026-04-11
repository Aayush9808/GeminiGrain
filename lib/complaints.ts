/**
 * In-memory complaint store.
 * Complaint = NGO flags an issue with a donation after delivery/pickup.
 */

export type ComplaintCategory =
  | 'FOOD_QUALITY'
  | 'WRONG_QUANTITY'
  | 'LATE_DELIVERY'
  | 'DAMAGED_PACKAGING'
  | 'DONOR_UNRESPONSIVE'
  | 'OTHER'

export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  FOOD_QUALITY:        '🍽️ Food quality issue',
  WRONG_QUANTITY:      '⚖️ Wrong quantity delivered',
  LATE_DELIVERY:       '⏰ Delivery was too late',
  DAMAGED_PACKAGING:   '📦 Damaged packaging',
  DONOR_UNRESPONSIVE:  '📵 Donor was unresponsive',
  OTHER:               '📝 Other',
}

export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED'

export interface ComplaintRecord {
  id:           string
  donationId:   string
  ngoId:        string
  ngoName:      string
  category:     ComplaintCategory
  description:  string
  status:       ComplaintStatus
  createdAt:    Date
  updatedAt:    Date
  resolution?:  string
}

const complaints = new Map<string, ComplaintRecord>()

export function createComplaint(
  data: Omit<ComplaintRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
): ComplaintRecord {
  const id  = `cmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const now = new Date()
  const record: ComplaintRecord = {
    ...data,
    id,
    status:    'OPEN',
    createdAt: now,
    updatedAt: now,
  }
  complaints.set(id, record)
  return record
}

export function getComplaintsByNgo(ngoId: string): ComplaintRecord[] {
  return [...complaints.values()].filter((c) => c.ngoId === ngoId)
}

export function getComplaintByDonation(donationId: string): ComplaintRecord | undefined {
  return [...complaints.values()].find((c) => c.donationId === donationId)
}

export function getAllComplaints(): ComplaintRecord[] {
  return [...complaints.values()].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  )
}

export function resolveComplaint(id: string, resolution: string): ComplaintRecord | null {
  const c = complaints.get(id)
  if (!c) return null
  const updated = { ...c, status: 'RESOLVED' as ComplaintStatus, resolution, updatedAt: new Date() }
  complaints.set(id, updated)
  return updated
}
