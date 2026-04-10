'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, CheckCircle, Zap, Users, BarChart3, Clock, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation, ImpactStats } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_FILTERS = [
  { id: 'all',        label: 'All Live',    color: 'emerald' },
  { id: 'PENDING',    label: 'Pending',     color: 'violet'  },
  { id: 'ACCEPTED_BY_NGO', label: 'Accepted by NGO', color: 'blue'   },
  { id: 'SEARCHING_VOLUNTEER', label: 'Searching Volunteer', color: 'amber'   },
  { id: 'IN_TRANSIT', label: 'In Transit',  color: 'orange'  },
  { id: 'COMPLETED',  label: 'Completed',   color: 'emerald' },
]

function useLiveClock() {
  const [t, setT] = useState(new Date())
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id) }, [])
  return t.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', second: '2-digit' })
}

function StatCard({ icon: Icon, label, value, pulse }: {
  icon: React.ElementType; label: string; value: string | number; pulse?: boolean
}) {
  return (
    <div className="p-4 rounded-xl border bg-white border-slate-200 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        {pulse && <span className="absolute w-3 h-3 rounded-full bg-slate-500 animate-ping opacity-60" />}
        <Icon className="w-5 h-5 text-slate-700" />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-900">{value}</div>
        <div className="text-xs text-slate-600">{label}</div>
      </div>
    </div>
  )
}

export default function LiveView() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats,     setStats]     = useState<ImpactStats | null>(null)
  const [filter,    setFilter]    = useState('all')
  const [loading,   setLoading]   = useState(true)
  const [lastPing,  setLastPing]  = useState(0)
  const clock = useLiveClock()

  const fetchAll = useCallback(async () => {
    try {
      const [donRes, statRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/impact'),
      ])
      const [donData, statData] = await Promise.all([donRes.json(), statRes.json()])
      if (donData.success)  setDonations(donData.data)
      if (statData.success) setStats(statData.data)
      setLastPing(Date.now())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 3000)
    return () => clearInterval(id)
  }, [fetchAll])

  const displayed = filter === 'all'
    ? donations
    : donations.filter((d) => d.status === filter)

  // CRITICAL first
  const urgencyOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const sorted = [...displayed].sort(
    (a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  )

  const activeCount = donations.filter((d) => d.status !== 'COMPLETED').length

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        {/* Live header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-slate-700 text-xs font-semibold uppercase tracking-wider">Live</span>
              </span>
              <span className="text-slate-600 text-sm font-mono">{clock}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Real-Time Rescue Feed</h1>
            <p className="text-slate-600 text-sm mt-1">
              {activeCount} active rescue{activeCount !== 1 ? 's' : ''} · refreshes every 3 seconds
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-700">
            <Activity className="w-3.5 h-3.5" />
            {lastPing > 0 && (
              <span className="text-slate-600">
                Updated {Math.round((Date.now() - lastPing) / 1000)}s ago
              </span>
            )}
          </div>
        </div>

        {/* Impact stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <StatCard icon={Users}       label="Meals Rescued"    value={stats.mealsRescued.toLocaleString()} pulse />
            <StatCard icon={Activity}    label="Active Rescues"   value={activeCount} pulse />
            <StatCard icon={CheckCircle} label="Delivered Today"  value={stats.deliveredToday} />
            <StatCard icon={BarChart3}   label="CO₂ Offset (kg)"  value={Math.round(stats.co2AvoidedKg)} />
          </div>
        )}

        {/* Progress bar — active / total */}
        {stats && stats.totalDonations > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white">
            <div className="flex justify-between text-xs text-slate-600 mb-2">
              <span>Today&apos;s rescue progress</span>
              <span>{stats.deliveredToday} / {stats.totalDonations} donations completed</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-slate-700 to-slate-500"
                initial={{ width: 0 }}
                animate={{ width: `${(stats.deliveredToday / stats.totalDonations) * 100}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map(({ id, label }) => {
            const count = id === 'all' ? donations.length : donations.filter((d) => d.status === id).length
            return (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                  filter === id
                    ? 'bg-slate-200 border-slate-300 text-slate-900'
                    : 'bg-transparent border-slate-300 text-slate-600 hover:text-slate-900',
                )}
              >
                {label} {count > 0 && <span className="ml-1 opacity-60">({count})</span>}
              </button>
            )
          })}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="w-10 h-10 text-rq-muted mx-auto mb-3" />
            <p className="text-slate-600">No donations in this category</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="grid md:grid-cols-2 gap-4">
              {sorted.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                >
                  <DonationCard donation={donation} viewAs="live" />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}

        {/* Bottom Gemini banner */}
        <div className="mt-12 p-5 rounded-2xl border border-slate-200 bg-white flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <p className="text-sm text-slate-900 font-medium">Powered by Google Gemini 1.5 Flash</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Every donation above was processed by Gemini AI — extracting urgency, matching NGOs, and coordinating volunteers in real time.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
