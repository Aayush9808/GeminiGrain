'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import { Mic, MicOff, Type, Brain, CheckCircle, Loader2, MapPin, RotateCcw, Send, ArrowLeft, Clock, Users, Leaf, Zap, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import type { GeminiAnalysis, UrgencyLevel } from '@/lib/types'

const MapView = dynamic(() => import('@/components/MapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        <p className="text-sm text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
})

const STEPS = [
  { id:1, label:'Understanding your input...' },
  { id:2, label:'Extracting food details...' },
  { id:3, label:'Calculating spoilage window...' },
  { id:4, label:'Predicting urgency level...' },
  { id:5, label:'Scoring 4 nearby NGOs...' },
  { id:6, label:'Analysis complete!' },
]

const SAMPLES = [
  'Mere paas 40 plate biryani hai, jaldi uthwa lo',
  '30 plates of leftover paneer curry from office event',
  '50 plate shaadi ka khana hai, abhi le jao warm hai',
  'Urgent: 20kg chicken pulao, expires in 2 hours',
]

function UrgencyArc({ level }: { level: UrgencyLevel }) {
  const pct = { CRITICAL:95, HIGH:70, MEDIUM:42, LOW:18 }[level]
  const r=36, cx=44, cy=44
  const circ = Math.PI * r
  const dash = (pct/100)*circ
  const col = { CRITICAL:'#DC2626', HIGH:'#EA580C', MEDIUM:'#D97706', LOW:'#16A34A' }[level]
  const startX = cx-r, endX = cx+r

  return (
    <div className="flex flex-col items-center gap-1">
      <svg viewBox="0 0 88 52" className="w-28 h-16">
        <path d={`M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`}
          fill="none" stroke="#F3F4F6" strokeWidth="7" strokeLinecap="round"/>
        <path d={`M ${startX} ${cy} A ${r} ${r} 0 0 1 ${endX} ${cy}`}
          fill="none" stroke={col} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ filter:`drop-shadow(0 0 4px ${col}88)` }}/>
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="11" fontWeight="800" fill={col}>{level}</text>
      </svg>
    </div>
  )
}

type Stage = 'input' | 'processing' | 'result' | 'done'

export default function SubmitFood() {
  const router = useRouter()
  const [stage, setStage]         = useState<Stage>('input')
  const [tab, setTab]             = useState<'text'|'voice'>('text')
  const [text, setText]           = useState('')
  const [location, setLocation]   = useState('')
  const [listening, setListening] = useState(false)
  const [step, setStep]           = useState(-1)
  const [confidence, setConfidence] = useState(0)
  const [analysis, setAnalysis]   = useState<GeminiAnalysis|null>(null)
  const [isDemo, setIsDemo]       = useState(false)
  const [donorName, setDonorName] = useState('Anonymous Donor')
  const [selectedNGO, setSelectedNGO] = useState<string|null>(null)
  const recognitionRef = useRef<unknown>(null)

  useEffect(() => {
    const role = localStorage.getItem('rq_role')
    const name = localStorage.getItem('rq_name')
    if (role !== 'donor') { router.push('/auth'); return }
    if (name) setDonorName(name)
  }, [router])

  const toggleVoice = useCallback(() => {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { toast.error('Voice not supported in this browser'); return }
    if (listening) { (recognitionRef.current as any)?.stop(); setListening(false); return }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r: any = new SR()
    r.lang = 'hi-IN'; r.interimResults = true; r.continuous = false
    recognitionRef.current = r
    r.onstart  = () => setListening(true)
    r.onresult = (e: any) => setText(Array.from({length:e.results.length},(_,i)=>e.results[i][0].transcript).join(''))
    r.onend    = () => setListening(false)
    r.onerror  = () => { setListening(false); toast.error('Voice error') }
    r.start()
  }, [listening])

  async function analyze() {
    if (!text.trim()) { toast.error('Please describe your food'); return }
    setStage('processing')
    setStep(0)
    setConfidence(0)

    // Animate steps + confidence
    for (let i=0; i < STEPS.length-1; i++) {
      await new Promise(r => setTimeout(r, 480))
      setStep(i+1)
      setConfidence(Math.floor(((i+1)/(STEPS.length-1))*94))
    }

    try {
      const res  = await fetch('/api/gemini/analyze', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({text}) })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setAnalysis(data.data)
      setIsDemo(!!data.demo)
      setSelectedNGO('ngo-1') // Highlight best NGO on map
      setStage('result')
    } catch {
      toast.error('Analysis failed. Please try again.')
      setStage('input'); setStep(-1)
    }
  }

  async function submit() {
    if (!analysis) return
    try {
      const res  = await fetch('/api/donations', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({ donorId:'donor-1', donorName, location:location||'Delhi, India', rawInput:text, analysis }),
      })
      const data = await res.json()
      if (!data.success) throw new Error()
      setStage('done')
      toast.success('Food listed! NGO has been notified.')
    } catch {
      toast.error('Submission failed. Please try again.')
    }
  }

  function reset() {
    setStage('input'); setStep(-1); setConfidence(0)
    setText(''); setLocation(''); setAnalysis(null); setSelectedNGO(null)
  }

  const urgColors: Record<string,string> = { CRITICAL:'#DC2626',HIGH:'#EA580C',MEDIUM:'#D97706',LOW:'#16A34A' }
  const urgBgs:    Record<string,string> = { CRITICAL:'#FEF2F2',HIGH:'#FFF7ED',MEDIUM:'#FFFBEB',LOW:'#F0FDF4' }

  return (
    <div className="h-screen overflow-hidden bg-white flex flex-col">
      <Navbar />

      {/* Split screen */}
      <div className="flex flex-1 mt-16 overflow-hidden">

        {/* ── LEFT: Map ─────────────────────────────────────────────── */}
        <div className="relative flex-1 bg-gray-100 hidden md:block">
          <MapView selectedNGOId={selectedNGO} analyzing={stage==='processing'} />

          {/* Info overlay on input stage */}
          {stage === 'input' && (
            <div className="absolute top-4 left-4 z-[999] bg-white rounded-xl shadow-card border border-gray-100 p-3 max-w-[200px]">
              <p className="text-xs font-semibold text-gray-700 mb-1">4 NGOs nearby</p>
              <p className="text-xs text-gray-500">Describe your food — AI will select the best match</p>
            </div>
          )}

          {/* After result: NGO selected banner */}
          {stage === 'result' && selectedNGO && (
            <motion.div initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}
              className="absolute top-4 left-4 right-4 z-[999] bg-white rounded-xl shadow-card-md border border-green-200 p-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-green-600"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-green-800">AI Selected NGO</p>
                  <p className="text-xs text-gray-500 truncate">Roti Bank Delhi · 2.3 km · 94% match</p>
                </div>
                <div className="text-lg font-black text-green-600 shrink-0">94%</div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: AI Panel ────────────────────────────────────────── */}
        <div className="w-full md:w-[420px] md:min-w-[420px] border-l border-gray-100 overflow-y-auto flex flex-col bg-white">

          {/* Panel header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <Link href="/donor" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-4 h-4"/>
            </Link>
            <div>
              <h1 className="text-base font-bold text-gray-900">Donate Surplus Food</h1>
              <p className="text-xs text-gray-500">Gemini AI processes your description</p>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 px-6 py-5">
            <AnimatePresence mode="wait">

              {/* ── STAGE: INPUT ──────────────────────────────────── */}
              {stage === 'input' && (
                <motion.div key="input" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}>

                  {/* Input mode tabs */}
                  <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-4">
                    {(['text','voice'] as const).map(t => (
                      <button key={t} onClick={()=>setTab(t)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                          tab===t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                        {t==='text' ? <Type className="w-3.5 h-3.5"/> : <Mic className="w-3.5 h-3.5"/>}
                        {t==='text' ? 'Type' : 'Voice'}
                      </button>
                    ))}
                  </div>

                  {tab === 'text' && (
                    <textarea value={text} onChange={e=>setText(e.target.value)}
                      placeholder="Describe your food in Hindi or English...&#10;e.g. Mere paas 40 plate biryani hai, jaldi uthwa lo"
                      rows={4} className="textarea mb-3"/>
                  )}

                  {tab === 'voice' && (
                    <div className="flex flex-col items-center gap-3 py-8 bg-gray-50 rounded-2xl border border-gray-200 mb-4">
                      <button onClick={toggleVoice}
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          listening ? 'bg-red-500 shadow-lg shadow-red-500/30' : 'bg-green-50 border-2 border-green-300 hover:bg-green-100'}`}>
                        {listening && <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60"/>}
                        {listening ? <MicOff className="w-6 h-6 text-white relative z-10"/> : <Mic className="w-6 h-6 text-green-600"/>}
                      </button>
                      <p className="text-xs text-gray-500">{listening ? 'Listening… speak in Hindi or English' : 'Tap to speak'}</p>
                      {text && <div className="w-full px-4 py-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-700 mx-4">{text}</div>}
                    </div>
                  )}

                  <div className="relative mb-4">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"/>
                    <input value={location} onChange={e=>setLocation(e.target.value)}
                      placeholder="Location (optional) — e.g. Connaught Place, Delhi"
                      className="input pl-9 text-xs"/>
                  </div>

                  {/* Sample prompts */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Try a sample:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SAMPLES.map(s => (
                        <button key={s} onClick={()=>setText(s)}
                          className="text-[11px] px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-600 hover:text-gray-900 transition-colors">
                          {s.slice(0,36)}…
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={analyze} disabled={!text.trim()}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      text.trim() ? 'bg-green-600 hover:bg-green-700 text-white hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    style={text.trim() ? { boxShadow:'0 4px 16px rgba(22,163,74,0.3)' } : {}}>
                    <Brain className="w-4 h-4"/> Analyze with Gemini
                  </button>
                </motion.div>
              )}

              {/* ── STAGE: PROCESSING ─────────────────────────────── */}
              {stage === 'processing' && (
                <motion.div key="processing" initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}} exit={{opacity:0}} className="py-4">
                  <div className="text-center mb-6">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-3">
                      <Brain className="w-7 h-7 text-violet-600"/>
                    </div>
                    <h2 className="text-base font-bold text-gray-900">Gemini is thinking…</h2>
                    <p className="text-xs text-gray-500 mt-1">Extracting structured data from your description</p>
                  </div>

                  {/* Confidence bar */}
                  <div className="mb-5 p-3 bg-violet-50 rounded-xl border border-violet-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-violet-700">AI Confidence</span>
                      <span className="text-sm font-black text-violet-700">{confidence}%</span>
                    </div>
                    <div className="h-2 bg-violet-100 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-violet-500 rounded-full" style={{ width:`${confidence}%` }}
                        transition={{ duration:0.4 }}/>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    {STEPS.map((s,i) => (
                      <div key={s.id} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all duration-500 ${
                        i < step  ? 'border-green-100 bg-green-50' :
                        i === step ? 'border-violet-200 bg-violet-50' :
                        'border-transparent opacity-20'}`}>
                        {i < step  ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0"/> :
                         i === step ? <Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0"/> :
                         <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0"/>}
                        <span className={`text-xs font-medium ${i < step ? 'text-green-700' : i===step ? 'text-violet-700' : 'text-gray-400'}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Input preview */}
                  <div className="mt-5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1">Input</p>
                    <p className="text-xs text-gray-700 font-mono">{text.slice(0,100)}{text.length>100?'…':''}</p>
                  </div>
                </motion.div>
              )}

              {/* ── STAGE: RESULT ─────────────────────────────────── */}
              {stage === 'result' && analysis && (
                <motion.div key="result" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>

                  {/* Result header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500"/>
                      <h2 className="text-base font-bold text-gray-900">Analysis Complete</h2>
                    </div>
                    <UrgencyArc level={analysis.urgencyLevel}/>
                  </div>

                  {isDemo && (
                    <div className="mb-3 px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-xl text-[11px] text-violet-700 font-semibold">
                      Demo mode — add GEMINI_API_KEY for live AI
                    </div>
                  )}

                  {/* Food card */}
                  <div className="rounded-2xl border p-4 mb-4" style={{ background:urgBgs[analysis.urgencyLevel], borderColor:urgColors[analysis.urgencyLevel]+'33' }}>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{analysis.foodName}</h3>
                        <p className="text-xs text-gray-600 mt-0.5">{analysis.quantity}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white shrink-0"
                        style={{ background:urgColors[analysis.urgencyLevel] }}>
                        {analysis.urgencyLevel}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
                      {[
                        { icon:Users,  label:'Serves',    val:`${analysis.estimatedServings} people` },
                        { icon:Leaf,   label:'Type',      val:analysis.dietaryType },
                        { icon:Clock,  label:'Safe for',  val:`${analysis.spoilageWindowHours}h` },
                        { icon:Brain,  label:'Language',  val:analysis.detectedLanguage, violet:true },
                      ].map(({icon:Icon,label,val,violet}) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 shrink-0 ${violet ? 'text-violet-500' : 'text-gray-500'}`}/>
                          <span className="text-gray-500">{label}:</span>
                          <span className="font-semibold text-gray-800 capitalize truncate">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Urgency reason */}
                  <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-100 rounded-xl mb-4 text-xs text-orange-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5"/>
                    {analysis.urgencyReason}
                  </div>

                  {/* NGO Match */}
                  <div className="rounded-xl border border-green-200 bg-green-50 p-4 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 mb-2.5">
                      <Zap className="w-3.5 h-3.5"/> Gemini Best Match
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">Roti Bank Delhi</p>
                        <p className="text-xs text-gray-500 mt-0.5">2.3 km · Volunteer ready · Open now</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">Map updated →</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-green-600">94%</div>
                        <div className="text-[10px] text-gray-400">confidence</div>
                      </div>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="relative mb-5">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"/>
                    <input value={location} onChange={e=>setLocation(e.target.value)}
                      placeholder="Confirm pickup location"
                      className="input pl-9 text-xs"/>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={reset}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                      <RotateCcw className="w-4 h-4"/> Re-enter
                    </button>
                    <button onClick={submit}
                      className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-all hover:-translate-y-0.5 flex items-center justify-center gap-1.5"
                      style={{ boxShadow:'0 4px 16px rgba(22,163,74,0.3)' }}>
                      <Send className="w-4 h-4"/> Confirm Donation
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── STAGE: DONE ───────────────────────────────────── */}
              {stage === 'done' && (
                <motion.div key="done" initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} className="py-8 text-center">
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200}}
                    className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="w-10 h-10 text-green-500"/>
                  </motion.div>
                  <h2 className="text-xl font-black text-gray-900 mb-2">Food Listed!</h2>
                  <p className="text-gray-500 text-sm mb-1">Your donation has been matched.</p>
                  <p className="text-green-600 font-semibold text-sm mb-6">Estimated pickup: 18–30 minutes</p>
                  <div className="flex gap-3">
                    <button onClick={reset}
                      className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                      Donate More
                    </button>
                    <Link href="/donor"
                      className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-colors text-center">
                      View Dashboard →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}
