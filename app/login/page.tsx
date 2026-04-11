'use client'

import { useState }   from 'react'
import { useRouter }  from 'next/navigation'
import toast          from 'react-hot-toast'
import {
  Phone, ShieldCheck,
  Loader2, ChevronRight, AlertCircle, Zap,
  UtensilsCrossed, Building2, Bike, Check,
} from 'lucide-react'
import { useAuth, getRoleDashboard } from '@/lib/auth-context'
import type { UserRole } from '@/lib/auth/types'
import { DEMO_PHONES }  from '@/lib/auth/demo-seed'

type Phase = 'phone' | 'otp'

const DEMO_ROLES = [
  { role: 'donor'     as UserRole, label: 'Food Donor',  icon: UtensilsCrossed, phone: DEMO_PHONES.donor     },
  { role: 'ngo'       as UserRole, label: 'NGO Partner', icon: Building2,       phone: DEMO_PHONES.ngo       },
  { role: 'volunteer' as UserRole, label: 'Volunteer',   icon: Bike,            phone: DEMO_PHONES.volunteer },
] as const

export default function LoginPage() {
  const router    = useRouter()
  const { login } = useAuth()

  const [phase,        setPhase]        = useState<Phase>('phone')
  const [phone,        setPhone]        = useState('')
  const [otp,          setOtp]          = useState('')
  const [demoOtp,      setDemoOtp]      = useState('')
  const [loading,      setLoading]      = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [error,        setError]        = useState('')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  // ── Demo role select → auto-fill phone ───────────────────────────────────

  function fillDemoPhone(role: UserRole, demoPhone: string) {
    setPhone(demoPhone)
    setSelectedRole(role)
    setError('')
  }

  // ── Send OTP ──────────────────────────────────────────────────────────────

  async function handleSendOTP() {
    const cleaned = phone.replace(/\s/g, '')
    if (!/^[6-9]\d{9}$/.test(cleaned)) {
      setError('Enter a valid 10-digit Indian mobile number.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: cleaned }),
      })
      const data = await res.json()
      if (!data.success) {
        if (data.notRegistered) {
          toast.error('No account found. Please register first.')
          router.push('/register')
          return
        }
        setError(data.message)
        return
      }
      setDemoOtp(data.demo_otp ?? '')
      setPhase('otp')
      toast.success('OTP sent!')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Core OTP verification (accepts explicit value to avoid stale state) ──

  async function verifyWithCode(code: string) {
    if (code.length !== 6) { setError('Enter the 6-digit OTP.'); return }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone.replace(/\s/g, ''), otp: code }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      if (data.isNewUser) {
        toast('Looks like you need to register first.')
        router.push('/register')
        return
      }
      login(data.token, data.user)
      toast.success('Welcome back!')
      router.push(getRoleDashboard(data.user.role as UserRole))
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setOtpVerifying(false)
    }
  }

  function handleVerifyOTP() { verifyWithCode(otp) }

  // ── Use Demo OTP — auto-fill + animated verify ───────────────────────────

  async function useDemoOtp() {
    const code = demoOtp || '123456'
    setOtp(code)
    setError('')
    setOtpVerifying(true)
    // Brief animation so it feels like a real verification step
    await new Promise<void>(r => setTimeout(r, 1400))
    await verifyWithCode(code)
  }

  async function handleResend() {
    setOtp('')
    setDemoOtp('')
    setOtpVerifying(false)
    setPhase('phone')
  }

  const isDemoPhone = Object.values(DEMO_PHONES).includes(phone.replace(/\s/g, ''))

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-rq-bg flex flex-col items-center justify-center px-4 py-12">

      {/* Logo + Home link */}
      <div className="mb-6 text-center">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-rq-muted hover:text-rq-text mb-3 transition-colors">
          <ChevronRight className="w-3.5 h-3.5 rotate-180" />
          Back to Home
        </a>
        <div className="flex justify-center mb-4">
          <a href="/" className="inline-block transition-opacity hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="GeminiGrain Logo" style={{ width: '260px', height: 'auto' }} />
          </a>
        </div>
        <p className="text-rq-muted text-sm">Sign in to your account</p>
      </div>

      {/* ── Demo Role Panel (phone screen only) ───────────────────────────── */}
      {phase === 'phone' && (
        <div className="w-full max-w-sm mb-5">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">Try the Demo</span>
              <span className="ml-auto text-xs text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
                Select a role
              </span>
            </div>
            <p className="text-xs text-amber-700 mb-3 pl-0.5">
              Click a role to autofill the demo number, then send OTP.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ROLES.map(({ role, label, icon: Icon, phone: dPhone }) => {
                const isActive = selectedRole === role
                return (
                  <button
                    key={role}
                    onClick={() => fillDemoPhone(role, dPhone)}
                    className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border transition-all
                      ${isActive
                        ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-200'
                        : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-900'
                      }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" strokeWidth={3} />
                      </span>
                    )}
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                    <span className="text-xs font-semibold leading-tight text-center">{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Auth Card ─────────────────────────────────────────────────────── */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-rq-border p-8 animate-fade-in">

        {/* ── Phone Step ──────────────────────────────────────────────────── */}
        {phase === 'phone' ? (
          <form onSubmit={e => { e.preventDefault(); handleSendOTP() }} noValidate>
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-5">
              <Phone className="w-7 h-7 text-rq-amber" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Sign in</h2>
            <p className="text-rq-muted text-sm mb-6">
              Enter your registered mobile number to receive an OTP.
            </p>

            <label className="block text-sm font-semibold text-rq-text mb-1.5">
              Mobile Number
            </label>
            <div className="flex mb-1">
              <span className="flex items-center px-3 bg-rq-surface2 border border-rq-border rounded-l-xl text-rq-muted text-sm border-r-0">
                +91
              </span>
              <input
                type="tel" inputMode="numeric" maxLength={10}
                value={phone}
                autoFocus
                onChange={e => {
                  setPhone(e.target.value.replace(/\D/g, ''))
                  setError('')
                  if (selectedRole) setSelectedRole(null)
                }}
                placeholder="98765 43210"
                className={`flex-1 px-4 py-2.5 rounded-r-xl border text-sm text-rq-text placeholder-rq-subtle focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-rq-border bg-rq-surface2 focus:border-rq-amber focus:ring-amber-100'
                }`}
              />
            </div>

            {/* Demo role hint below input */}
            {selectedRole && (
              <p className="text-xs text-amber-700 mb-1 flex items-center gap-1">
                <Check className="w-3 h-3 text-green-600" />
                Demo number for{' '}
                <strong className="capitalize">
                  {DEMO_ROLES.find(r => r.role === selectedRole)?.label}
                </strong>{' '}
                autofilled
              </p>
            )}

            {error && (
              <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-rq-amber text-white rounded-xl font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>

        ) : (
          /* ── OTP Step ───────────────────────────────────────────────────── */
          <form onSubmit={e => { e.preventDefault(); handleVerifyOTP() }} noValidate>
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-colors duration-300 ${
              otpVerifying ? 'bg-green-50 border border-green-300' : 'bg-green-50 border border-green-200'
            }`}>
              {otpVerifying
                ? <Loader2 className="w-7 h-7 text-rq-green animate-spin" />
                : <ShieldCheck className="w-7 h-7 text-rq-green" />
              }
            </div>

            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">
              {otpVerifying ? 'Verifying…' : 'Enter OTP'}
            </h2>
            <p className="text-rq-muted text-sm mb-4">
              OTP sent to{' '}
              <span className="font-semibold text-rq-text">+91 {phone}</span>
            </p>

            {/* Use Demo OTP button — shown when it's a demo number */}
            {isDemoPhone && !otpVerifying && (
              <button
                type="button"
                onClick={useDemoOtp}
                disabled={loading}
                className="w-full mb-4 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-sm transition-all disabled:opacity-50"
              >
                <Zap className="w-4 h-4 text-amber-600" />
                Use Demo OTP
              </button>
            )}

            {otpVerifying && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-800">
                <Loader2 className="w-4 h-4 text-green-600 animate-spin flex-shrink-0" />
                <span>Checking OTP with server…</span>
              </div>
            )}

            <label className="block text-sm font-semibold text-rq-text mb-1.5">
              6-Digit OTP
            </label>
            <input
              type="text" inputMode="numeric" maxLength={6}
              value={otp}
              autoFocus
              onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
              disabled={otpVerifying}
              placeholder="• • • • • •"
              className={`w-full px-4 py-3 rounded-xl border text-center text-xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 transition-all disabled:opacity-60 ${
                error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-rq-border bg-rq-surface2 focus:border-rq-amber focus:ring-amber-100'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otpVerifying}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-rq-amber text-white rounded-xl font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50"
            >
              {(loading || otpVerifying) ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {otpVerifying ? 'Verifying OTP…' : loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={() => { setPhase('phone'); setOtp(''); setDemoOtp(''); setOtpVerifying(false) }}
                className="text-rq-muted hover:text-rq-text"
              >
                ← Change number
              </button>
              <button type="button" onClick={handleResend} className="text-rq-amber hover:underline">
                Resend OTP
              </button>
            </div>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-rq-muted">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-rq-amber hover:underline font-semibold">Register</a>
        </p>
      </div>
    </div>
  )
}
