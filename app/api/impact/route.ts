import { NextResponse } from 'next/server'
import { getImpactStats } from '@/lib/store'

export async function GET() {
  const stats = getImpactStats()
  return NextResponse.json({ success: true, data: stats })
}
