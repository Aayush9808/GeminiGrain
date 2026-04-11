import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import type { GeminiAnalysis, NGOProfile, RankedNGO } from '@/lib/types'
import { NGO_REGISTRY } from '@/lib/store'

// ─── NGO scoring fallback (no Gemini key needed) ─────────────────────────────
function rankNGOs(ngos: NGOProfile[], analysis: GeminiAnalysis): RankedNGO[] {
  return ngos
    .map(ngo => {
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
          ? `Dietary match ✓. ${ngo.hasVolunteer ? 'Internal volunteer available.' : 'Needs platform volunteer.'} ${ngo.distanceKm} km away.`
          : `Does not accept ${analysis.dietaryType} — low priority.`,
      }
    })
    .sort((a, b) => b.confidence - a.confidence)
    .map((ngo, i) => ({ ...ngo, rank: i + 1 }))
}

// ─── Demo-mode parser: extracts real food names from text (no API key needed) ─

// Maps keywords → canonical food names
const FOOD_MAP: Record<string, string> = {
  biryani: 'Biryani', pulao: 'Pulao', rice: 'Rice', chawal: 'Rice (Chawal)',
  roti: 'Roti', chapati: 'Chapati', naan: 'Naan',
  dal: 'Dal', daal: 'Dal', rajma: 'Rajma', chole: 'Chole', chana: 'Chane',
  paneer: 'Paneer Curry', palak: 'Palak Sabzi', aloo: 'Aloo Sabzi',
  sabzi: 'Mixed Sabzi', khichdi: 'Khichdi', idli: 'Idli', dosa: 'Dosa',
  sambar: 'Sambar', poha: 'Poha', upma: 'Upma',
  kheer: 'Kheer', halwa: 'Halwa', mithai: 'Mithai', sweet: 'Sweets',
  chicken: 'Chicken Curry', murgh: 'Murgh Curry', mutton: 'Mutton Curry',
  gosht: 'Gosht Curry', fish: 'Fish Curry', egg: 'Egg Curry', anda: 'Anda Curry',
  kebab: 'Kebab', seekh: 'Seekh Kebab', tikka: 'Tikka',
  curry: 'Mixed Curry', sabz: 'Mixed Sabzi', food: 'Mixed Food',
  khana: 'Mixed Food (Khana)', meal: 'Mixed Meal',
}

const NON_VEG_KEYS  = new Set(['chicken','murgh','mutton','gosht','fish','egg','anda','kebab','seekh','tikka','meat'])
const SWEET_KEYS    = new Set(['kheer','halwa','mithai','sweet','dessert'])
const URGENT_KEYS   = /jaldi|urgent|abhi|asap|fast|quickly|turat|foran/i
const LOCATION_RE   = /(?:at|in|from|near|sector|block|colony|area|village)\s+([A-Za-z0-9 ,]+?)(?:[,.]|$)/i

function getDemoAnalysis(text: string): GeminiAnalysis {
  const lower = text.toLowerCase()
  const words = lower.split(/\W+/)

  // Detect language
  const isHindi = /[अ-ह]/.test(text) || /\b(hai|ka|ke|ko|mein|se|ho|hain|wala|aur|bhi)\b/i.test(text)

  // Extract food names from the actual text
  const matchedFoods: string[] = []
  for (const word of words) {
    if (FOOD_MAP[word]) matchedFoods.push(FOOD_MAP[word])
  }
  // Also check multi-word compound keys (e.g. "chicken pulao")
  if (/chicken\s+pulao/i.test(text)) matchedFoods.unshift('Chicken Pulao')
  if (/veg\s+biryani/i.test(text))   matchedFoods.unshift('Veg Biryani')
  if (/egg\s+rice/i.test(text))      matchedFoods.unshift('Egg Rice')
  if (/dal\s+(?:makhani|tadka)/i.test(text)) matchedFoods.unshift('Dal Makhani')
  if (/paneer\s+(?:butter masala|tikka|curry)/i.test(text)) matchedFoods.unshift('Paneer Butter Masala')

  // Build final food name from unique matches (deduplicate)
  const uniqueFoods = [...new Set(matchedFoods)].slice(0, 3)
  const foodName = uniqueFoods.length
    ? uniqueFoods.join(' + ')
    : (isHindi ? 'Mixed Food' : 'Mixed Meal') // only use generic if ZERO keywords matched

  // Dietary type from matched keywords
  const isNonVeg = words.some(w => NON_VEG_KEYS.has(w))
  const isSweet  = words.some(w => SWEET_KEYS.has(w))

  // Quantity extraction — look for number + unit
  const qtyMatch = text.match(/(\d[\d,]*)\s*(plate[s]?|kg|kilo(?:gram)?[s]?|packet[s]?|box(?:es)?|bowl[s]?|log|piece[s]?|person[s]?|people|serving[s]?|portion[s]?)/i)
  let qty = 30, qtyUnit = 'plates'
  if (qtyMatch) {
    qty = parseInt(qtyMatch[1].replace(',', ''))
    qtyUnit = qtyMatch[2].toLowerCase().startsWith('kg') || qtyMatch[2].toLowerCase().startsWith('kilo')
      ? 'kg' : 'plates'
  }
  const quantity     = qtyUnit === 'kg' ? `~${qty} kg` : `${qty} plates (~${Math.round(qty * 0.25)} kg)`
  const servings     = qtyUnit === 'kg' ? Math.round(qty * 4) : qty

  // Urgency
  const isUrgent = URGENT_KEYS.test(text)
  const hasExpiry = /expir|2\s*hour|1\s*hour|abhi|now\b/i.test(text)
  const urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' =
    hasExpiry ? 'CRITICAL' : isUrgent ? 'HIGH' : 'MEDIUM'
  const spoilageWindowHours = { CRITICAL: 2, HIGH: 3, MEDIUM: 6, LOW: 10 }[urgencyLevel]

  // Location hint
  const locMatch = LOCATION_RE.exec(text)
  const locationHint = locMatch ? locMatch[1].trim() : ''

  // Allergens
  const allergenFlags: string[] = []
  if (isNonVeg) allergenFlags.push(words.some(w => w === 'fish') ? 'fish' : words.some(w => w === 'egg' || w === 'anda') ? 'eggs' : 'poultry')
  if (/milk|cream|paneer|dairy|ghee|dahi/i.test(text)) allergenFlags.push('dairy')
  if (/nut|mewa|kaju|badam|peanut/i.test(text)) allergenFlags.push('nuts')
  if (allergenFlags.length === 0) allergenFlags.push('none detected')

  return {
    foodName,
    quantity,
    estimatedServings: servings,
    dietaryType:       isNonVeg ? 'non-vegetarian' : isSweet ? 'vegetarian' : 'vegetarian',
    urgencyLevel,
    spoilageWindowHours,
    urgencyReason:     isUrgent || hasExpiry
      ? `${foodName} spoils rapidly — dispatch within the hour`
      : `Freshly prepared ${foodName}; safe for approximately ${spoilageWindowHours} hours`,
    allergenFlags,
    locationHint,
    recommendedAction: `Dispatch to nearest NGO accepting ${isNonVeg ? 'non-vegetarian' : 'vegetarian'} food. ${qty} ${qtyUnit} ready for ${servings} people.`,
    confidence:        uniqueFoods.length ? Math.min(92, 70 + uniqueFoods.length * 7) : 55,
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
      console.log('[GeminiGrain] DEMO MODE — no GEMINI_API_KEY in .env.local. Using local text parser.')
      console.log('[GeminiGrain] Input text:', text)
      await new Promise((r) => setTimeout(r, 1200))
      const analysis = getDemoAnalysis(text)
      console.log('[GeminiGrain] Demo analysis result:', JSON.stringify(analysis, null, 2))
      const rankedNGOs = rankNGOs(NGO_REGISTRY, analysis)
      return NextResponse.json({ success: true, data: analysis, rankedNGOs, demo: true })
    }

    // ── Real Gemini call with retry + model fallback ───────────────────────
    console.log('[GeminiGrain] Calling Gemini API for text analysis...')
    console.log('[GeminiGrain] Input:', text)

    const MODELS   = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']
    const MAX_TRIES = 3
    const genAI    = new GoogleGenerativeAI(apiKey)

    const prompt = `You are GeminiGrain AI — a food rescue coordinator for India. Analyze the text below and return ONLY valid JSON. No markdown, no code fences, no explanation.

Donor message: "${text}"

Extract the EXACT food items mentioned. Do not guess or substitute generic names.

Return this exact JSON structure:
{
  "foodName": "exact food name extracted from the message (e.g. 'Paneer Curry + Dal' not 'Mixed Food')",
  "quantity": "quantity string with units e.g. '30 plates (~8 kg)' or '15 kg'",
  "estimatedServings": <integer: number of people this feeds>,
  "dietaryType": "vegetarian" | "non-vegetarian" | "vegan",
  "urgencyLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "spoilageWindowHours": <integer: realistic hours before this specific food becomes unsafe>,
  "urgencyReason": "one sentence — why this food is urgent or safe based on its type and context",
  "allergenFlags": ["list", "of", "allergens"],
  "locationHint": "any location mentioned, or empty string",
  "recommendedAction": "specific action for volunteer — include food name and quantity",
  "confidence": <integer 0-100: how confident you are in the extraction>,
  "detectedLanguage": "Hindi" | "English" | "Mix"
}`

    let lastErr: unknown
    for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
      const modelName = MODELS[Math.min(attempt, MODELS.length - 1)]
      try {
        console.log(`[GeminiGrain] Attempt ${attempt + 1}/${MAX_TRIES} with model: ${modelName}`)
        const model      = genAI.getGenerativeModel({ model: modelName })
        const result     = await model.generateContent(prompt)
        const responseText = result.response.text()
        console.log('[GeminiGrain] Gemini raw response:', responseText)

        const jsonMatch = responseText.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('No JSON in Gemini response')

        const analysis: GeminiAnalysis = JSON.parse(jsonMatch[0])
        console.log('[GeminiGrain] Parsed analysis:', JSON.stringify(analysis, null, 2))

        const rankedNGOs = rankNGOs(NGO_REGISTRY, analysis)
        return NextResponse.json({ success: true, data: analysis, rankedNGOs, model: modelName })
      } catch (err) {
        lastErr = err
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any)?.status
        if (status === 503) {
          // Overloaded — short wait then retry with next model
          console.warn(`[GeminiGrain] ${modelName} overloaded (503), retrying in 2s...`)
          await new Promise(r => setTimeout(r, 2000))
        } else if (status === 429) {
          // Quota exhausted for this model — try next immediately
          console.warn(`[GeminiGrain] ${modelName} quota exhausted (429), trying next model...`)
        } else {
          // Other error — break immediately
          console.error(`[GeminiGrain] Unexpected error from ${modelName}:`, err)
          break
        }
      }
    }

    // All Gemini attempts failed — fall back to smart demo parser
    console.warn('[GeminiGrain] All Gemini models failed — falling back to local text parser. Error:', lastErr)
    const analysis = getDemoAnalysis(text)
    const rankedNGOs = rankNGOs(NGO_REGISTRY, analysis)
    return NextResponse.json({ success: true, data: analysis, rankedNGOs, demo: true, fallback: true })
  } catch (err) {
    console.error('[GeminiGrain] Gemini analyze error:', err)
    return NextResponse.json({ success: false, error: 'Analysis failed. Check server logs.' }, { status: 500 })
  }
}
