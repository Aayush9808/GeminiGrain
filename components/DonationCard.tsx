'use client'

import { cn, urgencyColor, urgencyBg, urgencyPercent, statusBg, statusLabel, expiresIn } from '@/lib/utils'
import { Clock, MapPin, Users, Leaf, Zap, CheckCircle, Truck, Flag, AlertTriangle, ShieldCheck, Timer } from 'lucide-react'
import type { Donation } from '@/lib/types'

interface Props {
  donation:     Donation
  onAccept?:    (id: string) => void
  onPickup?:    (id: string) => void
  onDeliver?:   (id: string) => void
  onComplaint?: (id: string) => void
  viewAs?:      'donor' | 'ngo' | 'volunteer' | 'live'
  className?:   string
  /** ID of the donation currently being actioned (shows loading state) */
  accepting?:  string | null
  actioning?:  string | null
}

export default function DonationCard({
  donation,
  onAccept,
  onPickup,
  onDeliver,
  onComplaint,
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

      {/* ── Risk flag / image validation (NGO view) ── */}
      {viewAs === 'ngo' && (donation.riskFlag || donation.imagePath) && (
        <div className="px-4 pt-4 pb-0">
          {donation.riskFlag && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 mb-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span><strong>Risk flag:</strong> {donation.riskFlag}</span>
            </div>
          )}
          {donation.imagePath && (
            <div className="flex items-center gap-2 mb-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={donation.imagePath} alt="Food" className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
              <div className="text-xs text-slate-500">
                Donor photo
                {donation.imageValidation && (
                  <span className={cn(
                    'ml-1.5 px-1.5 py-0.5 rounded-full border font-medium',
                    donation.imageValidation.result === 'GOOD'    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    donation.imageValidation.result === 'WARNING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                                    'bg-red-50 text-red-700 border-red-200',
                  )}>
                    {donation.imageValidation.result === 'GOOD' ? '✅' : donation.imageValidation.result === 'WARNING' ? '⚠️' : '⛔'} AI Vision
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Safety consent badge (any view) */}
      {donation.consentGiven && viewAs !== 'live' && (
        <div className={cn(
          'px-4 flex items-center gap-1.5 text-[11px] text-emerald-700',
          (viewAs === 'ngo' && (donation.riskFlag || donation.imagePath)) ? 'pt-2 pb-0' : 'pt-4 pb-0',
        )}>
          <ShieldCheck className="w-3 h-3" />
          Donor confirmed food safety consent
          {donation.preparedMinutesAgo !== undefined && (
            <span className="ml-2 flex items-center gap-1 text-slate-500">
              <Timer className="w-3 h-3" />Prepared {donation.preparedMinutesAgo} min ago
            </span>
          )}
        </div>
      )}

      <div className="p-4 pt-2">
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
          {viewAs === 'ngo' && status === 'COMPLETED' && onComplaint && (
            <button
              onClick={() => onComplaint(donation.id)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-medium transition-colors ml-auto"
            >
              <Flag className="w-3.5 h-3.5" />
              Report Issue
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
