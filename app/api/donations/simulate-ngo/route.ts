import { NextRequest, NextResponse } from 'next/server'
import { getAllDonations } from '@/lib/store'
import { simulateNgoAcceptFlow, toDashboardFoodItem } from '@/lib/donation-service'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as { donationId?: string }

    const targetId = body.donationId ?? getAllDonations().find((d) => d.status === 'PENDING')?.id
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'No pending donation available for NGO simulation' }, { status: 404 })
    }

    const updated = simulateNgoAcceptFlow(targetId)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'NGO acceptance simulated. Remaining stages are scheduled.',
      data: updated,
      item: toDashboardFoodItem(updated),
    })
  } catch (err) {
    console.error('POST /api/donations/simulate-ngo error:', err)
    return NextResponse.json({ success: false, error: 'Failed to simulate NGO acceptance' }, { status: 500 })
  }
}
