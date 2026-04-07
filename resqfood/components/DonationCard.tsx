'use client'

import { Clock, Users, MapPin, CheckCircle, Truck, Brain, Leaf, AlertTriangle } from 'lucide-react'
import type { Donation } from '@/lib/types'

const URGENCY_COLOR: Record<string, string> = { CRITICAL:'#DC2626', HIGH:'#EA580C', MEDIUM:'#D97706', LOW:'#16A34A' }
const URGENCY_BG:    Record<string, string> = { CRITICAL:'#FEF2F2', HIGH:'#FFF7ED', MEDIUM:'#FFFBEB', LOW:'#F0FDF4' }
const STATUS_LABEL: Record<string, string>  = { PENDING:'Pending', MATCHED:'NGO Matched', IN_TRANSIT:'In Transit', DELIVERED:'Delivered!' }
const STATUS_BG:    Record<string, string>  = { PENDING:'#EDE9FE', MATCHED:'#FFFBEB', IN_TRANSIT:'#FFF7ED', DELIVERED:'#F0FDF4' }
const STATUS_COL:   Record<string, string>  = { PENDING:'#7C3AED', MATCHED:'#D97706', IN_TRANSIT:'#EA580C', DELIVERED:'#16A34A' }

interface Props {
  donation: Donation
  showActions?: boolean
  onAccept?: (id: string) => void
  onSkip?:   (id: string) => void
}

export default function DonationCard({ donation, showActions, onAccept, onSkip }: Props) {
  const uc = URGENCY_COLOR[donation.urgency] ?? '#16A34A'
  const ub = URGENCY_BG[donation.urgency]   ?? '#F0FDF4'

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden">
      {/* Top urgency stripe */}
      <div className="h-1 w-full" style={{ background: uc }} />

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{donation.foodName}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{donation.donorName}</p>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: ub, color: uc }}>
              {donation.urgency}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: STATUS_BG[donation.status], color: STATUS_COL[donation.status] }}>
              {STATUS_LABEL[donation.status]}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 mb-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Users className="w-3 h-3" />{donation.estimatedServings} serves
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />{donation.spoilageWindowHours}h left
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />{donation.location}
          </span>
          <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${donation.dietaryType === 'non-vegetarian' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
            <Leaf className="w-2.5 h-2.5" />
            {donation.dietaryType === 'non-vegetarian' ? 'Non-Veg' : donation.dietaryType === 'vegan' ? 'Vegan' : 'Veg'}
          </span>
        </div>

        {/* Urgency reason */}
        {donation.urgencyReason && (
          <div className="flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] mb-3"
            style={{ background: ub, color: uc }}>
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            {donation.urgencyReason.slice(0, 90)}{donation.urgencyReason.length > 90 ? '…' : ''}
          </div>
        )}

        {/* NGO match */}
        {donation.ngoMatch && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-green-50 border border-green-100 mb-3">
            <div>
              <p className="text-xs font-semibold text-gray-900">{donation.ngoMatch.name}</p>
              <p className="text-[11px] text-gray-500">{donation.ngoMatch.distance} · {donation.ngoMatch.hasVolunteer ? 'Volunteer ready' : 'No volunteer yet'}</p>
            </div>
            {donation.ngoMatch.confidence && (
              <div className="text-lg font-black text-green-600">{donation.ngoMatch.confidence}%</div>
            )}
          </div>
        )}

        {/* Delivery status (in transit / delivered) */}
        {(donation.status === 'IN_TRANSIT' || donation.status === 'DELIVERED') && donation.volunteerName && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 mb-3">
            <Truck className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-[11px] text-orange-800 font-medium">{donation.status === 'DELIVERED' ? 'Delivered by' : 'En route with'} {donation.volunteerName}</span>
            {donation.status === 'DELIVERED' && <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />}
          </div>
        )}

        {/* AI language indicator */}
        {donation.detectedLanguage && donation.detectedLanguage !== 'English' && (
          <div className="flex items-center gap-1.5 text-[10px] text-violet-600 mb-3">
            <Brain className="w-3 h-3" /> {donation.detectedLanguage} · processed by Gemini AI
          </div>
        )}

        {/* Actions */}
        {showActions && donation.status === 'PENDING' && (
          <div className="flex gap-2 pt-1">
            <button onClick={() => onSkip?.(donation.id)}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Skip
            </button>
            <button onClick={() => onAccept?.(donation.id)}
              className="flex-1 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all hover:-translate-y-0.5 shadow-sm shadow-green-600/20">
              Accept Pickup
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
