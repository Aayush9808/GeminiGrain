import { NextRequest, NextResponse } from 'next/server'
import { createTicket, getAllTickets, type TicketCategory } from '@/lib/support-tickets'

// ── POST /api/support ─────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      name:        string
      email:       string
      phone?:      string
      category:    TicketCategory
      subject:     string
      description: string
    }

    const { name, email, category, subject, description } = body

    if (!name?.trim() || !email?.trim() || !category || !subject?.trim() || !description?.trim()) {
      return NextResponse.json({ success: false, error: 'All required fields must be filled' }, { status: 400 })
    }

    // Basic email validation
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Invalid email address' }, { status: 400 })
    }

    if (description.trim().length < 20) {
      return NextResponse.json({ success: false, error: 'Description too short (min 20 chars)' }, { status: 400 })
    }

    const ticket = createTicket({
      name:        name.trim(),
      email:       email.trim().toLowerCase(),
      phone:       body.phone?.trim() || undefined,
      category,
      subject:     subject.trim(),
      description: description.trim(),
    })

    return NextResponse.json({ success: true, data: { id: ticket.id, status: ticket.status } }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/support ──────────────────────────────────────────────────────────
export async function GET() {
  const list = getAllTickets()
  return NextResponse.json({ success: true, data: list, total: list.length })
}
