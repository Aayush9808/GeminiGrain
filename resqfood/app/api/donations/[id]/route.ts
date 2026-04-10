import { NextRequest, NextResponse } from 'next/server'
import { getDonationById, updateDonation } from '@/lib/store'
import type { DonationStatus } from '@/lib/types'

// ─── GET /api/donations/[id] ──────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const donation = getDonationById(id)
  if (!donation) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: donation })
}

// ─── PATCH /api/donations/[id] ────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = (await req.json()) as {
      status?: DonationStatus
      volunteerName?: string
      volunteerId?: string
    }

    const updates: Record<string, unknown> = {}
    if (body.status)        updates.status        = body.status
    if (body.volunteerName) updates.volunteerName = body.volunteerName
    if (body.volunteerId)   updates.volunteerId   = body.volunteerId

    if (body.status === 'IN_TRANSIT') updates.matchedAt   = new Date()
    if (body.status === 'COMPLETED')  updates.deliveredAt = new Date()

    const updated = updateDonation(id, updates)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    console.error('PATCH /api/donations/[id] error:', err)
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  }
}
