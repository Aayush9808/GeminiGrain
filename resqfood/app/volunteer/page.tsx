'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Truck, CheckCircle2, Loader2, Package } from 'lucide-react'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation } from '@/lib/types'

export default function VolunteerHub() {
  const router      = useRouter()
  const [all, setAll]           = useState<Donation[]>([])
  const [loading, setLoading]   = useState(true)
  const [name, setName]         = useState('Volunteer')

  const fetchDonations = useCallback(async () => {
    try {
      const res  = await fetch('/api/donations')
      const data = await res.json()
      if (data.success) setAll(data.data as Donation[])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const n    = localStorage.getItem('rq_name')
    if (role !== 'volunteer') { router.push('/auth'); return }
    if (n) setName(n)
    fetchDonations()
    const id = setInterval(fetchDonations, 8000)
    return () => clearInterval(id)
  }, [router, fetchDonations])

  async function handleAccept(id: string) {
    await fetch(`/api/donations/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'IN_TRANSIT', volunteerName: name }),
    })
    fetchDonations()
  }

  const available = all.filter(d => d.status === 'MATCHED')
  const myPickups = all.filter(d => d.volunteerName === name)

  return (
    <div className="min-h-screen bg-rq-bg">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8 pt-24">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900">Volunteer Hub</h1>
          <p className="text-gray-500 text-sm mt-0.5">Pick up food and deliver it to an NGO · {name}</p>
        </div>

        {/* My pickups */}
        {myPickups.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4 text-orange-500" /> Your Active Pickups
            </h2>
            <div className="space-y-3">
              {myPickups.map(d => (
                <motion.div key={d.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}>
                  <DonationCard donation={d} />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Available */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> Available Pickups ({available.length})
            </h2>
            <button onClick={fetchDonations} className="text-xs text-gray-500 hover:text-gray-700">Refresh</button>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
          ) : available.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No pickups available right now.</p>
              <p className="text-xs text-gray-400 mt-1">Check back shortly — donations come in fast.</p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {available.map(d => (
                  <motion.div key={d.id} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>
                    <DonationCard donation={d} showActions onAccept={handleAccept} />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  )
}
