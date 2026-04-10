import { NextRequest, NextResponse } from 'next/server'
import { getDonationById, updateDonation } from '@/lib/store'
import { advanceDonationFlow, toDashboardFoodItem, transitionDonationStatus } from '@/lib/donation-service'
import type { DonationStatus, FoodSafetyCertificate } from '@/lib/types'

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
      action?: 'advance' | 'ngo_accept' | 'search_volunteer' | 'pickup' | 'complete'
      status?: DonationStatus
      volunteerName?: string
      volunteerId?: string
      certificate?: FoodSafetyCertificate
    }

    if (body.action === 'advance') {
      const progressed = advanceDonationFlow(id)
      if (!progressed) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: progressed, item: toDashboardFoodItem(progressed) })
    }

    if (body.action) {
      const current = getDonationById(id)
      if (!current) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }

      const nextStatus = transitionDonationStatus(current.status, body.action)
      if (!nextStatus) {
        return NextResponse.json(
          { success: false, error: `Invalid transition from ${current.status} using ${body.action}` },
          { status: 400 },
        )
      }

      const actionUpdates: Record<string, unknown> = { status: nextStatus }
      if (nextStatus === 'ACCEPTED_BY_NGO') {
        actionUpdates.acceptedAt = new Date()
        actionUpdates.matchedAt = new Date()
      }
      if (nextStatus === 'IN_TRANSIT') {
        actionUpdates.volunteerName = body.volunteerName || current.volunteerName || 'Volunteer Assigned'
      }
      if (nextStatus === 'COMPLETED') {
        actionUpdates.deliveredAt = new Date()
      }

      const updatedFromAction = updateDonation(id, actionUpdates)
      if (!updatedFromAction) {
        return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
      }

      return NextResponse.json({
        success: true,
        data: updatedFromAction,
        item: toDashboardFoodItem(updatedFromAction),
      })
    }

    const updates: Record<string, unknown> = {}
    if (body.status)        updates.status        = body.status
    if (body.volunteerName) updates.volunteerName = body.volunteerName
    if (body.volunteerId)   updates.volunteerId   = body.volunteerId
    if (body.certificate)   updates.certificate   = body.certificate

    if (body.status === 'ACCEPTED_BY_NGO') {
      updates.acceptedAt = new Date()
      updates.matchedAt = new Date()
    }
    if (body.status === 'IN_TRANSIT' && !body.volunteerName) {
      const current = getDonationById(id)
      if (current?.ngoMatch?.hasVolunteer) {
        updates.volunteerName = 'NGO Self-Volunteer'
      }
    }
    if (body.status === 'COMPLETED') {
      updates.deliveredAt = new Date()
    }

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
