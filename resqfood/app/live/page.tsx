'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, CheckCircle, Zap, Users, Clock, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation, ImpactStats } from '@/lib/types'

const STATUS_TABS = ['ALL', 'PENDING', 'MATCHED', 'IN_TRANSIT', 'DELIVERED'] as const
type StatusTab = typeof STATUS_TABS[number]

const STAT_LABELS: Record<string, string> = {
  ALL: 'Total', PENDING: 'Pending', MATCHED: 'Matched', IN_TRANSIT: 'In Transit', DELIVERED: 'Delivered',
}

function LiveClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', second:'2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-xs text-gray-400 tabular-nums">{t}</span>
}

export default function LiveFeed() {
  const [allDonations, setAll]  = useState<Donation[]>([])
  const [stats, setStats]       = useState<ImpactStats | null>(null)
  const [tab, setTab]           = useState<StatusTab>('ALL')
  const [loading, setLoading]   = useState(true)

  const fetchAll = useCallback(async () => {
    try {
      const [dRes, sRes] = await Promise.all([fetch('/api/donations'), fetch('/api/impact')])
      const dData = await dRes.json()
      const sData = await sRes.json()
      if (dData.success) setAll(dData.data as Donation[])
      if (sData.success) setStats(sData.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
    const id = setInterval(fetchAll, 5000)
    return () => clearInterval(id)
  }, [fetchAll])

  const filtered = allDonations.filter(d => tab === 'ALL' || d.status === tab)

  const impactCards = stats ? [
    { icon: Activity,      label: 'Total',        value: stats.totalDonations,  color: 'text-violet-600', bg: 'bg-violet-50' },
    { icon: Users,         label: 'Meals Rescued', value: stats.mealsRescued,   color: 'text-green-600',  bg: 'bg-green-50' },
    { icon: Zap,           label: 'Active Now',    value: stats.activeDonations, color: 'text-orange-600', bg: 'bg-orange-50' },
    { icon: CheckCircle,   label: 'Delivered',     value: stats.deliveredToday, color: 'text-blue-600',   bg: 'bg-blue-50' },
  ] : []

  return (
    <div className="min-h-screen bg-rq-bg">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pt-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <h1 className="text-2xl font-black text-gray-900">Live Feed</h1>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Clock className="w-3.5 h-3.5" />
              <span>Updates every 5 seconds</span>
              <span className="mx-1">·</span>
              <LiveClock />
            </div>
          </div>
          <button onClick={fetchAll}
            className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            Refresh
          </button>
        </div>

        {/* Impact stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {impactCards.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5">
                <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div className="text-xl font-black text-gray-900">{value.toLocaleString()}</div>
                <div className="text-[11px] text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status tabs */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {STATUS_TABS.map(t => {
            const count = t === 'ALL' ? allDonations.length : allDonations.filter(d => d.status === t).length
            return (
              <button key={t} onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  tab === t
                    ? 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-600/20'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                {STAT_LABELS[t]}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Donations */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No donations in this category</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map(d => (
                <motion.div key={d.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                  <DonationCard donation={d} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
