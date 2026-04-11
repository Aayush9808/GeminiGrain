'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Leaf, Users, Clock, CheckCircle, Zap, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import MapView from '@/components/MapView'
import type { Donation, ImpactStats } from '@/lib/types'

export default function DonorDashboard() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats,     setStats]     = useState<ImpactStats | null>(null)
  const [loading,   setLoading]   = useState(true)
  const [name,      setName]      = useState('Donor')
  const [verified,  setVerified]  = useState(false)
  const [donorId,   setDonorId]   = useState('')
  const [showInstructions, setShowInstructions] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const donorQuery = donorId ? `?donorId=${encodeURIComponent(donorId)}` : ''
      const [dRes, sRes] = await Promise.all([
        fetch(`/api/donations${donorQuery}`),
        fetch('/api/impact'),
      ])
      const dData = await dRes.json()
      const sData = await sRes.json()
      if (dData.success) setDonations(dData.data)
      if (sData.success) setStats(sData.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [donorId])

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const user = localStorage.getItem('rq_user')
    const n    = localStorage.getItem('rq_name')
    
    if (role !== 'donor') { 
      router.push('/login')
      return 
    }
    
    // Check if user has completed profile
    if (!user) {
      router.push('/login')
      return
    }
    
    try {
      const userData = JSON.parse(user)
      if (!userData.verified) {
        router.push('/login')
        return
      }
      setVerified(true)
      if (userData.id) setDonorId(userData.id)

      const seenInstructions = sessionStorage.getItem('rq_donor_instructions_seen')
      if (!seenInstructions) {
        setShowInstructions(true)
        sessionStorage.setItem('rq_donor_instructions_seen', 'true')
      }
    } catch {
      router.push('/login')
      return
    }
    
    if (n) setName(n)
    fetchData()
    const id = setInterval(fetchData, 5000)
    return () => clearInterval(id)
  }, [router, fetchData])

  const statCards = [
    { label: 'Total Donations',  value: stats?.totalDonations ?? 0, icon: Zap,         color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Meals Rescued',    value: stats?.mealsRescued  ?? 0, icon: Users,        color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'CO₂ Saved (kg)',   value: stats?.co2AvoidedKg  ?? 0, icon: Leaf,         color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'Delivered Today',  value: stats?.deliveredToday ?? 0, icon: CheckCircle, color: 'text-slate-700', bg: 'bg-slate-100' },
  ]

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-28 pb-16">
        {showInstructions && (
          <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="w-full max-w-xl rounded-2xl border border-amber-200 bg-white shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-bold text-slate-900">Food Donation Safety Instructions</h2>
              </div>
              <ul className="text-sm text-slate-700 space-y-2 mb-5 list-disc pl-5">
                <li>Food quality must be maintained at all times.</li>
                <li>Do not donate stale, previously served, or used food.</li>
                <li>Ensure food is hygienic and safe for consumption.</li>
                <li>Non-compliance may lead to account actions or restrictions.</li>
              </ul>
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-sm font-semibold"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-rq-muted text-sm mb-1">Welcome back</p>
              <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse" />
                Live dashboard — syncing every 5s
              </div>
            </motion.div>
          </div>
          <Link
            href="/donor/submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all shadow-lg shadow-slate-500/20 hover:-translate-y-0.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Donate Food
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="p-5 rounded-xl border border-slate-200 bg-white"
            >
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div className={`text-2xl font-bold tabular-nums ${s.color}`}>
                {loading ? '—' : s.value.toLocaleString()}
              </div>
              <div className="text-xs text-rq-muted mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Map */}
        <div className="mb-8">
          <MapView viewAs="donor" />
        </div>

        {/* Donations list */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">All Rescue Events</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Clock className="w-3.5 h-3.5" />
            Sorted by newest first
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-52 rounded-xl skeleton" />
            ))}
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-slate-900 mb-2">No donations yet</p>
            <p className="text-sm mb-6">Be the first to rescue surplus food today</p>
            <Link href="/donor/submit" className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold">
              Donate Now →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {donations.map((d) => (
              <DonationCard key={d.id} donation={d} viewAs="donor" />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
