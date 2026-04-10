import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import type { GeminiAnalysis } from '@/lib/types'

// ─── Mock response for demo when no API key is configured ────────────────────

function getMockAnalysis(text: string): GeminiAnalysis {
  const isHindi        = /[अ-ह]/.test(text) || /\b(hai|ka|ke|ko|lo|lao|wala)\b/i.test(text)
  const hasChicken     = /chicken|murgh|non[ -]?veg/i.test(text)
  const quantityMatch  = text.match(/(\d+)\s*(plate|log|person|kg|kilo)/i)
  const qty            = quantityMatch ? parseInt(quantityMatch[1]) : 30
  const isUrgent       = /jaldi|urgent|abhi|asap|quickly|fast/i.test(text)

  return {
    foodName:          hasChicken ? 'Chicken Curry' : isHindi ? 'Biryani' : 'Mixed Curry + Rice',
    quantity:          `${qty} plates (~${Math.round(qty * 0.25)} kg)`,
    estimatedServings: qty,
    dietaryType:       hasChicken ? 'non-vegetarian' : 'vegetarian',
    urgencyLevel:      isUrgent ? 'HIGH' : 'MEDIUM',
    spoilageWindowHours: isUrgent ? 3 : 6,
    urgencyReason:     isUrgent
      ? 'Hot food with no cold storage available'
      : 'Freshly cooked; safe for 6 hours',
    allergenFlags:     hasChicken ? ['poultry'] : ['dairy'],
    locationHint:      '',
    recommendedAction: `Dispatch volunteer immediately. Match with nearest NGO that accepts ${hasChicken ? 'non-vegetarian' : 'vegetarian'} food.`,
    confidence:        82,
    detectedLanguage:  isHindi ? 'Hindi' : 'English',
  }
}

// ─── POST /api/gemini/analyze ────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { text } = (await req.json()) as { text: string }

    if (!text?.trim()) {
      return NextResponse.json({ success: false, error: 'Input text is required' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    const isDemoMode = !apiKey || apiKey === 'your_gemini_api_key_here'

    if (isDemoMode) {
      // Simulate processing delay for realistic feel
      await new Promise((r) => setTimeout(r, 1500))
      return NextResponse.json({ success: true, data: getMockAnalysis(text), demo: true })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are GeminiGrain AI — a food rescue coordination system for India. Analyze the food donation message below and return ONLY a valid JSON object with no markdown.

Message: "${text}"

Return ONLY this JSON (no explanation, no markdown fences):
{
  "foodName": "detected food item name in English",
  "quantity": "quantity with units e.g. '30 plates (~8 kg)'",
  "estimatedServings": <integer number of people who can be fed>,
  "dietaryType": "vegetarian" | "non-vegetarian" | "vegan",
  "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "spoilageWindowHours": <integer hours before food becomes unsafe>,
  "urgencyReason": "one sentence explanation of urgency",
  "allergenFlags": ["array", "of", "allergens"],
  "locationHint": "any location mentioned or empty string",
  "recommendedAction": "short action description for volunteer",
  "confidence": <integer 0-100>,
  "detectedLanguage": "language name e.g. Hindi or English"
}`

    const result      = await model.generateContent(prompt)
    const responseText = result.response.text()

    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in Gemini response')

    const analysis: GeminiAnalysis = JSON.parse(jsonMatch[0])
    return NextResponse.json({ success: true, data: analysis })
  } catch (err) {
    console.error('Gemini analyze error:', err)
    return NextResponse.json({ success: false, error: 'Analysis failed' }, { status: 500 })
  }
}
