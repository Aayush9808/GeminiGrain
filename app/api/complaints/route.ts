import { NextRequest, NextResponse } from 'next/server'
import {
  createComplaint,
  getAllComplaints,
  resolveComplaint,
  type ComplaintCategory,
} from '@/lib/complaints'

// ── POST /api/complaints ──────────────────────────────────────────────────────
// Body: { donationId, ngoId, ngoName, category, description }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      donationId:  string
      ngoId:       string
      ngoName:     string
      category:    ComplaintCategory
      description: string
    }

    const { donationId, ngoId, ngoName, category, description } = body

    if (!donationId || !ngoId || !category || !description?.trim()) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    if (description.trim().length < 10) {
      return NextResponse.json({ success: false, error: 'Description too short (min 10 chars)' }, { status: 400 })
    }

    const complaint = createComplaint({ donationId, ngoId, ngoName, category, description: description.trim() })
    return NextResponse.json({ success: true, data: complaint }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

// ── GET /api/complaints ───────────────────────────────────────────────────────
// Query: ?ngoId=xxx  (omit for all)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ngoId = searchParams.get('ngoId')

  const list = getAllComplaints().filter(c => !ngoId || c.ngoId === ngoId)
  return NextResponse.json({ success: true, data: list, total: list.length })
}

// ── PATCH /api/complaints ─────────────────────────────────────────────────────
// Body: { id, resolution }
export async function PATCH(req: NextRequest) {
  try {
    const { id, resolution } = await req.json() as { id: string; resolution: string }
    if (!id || !resolution?.trim()) {
      return NextResponse.json({ success: false, error: 'id and resolution required' }, { status: 400 })
    }
    const updated = resolveComplaint(id, resolution.trim())
    if (!updated) return NextResponse.json({ success: false, error: 'Complaint not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
