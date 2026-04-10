import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import type { FoodSafetyCertificate } from '@/lib/types'

type RescueInput = {
  foodName?: string
  quantity?: string
  createdAt?: string | Date
  matchedAt?: string | Date
  deliveredAt?: string | Date
  storageConditions?: string
  ambientTemp?: number | string
  dietaryType?: string
  allergens?: string[] | string | null
}

function getMockCertificate(rescue: RescueInput): FoodSafetyCertificate {
  const deliveredAt = rescue.deliveredAt ? new Date(rescue.deliveredAt) : new Date()
  const matchedAt = rescue.matchedAt ? new Date(rescue.matchedAt) : deliveredAt
  const createdAt = rescue.createdAt ? new Date(rescue.createdAt) : matchedAt
  const diffMs = Math.max(deliveredAt.getTime() - createdAt.getTime(), 0)
  const hours = Math.floor(diffMs / 3_600_000)
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000)
  const safetyStatus = diffMs <= 4 * 3_600_000 ? 'SAFE' : diffMs <= 6 * 3_600_000 ? 'CAUTION' : 'UNSAFE'

  return {
    safetyStatus,
    assessmentSummary: `Based on the recorded rescue timeline, ${rescue.foodName ?? 'the food'} appears ${safetyStatus.toLowerCase()} for distribution if kept under controlled conditions.`,
    timeFromCookToDelivery: `${hours} hours ${minutes} minutes`,
    safeConsumptionWindow: safetyStatus === 'UNSAFE' ? 'Do not serve; re-evaluate food safety immediately' : 'Consume within 2 hours of delivery',
    servingSuggestion: rescue.quantity ? `Suitable for approximately ${rescue.quantity}` : 'Serving estimate unavailable',
    allergenWarning: Array.isArray(rescue.allergens) ? rescue.allergens.join(', ') : rescue.allergens || null,
    fssaiNote: 'Follow FSSAI guidance for hot-food holding, hygiene, and immediate consumption after delivery.',
    certifiedBy: 'GeminiGrain AI Safety Engine (Powered by Google Gemini)',
    generatedAt: new Date().toISOString(),
  }
}

export async function POST(req: NextRequest) {
  try {
    const { rescue } = (await req.json()) as { rescue?: RescueInput }

    if (!rescue?.foodName || !rescue?.createdAt || !rescue?.deliveredAt) {
      return NextResponse.json({ success: false, error: 'Rescue data is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ success: true, data: getMockCertificate(rescue), demo: true })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const prompt = `You are a food safety assessment AI following FSSAI guidelines.
Based on the rescue data below, generate a food safety certificate.

RESCUE DATA:
- Food Item: ${rescue.foodName}
- Quantity: ${rescue.quantity ?? 'Unknown'}
- Cooked At: ${rescue.createdAt}
- Pickup Time: ${rescue.matchedAt ?? rescue.createdAt}
- Delivered At: ${rescue.deliveredAt}
- Storage Conditions: ${rescue.storageConditions ?? 'Not recorded'}
- Ambient Temperature: ${rescue.ambientTemp ?? 'Not recorded'}°C
- Dietary Type: ${rescue.dietaryType ?? 'Not recorded'}
- Allergens Noted: ${Array.isArray(rescue.allergens) ? rescue.allergens.join(', ') : rescue.allergens ?? 'None reported'}

Respond ONLY in this exact JSON format, no markdown, no extra text:
{
  "safetyStatus": "SAFE" or "CAUTION" or "UNSAFE",
  "assessmentSummary": "2-sentence human-readable verdict",
  "timeFromCookToDelivery": "X hours Y minutes",
  "safeConsumptionWindow": "Consume within X hours of delivery",
  "servingSuggestion": "Suitable for approximately N people",
  "allergenWarning": "string or null",
  "fssaiNote": "one-line FSSAI guideline reference",
  "certifiedBy": "GeminiGrain AI Safety Engine (Powered by Google Gemini)"
}`

    const result = await model.generateContent(prompt)
    const responseText = result.response.text()
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in Gemini response')

    const certificate = JSON.parse(jsonMatch[0]) as FoodSafetyCertificate
    return NextResponse.json({
      success: true,
      data: {
        ...certificate,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error('Certificate generation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate certificate' }, { status: 500 })
  }
}