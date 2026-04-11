'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Bike, MapPin, CheckCircle, Package, Loader2, Trophy, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import DonationCard from '@/components/DonationCard'
import FoodSafetyCertificate from '@/components/FoodSafetyCertificate'
import MapView from '@/components/MapView'
import type { Donation, FoodSafetyCertificate as FoodSafetyCertificateData } from '@/lib/types'

export default function VolunteerDashboard() {
  const router = useRouter()
  const [volunteerName, setVolunteerName] = useState('Volunteer')
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [actioning, setActioning] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [certificate, setCertificate] = useState<{ data: FoodSafetyCertificateData; rescue: Donation } | null>(null)

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const user = localStorage.getItem('rq_user')
    const name = localStorage.getItem('rq_name')

    if (role !== 'volunteer') {
      router.push('/login')
      return
    }

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
    } catch {
      router.push('/login')
      return
    }

    if (name) setVolunteerName(name)
    const s = parseInt(localStorage.getItem('rq_streak') || '0', 10)
    setStreak(s)
  }, [router])

  const fetchDonations = useCallback(async () => {
    try {
      const res = await fetch('/api/donations')
      const data = await res.json()
      if (data.success) {
        // Volunteers handle platform-assisted pickups and active transit deliveries.
        setDonations(data.data.filter((d: Donation) => d.status === 'SEARCHING_VOLUNTEER' || d.status === 'IN_TRANSIT'))
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDonations()
    const id = setInterval(fetchDonations, 5000)
    return () => clearInterval(id)
  }, [fetchDonations])

  async function pickup(id: string) {
    setActioning(id)
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'pickup', volunteerName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      toast.success('Pickup started. Proceed to assigned NGO.')
      fetchDonations()
    } catch {
      toast.error('Error updating pickup.')
    } finally {
      setActioning(null)
    }
  }

  async function deliver(id: string) {
    setActioning(id)
    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'complete', volunteerName }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()

      const rescueRes = await fetch(`/api/donations/${id}`)
      const rescueData = await rescueRes.json()
      if (!rescueData.success) throw new Error()

      const rescue = rescueData.data as Donation
      const certificateRes = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rescue: {
            foodName: rescue.foodName,
            quantity: rescue.quantity,
            createdAt: rescue.createdAt,
            matchedAt: rescue.matchedAt,
            deliveredAt: new Date(),
            storageConditions: 'Fast-tracked delivery through GeminiGrain flow',
            ambientTemp: 'Not recorded',
            dietaryType: rescue.dietaryType,
            allergens: rescue.allergenFlags,
          },
        }),
      })
      const certificateData = await certificateRes.json()
      if (certificateData.success) {
        const saveRes = await fetch(`/api/donations/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ certificate: certificateData.data }),
        })
        const saveData = await saveRes.json()
        if (saveData.success) {
          setCertificate({ data: certificateData.data, rescue: saveData.data as Donation })
        }
      }

      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('rq_streak', String(newStreak))
      toast.success(`Delivery completed. ${newStreak} rescues completed by you.`)
      fetchDonations()
    } catch {
      toast.error('Error updating delivery.')
    } finally {
      setActioning(null)
    }
  }

  const inTransit = donations.filter((d) => d.status === 'IN_TRANSIT')
  const available = donations.filter((d) => d.status === 'SEARCHING_VOLUNTEER')

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                <Bike className="w-4 h-4 text-slate-700" />
              </div>
              <span className="text-slate-700 text-sm font-medium">{volunteerName}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Volunteer Hub</h1>
            <p className="text-slate-600 text-sm mt-1">Handle pickups when NGOs need external volunteer support</p>
          </div>

          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div className="text-right">
                <div className="text-lg font-bold text-slate-900">{streak}</div>
                <div className="text-xs text-slate-600">rescues completed</div>
              </div>
            </div>
          )}
        </div>

        {certificate && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-700 font-semibold">AI Certificate</p>
                <h2 className="text-lg font-bold text-slate-900 mt-1">Food safety verification issued</h2>
              </div>
              <button
                onClick={() => setCertificate(null)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Dismiss
              </button>
            </div>
            <FoodSafetyCertificate data={certificate.data} rescue={certificate.rescue} />
          </section>
        )}

        {/* Map — show route when there's an active in-transit delivery */}
        {!loading && (
          <div className="mb-8">
            <MapView viewAs="volunteer" />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-7 h-7 text-emerald-500 animate-spin" />
          </div>
        ) : (
          <>
            {inTransit.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Active Deliveries</h2>
                </div>
                <AnimatePresence>
                  <div className="space-y-3">
                    {inTransit.map((d) => (
                      <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <DonationCard donation={d} viewAs="volunteer" onDeliver={deliver} actioning={actioning} />
                        <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                          <div className="text-xs text-slate-600 flex-1">
                            Navigate to: <span className="text-slate-900 font-medium">{d.ngoMatch?.name ?? 'Assigned NGO'}</span> · {d.ngoMatch?.distance ?? '2–3 km'}
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Available Pickups ({available.length})
                </h2>
              </div>

              {available.length === 0 ? (
                <div className="text-center py-14">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-slate-900 font-medium mb-1">All caught up!</p>
                  <p className="text-slate-600 text-sm">No pickups available right now. Check back soon.</p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-3">
                    {available.map((d) => (
                      <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <DonationCard donation={d} viewAs="volunteer" onPickup={pickup} actioning={actioning} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
