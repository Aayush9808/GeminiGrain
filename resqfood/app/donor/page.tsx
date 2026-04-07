'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus, Leaf, Package, Users, CheckCircle, Clock, Loader2, LogOut } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation, ImpactStats } from '@/lib/types'

export default function DonorDashboard() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [stats, setStats]         = useState<ImpactStats | null>(null)
  const [loading, setLoading]     = useState(true)
  const [name, setName]           = useState('Donor')

  const fetchData = useCallback(async () => {
    try {
      const [dRes, sRes] = await Promise.all([
        fetch('/api/donations'),
        fetch('/api/impact'),
      ])
      const dData = await dRes.json()
      const sData = await sRes.json()
      if (dData.success) setDonations((dData.data as Donation[]).filter(d => d.donorId === 'donor-1'))
      if (sData.success) setStats(sData.data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const n    = localStorage.getItem('rq_name')
    if (role !== 'donor') { router.push('/auth'); return }
    if (n) setName(n)
    fetchData()
    const id = setInterval(fetchData, 8000)
    return () => clearInterval(id)
  }, [router, fetchData])

  const statCards = [
    { label:'Meals Rescued',   value: stats?.mealsRescued ?? 0,      icon: Users,        color:'text-green-600',  bg:'bg-green-50' },
    { label:'Active',          value: stats?.activeDonations ?? 0,    icon: Clock,        color:'text-orange-600', bg:'bg-orange-50' },
    { label:'Delivered Today', value: stats?.deliveredToday ?? 0,     icon: CheckCircle,  color:'text-blue-600',   bg:'bg-blue-50' },
    { label:'CO₂ Avoided',     value: `${stats?.co2AvoidedKg ?? 0}kg`,icon: Leaf,         color:'text-violet-600', bg:'bg-violet-50' },
  ]

  return (
    <div className="min-h-screen bg-rq-bg">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8 pt-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Your Dashboard</h1>
            <p className="text-gray-500 text-sm mt-0.5">Welcome back, {name}</p>
          </div>
          <Link href="/donor/submit"
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-sm shadow-green-600/20 transition-all hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Donate Food
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="text-xl font-black text-gray-900">{value.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Donations list */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Your Donations</h2>
          <button onClick={fetchData} className="text-xs text-gray-500 hover:text-gray-700">Refresh</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : donations.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium mb-4">No donations yet</p>
            <Link href="/donor/submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Create First Donation
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map(d => (
              <motion.div key={d.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                <DonationCard donation={d} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
