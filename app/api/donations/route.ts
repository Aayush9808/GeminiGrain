import { NextRequest, NextResponse } from 'next/server'
import { getAllDonations } from '@/lib/store'
import { createDonation, scheduleDonationFlow, toDashboardFoodItem } from '@/lib/donation-service'
import type { GeminiAnalysis, ImageValidationResult } from '@/lib/types'

// ─── GET /api/donations ───────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const donorId = searchParams.get('donorId')

  let list = getAllDonations()
  if (status)  list = list.filter((d) => d.status === status)
  if (donorId) list = list.filter((d) => d.donorId === donorId)

  return NextResponse.json({
    success: true,
    data: list,
    items: list.map(toDashboardFoodItem),
    total: list.length,
  })
}

// ─── POST /api/donations ──────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      donorId: string
      donorName: string
      location: string
      rawInput: string
      dishName?: string
      quantity?: string
      autoProgress?: boolean
      analysis: GeminiAnalysis
      // Enhanced fields
      imagePath?:          string
      imageValidation?:    ImageValidationResult
      preparedMinutesAgo?: number
      consentGiven?:       boolean
      riskFlag?:           string
    }

    const { donorId, donorName, location, rawInput, analysis, dishName, quantity, autoProgress,
            imagePath, imageValidation, preparedMinutesAgo, consentGiven, riskFlag } = body

    if (!donorId || !donorName || (!analysis && !dishName)) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const donation = createDonation({
      donorId,
      donorName,
      location,
      rawInput,
      dishName,
      quantity,
      analysis,
      imagePath,
      imageValidation,
      preparedMinutesAgo,
      consentGiven,
      riskFlag,
    })

    if (autoProgress !== false) {
      scheduleDonationFlow(donation.id)
    }

    return NextResponse.json(
      {
        success: true,
        data: donation,
        item: toDashboardFoodItem(donation),
      },
      { status: 201 },
    )
  } catch (err) {
    console.error('POST /api/donations error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create donation' }, { status: 500 })
  }
}
