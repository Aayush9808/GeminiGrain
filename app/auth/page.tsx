'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Utensils, Building2, Bike, ArrowRight, Heart, Phone, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import type { UserRole } from '@/lib/types'

type AuthStep = 'role' | 'details' | 'success'

const ROLES: { role: UserRole; icon: typeof Utensils; title: string; desc: string; color: string; border: string; bg: string; dot: string }[] = [
  {
    role:   'donor',
    icon:   Utensils,
    title:  'Food Donor',
    desc:   'I have surplus food to donate from a restaurant, event, or hostel.',
    color:  'text-slate-900',
    border: 'border-blue-200',
    bg:     'bg-blue-50',
    dot:    'bg-slate-700',
  },
  {
    role:   'ngo',
    icon:   Building2,
    title:  'NGO Partner',
    desc:   'We are an NGO, shelter, or community kitchen that can receive food.',
    color:  'text-slate-900',
    border: 'border-violet-200',
    bg:     'bg-violet-50',
    dot:    'bg-slate-700',
  },
  {
    role:   'volunteer',
    icon:   Bike,
    title:  'Volunteer',
    desc:   'I want to pick up and deliver rescued food to those in need.',
    color:  'text-slate-900',
    border: 'border-orange-200',
    bg:     'bg-orange-50',
    dot:    'bg-slate-700',
  },
]

export default function AuthPage() {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>('role')
  const [selected, setSelected] = useState<UserRole | null>(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)

  const [details, setDetails] = useState({
    name: '',
    address: '',
    restaurantType: '',
    capacity: '',
    dietaryPref: '',
    hasVolunteer: 'yes',
    vehicleType: '',
    contactPerson: '',
  })

  function goBack() {
    if (step === 'details') setStep('role')
  }

  async function submitDetails() {
    if (!details.name || !details.address || !phoneNumber) {
      toast.error('Name, phone number, and address are required')
      return
    }

    if (selected === 'donor' && !details.restaurantType) {
      toast.error('Please select restaurant type')
      return
    }

    if (selected === 'ngo' && (!details.capacity || !details.dietaryPref || !details.hasVolunteer)) {
      toast.error('Please fill all required fields')
      return
    }

    if (selected === 'volunteer' && !details.vehicleType) {
      toast.error('Please select your vehicle type')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber,
          role: selected,
          details: {
            ...details,
            hasVolunteer: selected === 'ngo' ? details.hasVolunteer === 'yes' : undefined,
          },
        }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('rq_user', JSON.stringify(data.user))
        localStorage.setItem('rq_role', selected!)
        localStorage.setItem('rq_name', details.name)
        localStorage.setItem('rq_phone', phoneNumber)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('rq_login_session_id', String(Date.now()))
          sessionStorage.removeItem('rq_donor_instructions_seen')
        }

        toast.success('Registration successful!')
        setStep('success')

        setTimeout(() => {
          router.push(`/${selected}`)
        }, 2000)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to register')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const stepTitles = {
    role: 'Choose your role',
    details: 'Complete your profile',
    success: 'Successfully registered!',
  }

  const stepDescriptions = {
    role: 'Select how you want to use GeminiGrain today',
    details: `Add your details so we can set up your ${selected} account`,
    success: 'Redirecting to your dashboard...',
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Heart className="w-4.5 h-4.5 text-white" fill="white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Gemini<span className="text-slate-700">Grain</span></span>
      </Link>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{stepTitles[step]}</h1>
           <p className="text-gray-700 mt-2 text-sm font-medium">{stepDescriptions[step]}</p>
        </div>

        {/* Step 1: Role Selection */}
        {step === 'role' && (
          <>
            <div className="space-y-3">
              {ROLES.map(({ role, icon: Icon, title, desc, color, border, bg, dot }) => (
                <button
                  key={role}
                  onClick={() => setSelected(role)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                    selected === role
                      ? `${border} ${bg}`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    selected === role ? `${bg} ${color}` : 'bg-gray-100 text-gray-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${selected === role ? color : 'text-gray-900'}`}>{title}</div>
                     <div className="text-xs text-gray-700 mt-0.5 leading-relaxed">{desc}</div>
                  </div>
                  {selected === role && (
                    <div className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('details')}
              disabled={!selected}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                selected
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Step 2: Details Form */}
        {step === 'details' && (
          <>
            <div className="space-y-4">
              {/* Common fields */}
              <input
                type="text"
                placeholder="Full name"
                value={details.name}
                onChange={(e) => setDetails({ ...details, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />

              <div className="relative">
                <Phone className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={details.address}
                onChange={(e) => setDetails({ ...details, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />

              <input
                type="text"
                placeholder="Contact person (optional)"
                value={details.contactPerson}
                onChange={(e) => setDetails({ ...details, contactPerson: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
              />

              {/* Donor specific */}
              {selected === 'donor' && (
                <select
                  value={details.restaurantType}
                  onChange={(e) => setDetails({ ...details, restaurantType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="">Select restaurant type</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="cafe">Café</option>
                  <option value="hostel">Hostel</option>
                  <option value="event">Event Venue</option>
                  <option value="other">Other</option>
                </select>
              )}

              {/* NGO specific */}
              {selected === 'ngo' && (
                <>
                  <input
                    type="number"
                    placeholder="Capacity (meals/day)"
                    value={details.capacity}
                    onChange={(e) => setDetails({ ...details, capacity: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  />
                  <select
                    value={details.dietaryPref}
                    onChange={(e) => setDetails({ ...details, dietaryPref: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  >
                    <option value="">Select dietary preference</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="any">Any</option>
                  </select>
                  <select
                    value={details.hasVolunteer}
                    onChange={(e) => setDetails({ ...details, hasVolunteer: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  >
                    <option value="yes">We have our own volunteer for collection</option>
                    <option value="no">No, we need GeminiGrain volunteer support</option>
                  </select>
                </>
              )}

              {/* Volunteer specific */}
              {selected === 'volunteer' && (
                <select
                  value={details.vehicleType}
                  onChange={(e) => setDetails({ ...details, vehicleType: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                >
                  <option value="">Select vehicle type</option>
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                  <option value="van">Van</option>
                  <option value="truck">Truck</option>
                </select>
              )}
            </div>

            <button
              onClick={submitDetails}
              disabled={!details.name || !details.address || !phoneNumber || loading}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                details.name && details.address && phoneNumber && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              onClick={goBack}
              className="w-full mt-3 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Welcome to GeminiGrain!</h2>
              <p className="text-gray-600 text-sm mt-2">Redirecting to your dashboard...</p>
            </div>
          </div>
        )}

         <p className="text-center text-xs text-gray-700 font-medium mt-5">
          By continuing, you agree to support food rescue efforts.
        </p>
      </motion.div>
    </div>
  )
}
