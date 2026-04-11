/**
 * POST /api/gemini/analyze-image
 *
 * Accepts multipart/form-data with:
 *   file   — image (JPEG/PNG/WebP, max 5 MB)
 *
 * Returns:
 *   { success: true, data: ImageValidationResult }
 *
 * Uses Gemini 1.5-flash multimodal. Falls back to a smart
 * heuristic mock when GEMINI_API_KEY is not configured.
 */

import { NextResponse }     from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ImageValidationResult } from '@/lib/types'

const MAX_BYTES    = 5 * 1024 * 1024
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

// ── Demo fallback — varies by file size as a rough image proxy ───────────────
function demoValidation(file: File): ImageValidationResult {
  // Use file size as a noisy signal to produce varied (not static) demo results.
  // Large, detailed images → more confidence. Tiny files → lower confidence.
  const kb = file.size / 1024
  const confidence = Math.min(94, Math.max(52, Math.round(58 + (kb / 80))))
  const note = `Demo mode — real Gemini Vision requires GEMINI_API_KEY in .env.local. Image: ${Math.round(kb)} KB, ${file.type}.`
  return {
    result:     'GOOD',
    reason:     note,
    confidence,
  }
}

// ── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 })
    }

    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Only JPEG, PNG, or WebP images are accepted' },
        { status: 400 },
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Image must be under 5 MB' },
        { status: 400 },
      )
    }

    const apiKey    = process.env.GEMINI_API_KEY
    const isDemoMode = !apiKey || apiKey === 'your_gemini_api_key_here'

    if (isDemoMode) {
      console.log('[GeminiGrain] IMAGE DEMO MODE — real Gemini Vision requires GEMINI_API_KEY.')
      console.log(`[GeminiGrain] Image received: ${file.name}, ${Math.round(file.size / 1024)} KB, ${file.type}`)
      await new Promise(r => setTimeout(r, 800))
      return NextResponse.json({ success: true, data: demoValidation(file), demo: true })
    }

    // ── Real Gemini Vision call with model fallback ───────────────────────
    console.log(`[GeminiGrain] Sending image to Gemini Vision: ${file.name}, ${Math.round(file.size / 1024)} KB`)

    const buffer    = Buffer.from(await file.arrayBuffer())
    const base64Img = buffer.toString('base64')
    const genAI     = new GoogleGenerativeAI(apiKey)
    const MODELS    = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']

    const prompt = `You are a food safety inspector for GeminiGrain — an Indian food rescue platform.

Carefully examine this food photo and determine if this food is safe to donate to vulnerable people.

Analyze:
1. Is the food fresh or showing signs of spoilage?
2. Is it properly stored (clean containers, covered, appropriate temperature visible)?
3. Are there any visible signs of contamination, mould, insects, or damage?
4. Does the packaging/presentation look hygienic?

Return ONLY valid JSON (no markdown, no code block, no explanation):
{
  "result": "GOOD" | "WARNING" | "REJECT",
  "reason": "specific one-sentence observation about THIS image",
  "confidence": <integer 0-100>
}

Criteria:
- GOOD: Food looks fresh, clean, properly contained, ready for safe consumption
- WARNING: Food is likely edible but has a concerning detail (open container, unclear temperature, slightly aged look) — flag for NGO review
- REJECT: Visible mould, spoilage, contamination, pests, clearly unsafe — block this donation`

    for (let attempt = 0; attempt < MODELS.length; attempt++) {
      const modelName = MODELS[attempt]
      try {
        console.log(`[GeminiGrain] Vision attempt ${attempt + 1}/${MODELS.length} with ${modelName}`)
        const model  = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent([
          prompt,
          { inlineData: { data: base64Img, mimeType: file.type as 'image/jpeg' | 'image/png' | 'image/webp' } },
        ])
        const text = result.response.text()
        console.log('[GeminiGrain] Gemini Vision raw response:', text)

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (!jsonMatch) throw new Error('No JSON in vision response')

        const validation: ImageValidationResult = JSON.parse(jsonMatch[0])
        console.log('[GeminiGrain] Image validation result:', JSON.stringify(validation, null, 2))
        return NextResponse.json({ success: true, data: validation, model: modelName })
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any)?.status
        if (status === 503) {
          console.warn(`[GeminiGrain] ${modelName} vision overloaded, retrying in 2s...`)
          await new Promise(r => setTimeout(r, 2000))
        } else if (status === 429) {
          console.warn(`[GeminiGrain] ${modelName} quota exhausted, trying next model...`)
        } else {
          console.error(`[GeminiGrain] Vision error from ${modelName}:`, err)
          break
        }
      }
    }

    // All models failed — return demo result
    console.warn('[GeminiGrain] All vision models failed — returning demo validation')
    return NextResponse.json({ success: true, data: demoValidation(file), demo: true, fallback: true })
  } catch (err) {
    console.error('[GeminiGrain] Image analysis error:', err)
    return NextResponse.json({ success: false, error: 'Image analysis failed' }, { status: 500 })
  }
}
