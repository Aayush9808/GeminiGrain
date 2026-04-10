'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, ImagePlus, Type, Brain, CheckCircle,
  ArrowLeft, Zap, AlertTriangle, Leaf, Users,
  MapPin, Clock, Send, RotateCcw, Loader2,
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import DemoButton, { type DemoVariant } from '@/components/DemoButton'
import { DEMO_FOOD_INPUTS } from '@/lib/demo-data'
import { urgencyColor, urgencyBg, cn } from '@/lib/utils'
import type { GeminiAnalysis, UrgencyLevel } from '@/lib/types'

// ── Gemini processing steps ───────────────────────────────────────────────────
const STEPS = [
  { id: 1, icon: '🔍', label: 'Detecting language and context' },
  { id: 2, icon: '📝', label: 'Extracting food type & quantity' },
  { id: 3, icon: '⏱️', label: 'Calculating spoilage window' },
  { id: 4, icon: '🎯', label: 'Determining urgency level' },
  { id: 5, icon: '🏥', label: 'Scoring NGO candidates' },
  { id: 6, icon: '✅', label: 'Analysis complete!' },
]

// ── Urgency ring SVG ─────────────────────────────────────────────────────────
function UrgencyRing({ level }: { level: UrgencyLevel }) {
  const r    = 36
  const circ = 2 * Math.PI * r
  const pct  = { CRITICAL: 95, HIGH: 70, MEDIUM: 40, LOW: 15 }[level]
  const dash = (pct / 100) * circ
  const col  = { CRITICAL: '#F87171', HIGH: '#FB923C', MEDIUM: '#FBBF24', LOW: '#4ADE80' }[level]

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="88" height="88" viewBox="0 0 88 88" className="-rotate-90">
        <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(34,197,94,0.08)" strokeWidth="6" />
        <circle
          cx="44" cy="44" r={r}
          fill="none"
          stroke={col}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="urgency-ring"
          style={{ filter: `drop-shadow(0 0 6px ${col}66)` }}
        />
      </svg>
      <div className={`text-xs font-bold uppercase tracking-wider ${urgencyColor(level)}`}>{level}</div>
    </div>
  )
}

// ── Sample prompts ────────────────────────────────────────────────────────────
const SAMPLES = [
  { lang: 'Hindi',   text: 'Mere paas 40 logon ka khana hai, biryani aur dal, jaldi le jao' },
  { lang: 'English', text: '30 plates of leftover paneer curry and rice from our office event today' },
  { lang: 'Hindi',   text: 'Shaadi mein 50 plate khana bach gaya, abhi hot hai, uthwa do jaldi' },
  { lang: 'English', text: 'Urgent: 20kg chicken pulao from restaurant dinner, expires in 2 hours' },
]

// ── Main component ────────────────────────────────────────────────────────────
type Stage = 'input' | 'processing' | 'result' | 'submitted'

export default function SubmitFood() {
  const router = useRouter()

  // Input state
  const [tab,       setTab]      = useState<'text' | 'voice'>('text')
  const [text,      setText]     = useState('')
  const [location,  setLocation] = useState('')
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef<unknown>(null)

  // Processing state
  const [stage,    setStage]   = useState<Stage>('input')
  const [step,     setStep]    = useState(-1)
  const [analysis, setAnalysis] = useState<GeminiAnalysis | null>(null)
  const [isDemo,   setIsDemo]  = useState(false)
  const [donorName, setDonorName] = useState('Anonymous Donor')
  const [donorId, setDonorId] = useState('donor-1')
  const [autoProgress, setAutoProgress] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const user = localStorage.getItem('rq_user')
    const name = localStorage.getItem('rq_name')
    if (role !== 'donor') { router.push('/auth'); return }
    if (name) setDonorName(name)
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.id) setDonorId(userData.id)
      } catch {
        // Ignore invalid local cache and continue with fallback donor id.
      }
    }
  }, [router])

  // ── Voice input ─────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SR) { toast.error('Voice input not supported in this browser'); return }

    if (listening) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(recognitionRef.current as any)?.stop()
      setListening(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new SR()
    recognition.lang             = 'hi-IN'
    recognition.interimResults   = true
    recognition.continuous       = false
      recognitionRef.current = recognition

    recognition.onstart  = () => setListening(true)
    recognition.onresult = (e: { results: { [key: number]: { [key: number]: { transcript: string }; length: number }; length: number } }) => {
      const transcript = Array.from({ length: e.results.length }, (_, i) => e.results[i][0].transcript).join('')
      setText(transcript)
    }
    recognition.onend    = () => setListening(false)
    recognition.onerror  = () => { setListening(false); toast.error('Voice recognition error') }
    recognition.start()
  }, [listening])

  // ── Analyze with Gemini ──────────────────────────────────────────────────
  async function analyze() {
    if (!text.trim()) { toast.error('Please enter or speak your food description'); return }

    setStage('processing')
    setStep(0)

    // Animate through steps
    for (let i = 0; i < STEPS.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 520))
      setStep(i + 1)
    }

    try {
      const res  = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAnalysis(data.data)
      setIsDemo(!!data.demo)
      setStage('result')
    } catch {
      toast.error('Analysis failed. Please try again.')
      setStage('input')
      setStep(-1)
    }
  }

  // ── Submit donation ──────────────────────────────────────────────────────
  async function submit() {
    if (!analysis) return
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorId,
          donorName,
          location:  location || 'Location not specified',
          rawInput:  text,
          analysis,
          autoProgress,
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setStage('submitted')
      toast.success('Food listed! NGO has been notified.')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  function reset() {
    setStage('input')
    setStep(-1)
    setText('')
    setLocation('')
    setAnalysis(null)
  }

  const demoVariants: DemoVariant[] = DEMO_FOOD_INPUTS.map(d => ({
    label:  d.label,
    onFill: () => {
      setText(d.text)
      setLocation(d.location)
      setTab('text')
      setStage('input')
      toast.success(`Demo loaded: "${d.label}" — click Analyze to continue.`)
    },
  }))

  return (
    <div className="min-h-screen bg-mesh">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        {/* Back link */}
        <Link href="/donor" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        {/* ── STAGE: INPUT ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {stage === 'input' && (
            <motion.div key="input" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
              <div className="mb-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Donate Surplus Food</h1>
                    <p className="text-rq-muted text-sm mt-1.5">
                      Describe your food in any language — Gemini handles the rest.
                    </p>
                  </div>
                  <DemoButton label="Demo" variants={demoVariants} className="flex-shrink-0 mt-1" />
                </div>
              </div>

              {/* Input tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 mb-4">
                {[
                  { id: 'text',  icon: Type, label: 'Type' },
                  { id: 'voice', icon: Mic,  label: 'Voice' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setTab(id as 'text' | 'voice')}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all',
                      tab === id
                        ? 'bg-slate-200 text-slate-900 border border-slate-300'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Text input */}
              {tab === 'text' && (
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. Mere paas 40 logon ka biryani hai, jaldi uthwana hai…"
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-slate-500/50 focus:ring-1 focus:ring-slate-500/20 transition-all"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500">{text.length}</div>
                </div>
              )}

              {/* Voice input */}
              {tab === 'voice' && (
                <div className="relative flex flex-col items-center gap-4 py-8 rounded-xl border border-slate-300 bg-white">
                  <button
                    onClick={toggleVoice}
                    className={cn(
                      'relative w-16 h-16 rounded-full flex items-center justify-center transition-all',
                      listening
                        ? 'bg-red-500 shadow-lg shadow-red-500/30'
                        : 'bg-slate-100 border border-slate-300 hover:bg-slate-200',
                    )}
                  >
                    {listening && (
                      <>
                        <span className="absolute inset-0 rounded-full bg-red-500 ai-ripple" />
                        <span className="absolute inset-0 rounded-full bg-red-500 ai-ripple-2" />
                      </>
                    )}
                    {listening
                      ? <MicOff className="w-6 h-6 text-white relative z-10" />
                      : <Mic className="w-6 h-6 text-slate-700" />}
                  </button>
                  <p className="text-sm text-slate-600">
                    {listening ? 'Listening… Speak in Hindi or English' : 'Tap to speak'}
                  </p>
                  {text && (
                    <div className="w-full px-4">
                      <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 text-sm text-slate-800">
                        {text}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Location */}
              <div className="mt-3 relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location (optional) — e.g. Sector 15, Noida"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-500 text-sm focus:outline-none focus:border-slate-500/50 transition-all"
                />
              </div>

              {/* Sample prompts */}
              <div className="mt-4">
                <p className="text-xs text-slate-600 mb-2">Try a sample:</p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLES.map((s) => (
                    <button
                      key={s.text}
                      onClick={() => setText(s.text)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-400 transition-colors"
                    >
                      {s.lang}: {s.text.slice(0, 32)}…
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze button */}
              <button
                onClick={analyze}
                disabled={!text.trim()}
                className={cn(
                  'w-full mt-6 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all',
                  text.trim()
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-500/20 hover:-translate-y-0.5'
                    : 'bg-slate-200 text-slate-500 cursor-not-allowed',
                )}
              >
                <Brain className="w-4.5 h-4.5" />
                Analyze with Gemini AI
              </button>
            </motion.div>
          )}

          {/* ── STAGE: PROCESSING ──────────────────────────────────────── */}
          {stage === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-10">
                <h2 className="text-xl font-bold text-slate-900">Gemini is analyzing…</h2>
                <p className="text-slate-600 text-sm mt-1">Extracting structured data from your input</p>
              </div>

              {/* AI ripple animation */}
              <div className="flex justify-center mb-10">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full bg-violet-500/20 ai-ripple" />
                  <span className="absolute inset-0 rounded-full bg-violet-500/15 ai-ripple-2" />
                  <span className="absolute inset-0 rounded-full bg-violet-500/10 ai-ripple-3" />
                  <div className="relative z-10 w-14 h-14 rounded-full bg-violet-500/20 border border-violet-500/40 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-violet-400" />
                  </div>
                </div>
              </div>

              {/* Step list */}
              <div className="space-y-2.5 max-w-sm mx-auto">
                {STEPS.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: i <= step ? 1 : 0.25 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                      i < step  ? 'bg-slate-100 border-slate-200' :
                      i === step ? 'bg-violet-500/8 border-violet-500/30' :
                                   'bg-transparent border-transparent',
                    )}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className={cn('text-sm flex-1', i < step ? 'text-slate-700' : i === step ? 'text-slate-700' : 'text-slate-500')}>
                      {s.label}
                    </span>
                    {i < step  && <CheckCircle className="w-4 h-4 text-slate-700 shrink-0" />}
                    {i === step && <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />}
                  </motion.div>
                ))}
              </div>

              {/* Input preview */}
              <div className="mt-8 p-3.5 rounded-xl border border-slate-200 bg-white max-w-sm mx-auto">
                <div className="text-xs text-slate-500 mb-1">Your input</div>
                <div className="text-sm text-slate-800 line-clamp-2">{text}</div>
              </div>
            </motion.div>
          )}

          {/* ── STAGE: RESULT ───────────────────────────────────────────── */}
          {stage === 'result' && analysis && (
            <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-slate-700" />
                    <h2 className="text-xl font-bold text-slate-900">Analysis Complete</h2>
                  </div>
                  {isDemo && (
                    <p className="text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full inline-block">
                      Demo mode — Add GEMINI_API_KEY for live analysis
                    </p>
                  )}
                </div>
                <UrgencyRing level={analysis.urgencyLevel} />
              </div>

              {/* Food data card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white mb-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{analysis.foodName}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">{analysis.quantity}</p>
                  </div>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', urgencyBg(analysis.urgencyLevel))}>
                    {analysis.urgencyLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  {[
                    { icon: Users,  label: 'Servings',  val: `${analysis.estimatedServings} people` },
                    { icon: Leaf,   label: 'Type',      val: analysis.dietaryType, cap: true },
                    { icon: Clock,  label: 'Safe for',  val: `${analysis.spoilageWindowHours}h` },
                    { icon: Brain,  label: 'Language',  val: analysis.detectedLanguage, violet: true },
                  ].map(({ icon: Icon, label, val, cap }) => (
                    <div key={label} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 shrink-0 text-slate-600" />
                      <span className="text-slate-600">{label}:</span>
                      <span className={`text-slate-900 font-medium ${cap ? 'capitalize' : ''}`}>{val}</span>
                    </div>
                  ))}
                </div>

                {/* Urgency reason */}
                <div className="mt-4 p-3 rounded-lg bg-orange-500/5 border border-orange-900/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-700">{analysis.urgencyReason}</p>
                </div>
              </div>

              {/* NGO Match preview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-slate-700" />
                  <span className="text-sm text-slate-800 font-medium">Gemini Best Match</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">Roti Bank Delhi</p>
                    <p className="text-xs text-slate-600 mt-0.5">2.3 km · Volunteer available · 94% confidence</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900">94%</div>
                    <div className="text-xs text-slate-600">match</div>
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-3 mb-6 p-3 rounded-xl border border-slate-200 bg-white">
                <input
                  type="checkbox"
                  checked={autoProgress}
                  onChange={(e) => setAutoProgress(e.target.checked)}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold text-slate-900">Auto-progress status flow</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    If enabled, backend simulates: Pending → Accepted by NGO → Searching for Volunteer → Completed.
                  </p>
                </div>
              </label>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 text-sm font-medium transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Re-enter
                </button>
                <button
                  onClick={submit}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-all shadow-lg shadow-slate-500/20 hover:-translate-y-0.5"
                >
                  <Send className="w-4 h-4" />
                  Confirm Donation
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STAGE: SUBMITTED ─────────────────────────────────────────── */}
          {stage === 'submitted' && (
            <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-slate-700" />
              </motion.div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Food Listed! 🎉</h2>
              <p className="text-slate-600 text-sm mb-2">
                Your donation is now pending and visible in your dashboard.
              </p>
              <p className="text-slate-800 font-medium text-sm mb-8">
                Next update: NGO acceptance and volunteer assignment
              </p>
              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="px-5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Donate More
                </button>
                <Link href="/donor" className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors">
                  View Dashboard →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
