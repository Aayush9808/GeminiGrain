'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, CheckCircle, Clock, Users, Zap, RefreshCw, Loader2, FlaskConical } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import type { Donation } from '@/lib/types'
import { cn } from '@/lib/utils'

const FILTER_TABS: { id: string; label: string; color: string }[] = [
  { id: 'all',         label: 'All',          color: 'text-slate-700'  },
  { id: 'PENDING',     label: 'Pending',      color: 'text-slate-700'  },
  { id: 'ACCEPTED_BY_NGO', label: 'Accepted', color: 'text-slate-700'  },
  { id: 'SEARCHING_VOLUNTEER', label: 'Searching Volunteer', color: 'text-slate-700'  },
  { id: 'IN_TRANSIT',  label: 'In Transit',   color: 'text-slate-700'  },
  { id: 'COMPLETED',   label: 'Completed',    color: 'text-slate-700'  },
]

export default function NGODashboard() {
  const router = useRouter()
  const [ngoName,    setNgoName]    = useState('NGO Partner')
  const [donations,  setDonations]  = useState<Donation[]>([])
  const [filter,     setFilter]     = useState('all')
  const [loading,    setLoading]    = useState(true)
  const [accepting,  setAccepting]  = useState<string | null>(null)
  const [verified,   setVerified]   = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const user = localStorage.getItem('rq_user')
    const name = localStorage.getItem('rq_name')
    
    if (role !== 'ngo') { 
      router.push('/auth')
      return 
    }
    
    // Check if user has completed profile
    if (!user) {
      router.push('/auth')
      return
    }
    
    try {
      const userData = JSON.parse(user)
      if (!userData.verified) {
        router.push('/auth')
        return
      }
      setVerified(true)
    } catch {
      router.push('/auth')
      return
    }
    
    if (name) setNgoName(name)
  }, [router])

  const fetchDonations = useCallback(async () => {
    try {
      const res  = await fetch('/api/donations')
      const data = await res.json()
      if (data.success) setDonations(data.data)
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    fetchDonations()
    const id = setInterval(fetchDonations, 5000)
    return () => clearInterval(id)
  }, [fetchDonations])

  async function acceptDonation(id: string) {
    setAccepting(id)
    try {
      const target = donations.find((d) => d.id === id)
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ngo_accept', ngoName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'NGO accept failed')

      // Automatically move to the next stage based on NGO volunteer availability.
      if (target?.ngoMatch?.hasVolunteer) {
        const transitRes = await fetch(`/api/donations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'pickup', volunteerName: 'NGO Self-Volunteer' }),
        })
        const transitData = await transitRes.json()
        if (!transitData.success) throw new Error(transitData.error || 'Self-volunteer pickup failed')
        toast.success('Accepted by NGO. Self-volunteer pickup started.')
      } else {
        const searchRes = await fetch(`/api/donations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'search_volunteer' }),
        })
        const searchData = await searchRes.json()
        if (!searchData.success) throw new Error(searchData.error || 'Volunteer search transition failed')
        toast.success('Accepted by NGO. Searching for platform volunteer…')
      }
      fetchDonations()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to accept. Please try again.'
      toast.error(msg)
    } finally {
      setAccepting(null)
    }
  }

  async function simulateNgoAccept() {
    try {
      const pending = donations.find((d) => d.status === 'PENDING')
      const res = await fetch('/api/donations/simulate-ngo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationId: pending?.id }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      toast.success('Simulated NGO acceptance started for a pending donation.')
      fetchDonations()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to simulate NGO acceptance right now.'
      toast.error(msg)
    }
  }

  async function moveAcceptedToSearch(id: string) {
    setAccepting(id)
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search_volunteer' }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Unable to move to volunteer search')
      toast.success('Moved to volunteer search stage.')
      fetchDonations()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unable to move to volunteer search'
      toast.error(msg)
    } finally {
      setAccepting(null)
    }
  }

  async function completeSelfVolunteerDelivery(id: string) {
    setAccepting(id)
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', volunteerName: 'NGO Self-Volunteer' }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      toast.success('Delivery marked as completed.')
      fetchDonations()
    } catch {
      toast.error('Unable to complete delivery right now.')
    } finally {
      setAccepting(null)
    }
  }

  const displayed = filter === 'all'
    ? donations
    : donations.filter((d) => d.status === filter)

  // Sort: CRITICAL → HIGH → MEDIUM → LOW, then by createdAt
  const urgencyOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
  const sorted = [...displayed].sort(
    (a, b) => (urgencyOrder[a.urgency] - urgencyOrder[b.urgency]) ||
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // Stats
  const pendingCount  = donations.filter((d) => d.status === 'PENDING').length
  const transitCount  = donations.filter((d) => d.status === 'IN_TRANSIT').length
  const deliveredToday = donations.filter((d) => d.status === 'COMPLETED').length
  const totalMeals    = donations.reduce((s, d) => s + (d.estimatedServings || 0), 0)

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 pt-28 pb-16">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-slate-700" />
              </div>
              <span className="text-slate-700 text-sm font-medium">{ngoName}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Incoming Food Requests</h1>
            <p className="text-slate-600 text-sm mt-1">Priority-sorted by urgency and spoilage window</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={simulateNgoAccept}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-blue-300 text-blue-700 hover:text-blue-900 hover:border-blue-400 bg-blue-50 transition-all text-xs font-semibold"
              title="Simulate NGO acceptance"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Simulate NGO Accept
            </button>
            <button
              onClick={fetchDonations}
              className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Awaiting Pickup', val: pendingCount,   icon: Clock,       color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-white' },
            { label: 'In Transit',      val: transitCount,   icon: Zap,         color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-white' },
            { label: 'Delivered Today', val: deliveredToday, icon: CheckCircle, color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-white' },
            { label: 'Total Meals',     val: totalMeals,     icon: Users,       color: 'text-slate-700', border: 'border-slate-200', bg: 'bg-white' },
          ].map(({ label, val, icon: Icon, color, border, bg }) => (
            <div key={label} className={`p-4 rounded-xl border ${border} ${bg}`}>
              <Icon className={`w-5 h-5 ${color} mb-2`} />
              <div className={`text-xl font-bold ${color}`}>{val}</div>
              <div className="text-xs text-slate-600 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-6 overflow-x-auto">
          {FILTER_TABS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={cn(
                'flex-1 min-w-[72px] py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                filter === id
                  ? 'bg-slate-200 text-slate-900 border border-slate-300'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Donation list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-600">No donations in this category yet</p>
          </div>
        ) : (
          <AnimatePresence>
            <div className="space-y-4">
              {sorted.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <DonationCard
                    donation={donation}
                    viewAs="ngo"
                    onAccept={acceptDonation}
                    accepting={accepting}
                  />
                  {donation.status === 'ACCEPTED_BY_NGO' && (
                    <button
                      onClick={() => moveAcceptedToSearch(donation.id)}
                      disabled={accepting === donation.id}
                      className="mt-2 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold"
                    >
                      {accepting === donation.id ? 'Updating…' : 'Move to Volunteer Search'}
                    </button>
                  )}
                  {donation.status === 'IN_TRANSIT' && donation.volunteerName === 'NGO Self-Volunteer' && (
                    <button
                      onClick={() => completeSelfVolunteerDelivery(donation.id)}
                      disabled={accepting === donation.id}
                      className="mt-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-sm font-semibold"
                    >
                      {accepting === donation.id ? 'Updating…' : 'Mark Self-Volunteer Delivery Complete'}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </main>
    </div>
  )
}
