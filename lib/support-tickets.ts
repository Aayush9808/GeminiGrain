/**
 * In-memory support ticket store.
 */

export type TicketCategory =
  | 'ACCOUNT_ACCESS'
  | 'DONATION_ISSUE'
  | 'NGO_CONCERN'
  | 'VOLUNTEER_CONCERN'
  | 'TECHNICAL_BUG'
  | 'GENERAL_INQUIRY'

export const TICKET_CATEGORY_LABELS: Record<TicketCategory, string> = {
  ACCOUNT_ACCESS:    '🔑 Account / Login',
  DONATION_ISSUE:    '📦 Donation problem',
  NGO_CONCERN:       '🏥 NGO concern',
  VOLUNTEER_CONCERN: '🚴 Volunteer concern',
  TECHNICAL_BUG:     '🐛 Technical bug',
  GENERAL_INQUIRY:   '💬 General question',
}

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH'
export type TicketStatus   = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'

export interface SupportTicket {
  id:           string
  name:         string
  email:        string
  phone?:       string
  category:     TicketCategory
  subject:      string
  description:  string
  priority:     TicketPriority
  status:       TicketStatus
  createdAt:    Date
  updatedAt:    Date
  reply?:       string
}

const tickets = new Map<string, SupportTicket>()

export function createTicket(
  data: Omit<SupportTicket, 'id' | 'status' | 'priority' | 'createdAt' | 'updatedAt'>,
): SupportTicket {
  const id  = `tkt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const now = new Date()
  const ticket: SupportTicket = {
    ...data,
    id,
    priority:  'MEDIUM',
    status:    'OPEN',
    createdAt: now,
    updatedAt: now,
  }
  tickets.set(id, ticket)
  return ticket
}

export function getTicketById(id: string): SupportTicket | undefined {
  return tickets.get(id)
}

export function getAllTickets(): SupportTicket[] {
  return [...tickets.values()].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
