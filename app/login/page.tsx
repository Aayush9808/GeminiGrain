'use client'

import { useState }   from 'react'
import { useRouter }  from 'next/navigation'
import toast          from 'react-hot-toast'
import {
  Heart, Phone, ShieldCheck,
  Loader2, ChevronRight, AlertCircle,
} from 'lucide-react'
import { useAuth, getRoleDashboard } from '@/lib/auth-context'
import type { UserRole } from '@/lib/auth/types'
import DemoButton from '@/components/DemoButton'
import { DEMO_LOGIN } from '@/lib/demo-data'

type Phase = 'phone' | 'otp'

export default function LoginPage() {
  const router    = useRouter()
  const { login } = useAuth()

  const [phase,   setPhase]   = useState<Phase>('phone')
  const [phone,   setPhone]   = useState('')
  const [otp,     setOtp]     = useState('')
  const [demoOtp, setDemoOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

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

  // ── Verify OTP + Login ────────────────────────────────────────────────────

  async function handleVerifyOTP() {
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return }
    setError('')
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone.replace(/\s/g, ''), otp }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.message); return }
      if (data.isNewUser) {
        // Shouldn't happen via /login flow, but handle gracefully
        toast('Looks like you need to register first.')
        router.push('/register')
        return
      }
      login(data.token, data.user)
      toast.success(`Welcome back! 🌾`)
      router.push(getRoleDashboard(data.user.role as UserRole))
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setOtp('')
    setDemoOtp('')
    setPhase('phone')
    await handleSendOTP()
  }

  function applyDemoCredentials() {
    setPhone(DEMO_LOGIN.phone)
    setOtp(DEMO_LOGIN.otp)
    setDemoOtp(DEMO_LOGIN.otp)
    setError('')
    setLoading(true)
    // Auto-register demo user if they don't exist yet, then skip to OTP step
    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber: DEMO_LOGIN.phone,
        role: 'donor',
        subtype: 'individual',
        details: { name: 'Demo User', email: 'demo@geminigrain.app', address: 'Demo City, India' }
      }),
    })
      .then(() => {/* ignore duplicate 409 — user may already exist */})
      .catch(() => {/* network error fine in demo */})
      .finally(() => {
        setLoading(false)
        toast.success('Demo credentials loaded! Click Verify & Sign In.')
        setPhase('otp')
      })
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      if (phase === 'phone') handleSendOTP()
      else                   handleVerifyOTP()
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-rq-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-rq-amber" fill="#F5A623" />
          <span className="font-serif text-2xl font-bold text-rq-text">GeminiGrain</span>
        </div>
        <p className="text-rq-muted text-sm">Sign in to your account</p>
        <div className="mt-3">
          <DemoButton onFill={applyDemoCredentials} label="Use Demo Credentials" />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-rq-border p-8 animate-fade-in">

        {phase === 'phone' ? (
          <>
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
                value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setError('') }}
                onKeyDown={handleKeyDown}
                placeholder="98765 43210"
                className={`flex-1 px-4 py-2.5 rounded-r-xl border text-sm text-rq-text placeholder-rq-subtle focus:outline-none focus:ring-2 transition-all ${
                  error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-rq-border bg-rq-surface2 focus:border-rq-amber focus:ring-amber-100'
                }`}
              />
            </div>
            {error && (
              <p className="text-xs text-red-600 mb-3 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{error}
              </p>
            )}

            <button onClick={handleSendOTP} disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-rq-amber text-white rounded-xl font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5">
              <ShieldCheck className="w-7 h-7 text-rq-green" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Enter OTP</h2>
            <p className="text-rq-muted text-sm mb-1">
              OTP sent to <span className="font-semibold text-rq-text">+91 {phone}</span>
            </p>

            {demoOtp && (
              <div className="mb-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
                <AlertCircle className="w-4 h-4 text-rq-amber flex-shrink-0" />
                <span className="text-amber-800">Demo OTP: <strong className="font-mono tracking-widest">{demoOtp}</strong></span>
              </div>
            )}

            <label className="block text-sm font-semibold text-rq-text mb-1.5">6-Digit OTP</label>
            <input
              type="text" inputMode="numeric" maxLength={6}
              value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
              onKeyDown={handleKeyDown}
              placeholder="• • • • • •"
              className={`w-full px-4 py-3 rounded-xl border text-center text-xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 transition-all ${
                error ? 'border-red-400 bg-red-50 focus:ring-red-200' : 'border-rq-border bg-rq-surface2 focus:border-rq-amber focus:ring-amber-100'
              }`}
            />
            {error && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{error}
              </p>
            )}

            <button onClick={handleVerifyOTP} disabled={loading}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-rq-amber text-white rounded-xl font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              {loading ? 'Verifying…' : 'Verify & Sign In'}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <button onClick={() => setPhase('phone')} className="text-rq-muted hover:text-rq-text">
                ← Change number
              </button>
              <button onClick={handleResend} className="text-rq-amber hover:underline">
                Resend OTP
              </button>
            </div>
          </>
        )}

        <p className="mt-6 text-center text-sm text-rq-muted">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-rq-amber hover:underline font-semibold">Register</a>
        </p>
      </div>
    </div>
  )
}
