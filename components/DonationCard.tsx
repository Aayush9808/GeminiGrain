'use client'

import { cn, urgencyColor, urgencyBg, urgencyPercent, statusBg, statusLabel, expiresIn } from '@/lib/utils'
import { Clock, MapPin, Users, Leaf, Zap, CheckCircle, Truck } from 'lucide-react'
import type { Donation } from '@/lib/types'

interface Props {
  donation:   Donation
  onAccept?:  (id: string) => void
  onPickup?:  (id: string) => void
  onDeliver?: (id: string) => void
  viewAs?:    'donor' | 'ngo' | 'volunteer' | 'live'
  className?: string
  /** ID of the donation currently being actioned (shows loading state) */
  accepting?:  string | null
  actioning?:  string | null
}

export default function DonationCard({
  donation,
  onAccept,
  onPickup,
  onDeliver,
  viewAs = 'live',
  className,
  accepting,
  actioning,
}: Props) {
  const workflowSteps = [
    { key: 'PENDING', label: 'Pending' },
    { key: 'ACCEPTED_BY_NGO', label: 'Accepted by NGO' },
    { key: 'SEARCHING_VOLUNTEER', label: 'Searching for Volunteer' },
    { key: 'COMPLETED', label: 'Completed' },
  ] as const

  const statusRank: Record<string, number> = {
    PENDING: 0,
    ACCEPTED_BY_NGO: 1,
    SEARCHING_VOLUNTEER: 2,
    IN_TRANSIT: 2,
    COMPLETED: 3,
  }

  const isBusy = (accepting ?? actioning) === donation.id
  const { urgency, status } = donation
  const pct = urgencyPercent(urgency)

  return (
    <div
      className={cn(
        'relative rounded-xl border bg-white overflow-hidden transition-all duration-200 hover:border-slate-300',
        'border-slate-200',
        className,
      )}
    >
      {/* Urgency accent bar */}
      <div
        className={cn('absolute top-0 left-0 h-0.5 transition-all', {
          'bg-red-400':    urgency === 'CRITICAL',
          'bg-orange-400': urgency === 'HIGH',
          'bg-yellow-400': urgency === 'MEDIUM',
          'bg-emerald-400': urgency === 'LOW',
        })}
        style={{ width: `${pct}%` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-base leading-tight truncate">
              {donation.foodName}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">{donation.donorName}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', statusBg(status))}>
              {statusLabel(status)}
            </span>
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', urgencyBg(urgency))}>
              {urgency}
            </span>
          </div>
        </div>

        {/* Meta grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>{donation.quantity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{donation.location}</span>
          </div>
          <div className={cn('flex items-center gap-1.5 text-xs font-medium', urgencyColor(urgency))}>
            <Clock className="w-3.5 h-3.5" />
            <span>{expiresIn(donation.createdAt, donation.spoilageWindowHours)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Leaf className="w-3.5 h-3.5 text-slate-500" />
            <span className="capitalize">{donation.dietaryType}</span>
          </div>
        </div>

        {/* NGO match info */}
        {donation.ngoMatch && (
          <div className="mb-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Matched NGO</span>
              <span className="text-slate-700 font-medium">{donation.ngoMatch.confidence}% match</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-slate-900 font-medium">{donation.ngoMatch.name}</span>
              <span className="text-xs text-slate-500">{donation.ngoMatch.distance}</span>
            </div>
          </div>
        )}

        {/* Volunteer info */}
        {donation.volunteerName && (
          <div className="mb-3 text-xs text-slate-600 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-orange-600" />
            Volunteer: <span className="text-slate-900">{donation.volunteerName}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-1">
          {viewAs === 'ngo' && status === 'PENDING' && onAccept && (
            <button
              onClick={() => !isBusy && onAccept(donation.id)}
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              {isBusy ? 'Accepting…' : 'Accept Pickup'}
            </button>
          )}
          {viewAs === 'volunteer' && status === 'SEARCHING_VOLUNTEER' && onPickup && (
            <button
              onClick={() => !isBusy && onPickup(donation.id)}
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              <Truck className="w-4 h-4" />
              {isBusy ? 'Updating…' : 'Start Pickup'}
            </button>
          )}
          {viewAs === 'volunteer' && status === 'IN_TRANSIT' && onDeliver && (
            <button
              onClick={() => !isBusy && onDeliver(donation.id)}
              disabled={isBusy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-white text-sm font-medium transition-colors"
            >
              <Zap className="w-4 h-4" />
              {isBusy ? 'Delivering…' : 'Mark Delivered'}
            </button>
          )}
        </div>

        {/* Step tracker visible on dashboards for trust and transparency */}
        {(viewAs === 'donor' || viewAs === 'live') && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-2 gap-2">
            {workflowSteps.map((step) => {
              const done = statusRank[status] >= statusRank[step.key]
              return (
                <div key={step.key} className="flex items-center gap-1.5 text-[11px]">
                  <span className={cn('w-2 h-2 rounded-full', done ? 'bg-emerald-500' : 'bg-slate-300')} />
                  <span className={done ? 'text-slate-800 font-medium' : 'text-slate-500'}>{step.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delivered overlay */}
      {status === 'COMPLETED' && (
        <div className="absolute top-3 right-3">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
        </div>
      )}
    </div>
  )
}
