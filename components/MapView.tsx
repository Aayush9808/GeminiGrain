'use client'

/**
 * MapView — SSR-safe wrapper around DonationMap.
 * Use this in all dashboard pages.
 */

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Donation } from '@/lib/types'
import { DEMO_COORDS } from '@/lib/mapConstants'

const DonationMap = dynamic(() => import('./DonationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 text-sm animate-pulse">
      Loading map…
    </div>
  ),
})

interface MapViewProps {
  viewAs: 'donor' | 'ngo' | 'volunteer'
  donations?: Donation[]
  defaultOpen?: boolean
}

export default function MapView({ viewAs, donations = [], defaultOpen = false }: MapViewProps) {
  const [open,        setOpen]        = useState(defaultOpen)
  const [selectedNgo, setSelectedNgo] = useState(0)
  const [showNeedy,   setShowNeedy]   = useState(viewAs === 'ngo')  // ON by default for NGO

  const titles = {
    donor:     '🗺️ Nearby NGOs & Delivery Zones',
    ngo:       '🗺️ Live Donation Map',
    volunteer: '🗺️ Pickup Route',
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-800">{titles[viewAs]}</span>
        <div className="flex items-center gap-2">
          {viewAs === 'donor' && (
            <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
              3 NGOs nearby
            </span>
          )}
          {viewAs === 'ngo' && (
            <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
              {donations.length || 3} pickups
            </span>
          )}
          {viewAs === 'ngo' && (
            <span className="text-xs text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-2 py-0.5">
              5 need zones
            </span>
          )}
          {viewAs === 'volunteer' && (
            <span className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">
              Live route
            </span>
          )}
          <span className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </div>
      </button>

      {/* Map panel */}
      {open && (
        <div className="px-4 pb-4">
          {/* Layer toggles */}
          {(viewAs === 'donor' || viewAs === 'ngo') && (
            <div className="flex items-center justify-end gap-2 mb-2">
              <button
                onClick={() => setShowNeedy(s => !s)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  showNeedy
                    ? 'bg-violet-100 text-violet-800 border-violet-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                🏠 {showNeedy ? 'Hide' : 'Show'} Need Zones
              </button>
            </div>
          )}
          <DonationMap
            viewAs={viewAs}
            donations={donations}
            donorCoords={DEMO_COORDS.donor}
            selectedNgo={selectedNgo}
            onNgoSelect={setSelectedNgo}
            showNeedyZones={showNeedy}
          />
          <p className="mt-2 text-xs text-slate-400 text-center">
            Map data © OpenStreetMap contributors · Routing by OSRM
          </p>
        </div>
      )}
    </div>
  )
}
