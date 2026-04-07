'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, RotateCcw, Loader2, Filter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation } from '@/lib/types'

const TABS = ['ALL', 'PENDING', 'MATCHED'] as const
type Tab = typeof TABS[number]

export default function NGODashboard() {
  const router = useRouter()
  const [donations, setDonations] = useState<Donation[]>([])
  const [tab, setTab]             = useState<Tab>('ALL')
  const [loading, setLoading]     = useState(true)
  const [name, setName]           = useState('NGO')

  const fetchDonations = useCallback(async () => {
    try {
      const res  = await fetch('/api/donations')
      const data = await res.json()
      if (data.success) setDonations(data.data as Donation[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const n    = localStorage.getItem('rq_name')
    if (role !== 'ngo') { router.push('/auth'); return }
    if (n) setName(n)
    fetchDonations()
    const id = setInterval(fetchDonations, 6000)
    return () => clearInterval(id)
  }, [router, fetchDonations])

  async function handleAccept(id: string) {
    await fetch(`/api/donations/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'MATCHED', ngoName: name }),
    })
    fetchDonations()
  }

  const urgOrder = { CRITICAL:0, HIGH:1, MEDIUM:2, LOW:3 }
  const filtered = donations
    .filter(d => tab === 'ALL' || d.status === tab || (tab === 'MATCHED' && d.status === 'MATCHED'))
    .sort((a, b) => (urgOrder[a.urgency] ?? 3) - (urgOrder[b.urgency] ?? 3))

  return (
    <div className="min-h-screen bg-rq-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 pt-24">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">NGO Queue</h1>
            <p className="text-gray-500 text-sm mt-0.5">Priority-sorted by urgency · {name}</p>
          </div>
          <button onClick={fetchDonations}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No donations in this category yet</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {filtered.map(d => (
                <motion.div key={d.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                  <DonationCard donation={d} showActions onAccept={handleAccept} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
