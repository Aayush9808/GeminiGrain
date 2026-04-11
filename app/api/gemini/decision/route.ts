/**
 * POST /api/gemini/decision
 *
 * Gemini-powered decision endpoint for:
 *  1. NGO reassignment — when primary NGO fails to respond
 *  2. Urgency escalation — recalculate urgency based on time elapsed
 *  3. Volunteer prioritization — rank available volunteers
 *
 * Body: { type: 'reassign' | 'escalate' | 'volunteer_rank', donationId: string, context?: object }
 * Returns: { success: true, data: DecisionResult }
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI }        from '@google/generative-ai'
import { getDonationById }           from '@/lib/store'
import { NGO_REGISTRY }              from '@/lib/store'
import type { Donation }             from '@/lib/types'

export interface DecisionResult {
  action:   string
  reason:   string
  priority: 'IMMEDIATE' | 'HIGH' | 'NORMAL'
  data?:    Record<string, unknown>
}

// ── Smart fallback decisions ──────────────────────────────────────────────────
function smartDecision(type: string, donation: Donation): DecisionResult {
  const hoursOld = (Date.now() - new Date(donation.createdAt).getTime()) / 3_600_000
  const spoilPct = hoursOld / donation.spoilageWindowHours

  if (type === 'reassign') {
    // Pick NGO with highest acceptance rate that can still receive
    const alternatives = NGO_REGISTRY
      .filter(n => n.id !== donation.ngoMatch?.id)
      .filter(n => n.dietaryPref === 'any' || n.dietaryPref === donation.dietaryType)
      .sort((a, b) => b.acceptanceRate - a.acceptanceRate)

    const best = alternatives[0] || NGO_REGISTRY[0]
    return {
      action:   `Reassign to ${best.name}`,
      reason:   `Primary NGO did not respond. ${best.name} has ${best.acceptanceRate}% acceptance rate and is ${best.distanceKm} km away.`,
      priority: spoilPct > 0.7 ? 'IMMEDIATE' : 'HIGH',
      data:     { recommendedNgo: best },
    }
  }

  if (type === 'escalate') {
    const newUrgency = spoilPct > 0.8 ? 'CRITICAL' : spoilPct > 0.5 ? 'HIGH' : donation.urgency
    return {
      action:   `Escalate urgency to ${newUrgency}`,
      reason:   `${Math.round(spoilPct * 100)}% of spoilage window elapsed. Immediate action required.`,
      priority: spoilPct > 0.7 ? 'IMMEDIATE' : 'NORMAL',
      data:     { newUrgency, spoilagePercent: Math.round(spoilPct * 100) },
    }
  }

  return {
    action:   'Monitor',
    reason:   'No immediate action required. Donation is within safe window.',
    priority: 'NORMAL',
  }
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      type:       'reassign' | 'escalate' | 'volunteer_rank'
      donationId: string
      context?:   Record<string, unknown>
    }

    const { type, donationId } = body
    if (!type || !donationId) {
      return NextResponse.json({ success: false, error: 'type and donationId required' }, { status: 400 })
    }

    const donation = getDonationById(donationId)
    if (!donation) {
      return NextResponse.json({ success: false, error: 'Donation not found' }, { status: 404 })
    }

    const apiKey     = process.env.GEMINI_API_KEY
    const isDemoMode = !apiKey || apiKey === 'your_gemini_api_key_here'

    if (isDemoMode) {
      return NextResponse.json({ success: true, data: smartDecision(type, donation), demo: true })
    }

    // ── Real Gemini decision ──────────────────────────────────────────────
    const genAI  = new GoogleGenerativeAI(apiKey)
    const model  = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    const hoursOld = ((Date.now() - new Date(donation.createdAt).getTime()) / 3_600_000).toFixed(1)

    const ngoList = NGO_REGISTRY.map(n =>
      `${n.name}: ${n.distanceKm}km, ${n.dietaryPref} food, volunteer:${n.hasVolunteer}, rate:${n.acceptanceRate}%`
    ).join('\n')

    const prompt = `You are GeminiGrain AI — logistics decision engine for food rescue in India.

Donation info:
- Food: ${donation.foodName} (${donation.quantity})
- Dietary: ${donation.dietaryType}
- Urgency: ${donation.urgency}
- Status: ${donation.status}
- Created: ${hoursOld} hours ago
- Spoilage window: ${donation.spoilageWindowHours} hours
- Current NGO: ${donation.ngoMatch?.name || 'None'}

Decision needed: ${type === 'reassign' ? 'Primary NGO did not respond. Choose best alternative NGO.' : type === 'escalate' ? 'Should urgency be escalated? What action?' : 'Prioritize this donation.'}

Available NGOs:
${ngoList}

Return ONLY valid JSON (no markdown):
{
  "action": "clear action to take",
  "reason": "one sentence justification",
  "priority": "IMMEDIATE" | "HIGH" | "NORMAL",
  "data": {}
}`

    const result  = await model.generateContent(prompt)
    const text    = result.response.text()
    const match   = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')

    const decision: DecisionResult = JSON.parse(match[0])
    return NextResponse.json({ success: true, data: decision })

  } catch (err) {
    console.error('Decision engine error:', err)
    return NextResponse.json({ success: false, error: 'Decision engine failed' }, { status: 500 })
  }
}
