/**
 * POST /api/gemini/ngo-rank
 *
 * Uses Gemini to intelligently rank NGO candidates for a donation.
 * 
 * Body: { analysis: GeminiAnalysis, ngos: NGOProfile[] }
 * Returns: { success: true, data: RankedNGO[] }
 *
 * Falls back to distance-based ranking when GEMINI_API_KEY is not set.
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI }        from '@google/generative-ai'
import type { GeminiAnalysis, NGOProfile, RankedNGO } from '@/lib/types'

// ── Demo / fallback ──────────────────────────────────────────────────────────
function fallbackRanking(ngos: NGOProfile[], analysis: GeminiAnalysis): RankedNGO[] {
  return ngos
    .map(ngo => {
      // Dietary match filter
      const dietMatch = ngo.dietaryPref === 'any' || ngo.dietaryPref === analysis.dietaryType
      const score = (dietMatch ? 30 : 0)
        + (ngo.hasVolunteer ? 20 : 5)
        + (ngo.acceptanceRate ?? 80) * 0.4
        - ngo.distanceKm * 3

      return {
        ...ngo,
        confidence:   Math.round(Math.min(99, Math.max(50, score))),
        rank:         0,
        geminiReason: dietMatch
          ? `Dietary preference matches. ${ngo.hasVolunteer ? 'Internal volunteer available.' : 'Platform volunteer required.'} ${ngo.distanceKm} km away.`
          : `Does not accept ${analysis.dietaryType} food — low priority match.`,
      }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .map((ngo, i) => ({ ...ngo, rank: i + 1 }))
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { analysis: GeminiAnalysis; ngos: NGOProfile[] }
    const { analysis, ngos } = body

    if (!analysis || !ngos?.length) {
      return NextResponse.json({ success: false, error: 'analysis and ngos are required' }, { status: 400 })
    }

    const apiKey     = process.env.GEMINI_API_KEY
    const isDemoMode = !apiKey || apiKey === 'your_gemini_api_key_here'

    if (isDemoMode) {
      await new Promise(r => setTimeout(r, 600))
      return NextResponse.json({ success: true, data: fallbackRanking(ngos, analysis), demo: true })
    }

    // ── Real Gemini ranking call ───────────────────────────────────────────
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const ngosSummary = ngos.map((n, i) => (
      `${i + 1}. ${n.name} — ${n.distanceKm}km, capacity:${n.capacity}, accepts:${n.dietaryPref}, ` +
      `hasVolunteer:${n.hasVolunteer}, acceptanceRate:${n.acceptanceRate}%`
    )).join('\n')

    const prompt = `You are GeminiGrain AI — a food rescue logistics system for India.

A donor has ${analysis.quantity} of ${analysis.foodName} (${analysis.dietaryType}). 
Urgency: ${analysis.urgencyLevel}. Safe window: ${analysis.spoilageWindowHours} hours.
Servings: ${analysis.estimatedServings}.

NGO candidates:
${ngosSummary}

Rank these NGOs from best to worst match. Consider:
1. Dietary compatibility (critical)
2. Distance (closer is better, especially for HIGH/CRITICAL urgency)
3. Volunteer availability (NGOs with internal volunteers preferred)
4. Capacity vs donation size
5. Acceptance rate

Return ONLY a valid JSON array (no markdown, no text outside JSON):
[
  {
    "id": "ngo id",
    "rank": 1,
    "confidence": <integer 0-100>,
    "geminiReason": "one sentence explaining why this NGO is ranked here"
  },
  ...
]`

    const result = await model.generateContent(prompt)
    const text   = result.response.text()
    const match  = text.match(/\[[\s\S]*\]/)
    if (!match) throw new Error('No JSON array in Gemini response')

    const ranks: Array<{ id: string; rank: number; confidence: number; geminiReason: string }> = JSON.parse(match[0])

    const ranked: RankedNGO[] = ranks
      .map(r => {
        const ngo = ngos.find(n => n.id === r.id)
        if (!ngo) return null
        return { ...ngo, rank: r.rank, confidence: r.confidence, geminiReason: r.geminiReason }
      })
      .filter(Boolean) as RankedNGO[]

    return NextResponse.json({ success: true, data: ranked })

  } catch (err) {
    console.error('NGO rank error:', err)
    return NextResponse.json({ success: false, error: 'Ranking failed' }, { status: 500 })
  }
}
