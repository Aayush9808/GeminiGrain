'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Leaf, Brain, MapPin, Zap, CheckCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  useEffect(() => {
    if (!inView) return
    const dur = 1800, start = Date.now()
    const t = setInterval(() => {
      const p = Math.min((Date.now()-start)/dur,1)
      setCount(Math.floor((1-Math.pow(1-p,3))*target))
      if(p>=1) clearInterval(t)
    }, 16)
    return () => clearInterval(t)
  }, [inView, target])
  return <span ref={ref}>{count.toLocaleString('en-IN')}{suffix}</span>
}

function AIHeroCard() {
  const [step, setStep] = useState(0)
  const steps = [
    { text: 'Analyzing: "40 plate biryani ready hai"', color: '#7C3AED', bg: '#F5F3FF' },
    { text: 'Urgency detected: HIGH  3h window',       color: '#EA580C', bg: '#FFF7ED' },
    { text: 'Scoring 4 nearby NGOs...',                color: '#2563EB', bg: '#EFF6FF' },
    { text: 'Best match: Roti Bank  94% confidence',   color: '#16A34A', bg: '#F0FDF4' },
  ]
  useEffect(() => {
    const id = setInterval(() => setStep(s => (s+1)%(steps.length+1)), 1700)
    return () => clearInterval(id)
  }, [steps.length])

  return (
    <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
      className="w-full max-w-[360px] bg-white rounded-3xl border border-gray-100 p-5 animate-float"
      style={{ boxShadow:'0 20px 60px -12px rgba(0,0,0,0.15)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
          <Brain className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Gemini 1.5 Flash</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-600 font-medium">Processing</span>
          </div>
        </div>
        <div className="ml-auto text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">LIVE</div>
      </div>
      <div className="bg-gray-50 rounded-xl px-3.5 py-2.5 mb-4 font-mono text-xs text-gray-600 border border-gray-100">
        "Mere paas 40 plate biryani hai, jaldi uthwa lo"
      </div>
      <div className="space-y-1.5">
        {steps.map((s,i) => (
          <div key={i} className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-all duration-500"
            style={i===step ? { background:s.bg } : { opacity: i<step ? 1 : 0.2 }}>
            {i<step ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0"/> :
             i===step ? <div className="w-4 h-4 rounded-full border-2 shrink-0 animate-spin"
               style={{ borderColor:s.color, borderTopColor:'transparent' }}/> :
             <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0"/>}
            <span className="text-xs" style={{ color: i<=step ? (i<step?'#374151':s.color) : '#D1D5DB' }}>{s.text}</span>
          </div>
        ))}
      </div>
      {step >= steps.length && (
        <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
          className="mt-3 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-green-800">Match confirmed!</p>
            <p className="text-xs text-green-600 mt-0.5">Roti Bank  2.3 km  18 min pickup</p>
          </div>
          <div className="text-2xl font-black text-green-600">94%</div>
        </motion.div>
      )}
    </motion.div>
  )
}

const STEPS = [
  { n:'01', icon:Brain,   colorCls:'text-violet-600', bgCls:'bg-violet-50', title:'Speak to Gemini',    desc:'Describe food in Hindi or English. Gemini understands quantity, urgency, and dietary type instantly.' },
  { n:'02', icon:MapPin,  colorCls:'text-green-600',  bgCls:'bg-green-50',  title:'AI Matches Instantly', desc:'Gemini calculates spoilage risk and location to find the perfect NGO within seconds.' },
  { n:'03', icon:Zap,     colorCls:'text-orange-600', bgCls:'bg-orange-50', title:'Food is Rescued',    desc:'A nearby volunteer is dispatched. Track the entire journey live on the interactive map.' },
]
const ROLES = [
  { role:'donor',     emoji:'🍱', label:'Food Donor',   desc:'Restaurants, events & households', hover:'hover:border-green-400 hover:bg-green-50'  },
  { role:'ngo',       emoji:'🏥', label:'NGO Partner',  desc:'Shelters, orphanages, kitchens',   hover:'hover:border-amber-400 hover:bg-amber-50'  },
  { role:'volunteer', emoji:'🛵', label:'Volunteer',    desc:'Help with pickup & delivery',      hover:'hover:border-orange-400 hover:bg-orange-50' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-24 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold mb-6">
              <Brain className="w-3.5 h-3.5" /> Powered by Google Gemini AI
            </div>
            <h1 className="text-5xl lg:text-[58px] font-black text-gray-950 leading-[1.04] tracking-tight mb-5">
              Bridging the Gap<br/>Between Food<br/>
              <span className="gradient-text">Waste &amp; Hunger</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-[440px]">
              194 million Indians sleep hungry while 40% of food is wasted.
              ResQFood AI bridges this gap — intelligently, in real time.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <Link href="/auth" className="flex items-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 text-sm"
                style={{ boxShadow:'0 4px 16px rgba(22,163,74,0.3)' }}>
                Donate Food Now <ArrowRight className="w-4 h-4"/>
              </Link>
              <Link href="/live" className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-2xl transition-colors text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> Live Feed
              </Link>
            </div>
            <p className="text-sm text-gray-400 flex items-center gap-4">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500"/> Free forever</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500"/> Works in Hindi</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-500"/> No sign-up</span>
            </p>
          </motion.div>
          <div className="flex justify-center lg:justify-end"><AIHeroCard /></div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-600 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{v:12847,s:'+',l:'Meals Rescued'},{v:342,s:'kg',l:'CO2 Avoided'},{v:34,s:'',l:'NGOs Online'},{v:98,s:'%',l:'Match Success'}].map(({v,s,l}) => (
            <div key={l}><div className="text-3xl font-black text-white"><Counter target={v} suffix={s}/></div><div className="text-green-200 text-sm mt-1">{l}</div></div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-3">Three Steps. Zero Waste.</h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">From surplus food to hungry mouths — all driven by Gemini AI</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(({n,icon:Icon,colorCls,bgCls,title,desc},i) => (
              <motion.div key={n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-card">
                <div className={`w-11 h-11 rounded-xl ${bgCls} flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${colorCls}`}/>
                </div>
                <div className="text-xs font-mono font-semibold text-gray-400 mb-2">STEP {n}</div>
                <h3 className="font-bold text-gray-900 mb-2 text-base">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Who Is It For?</h2>
          <p className="text-gray-500 text-sm">Three roles, one platform, one mission.</p>
        </div>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-5">
          {ROLES.map(({role,emoji,label,desc,hover}) => (
            <Link key={role} href={`/auth?role=${role}`}
              className={`group bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-card transition-all duration-200 card-hover ${hover}`}>
              <div className="text-4xl mb-4">{emoji}</div>
              <h3 className="font-bold text-gray-900 mb-1 text-base">{label}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-green-600 group-hover:gap-2 transition-all">
                Get Started <ArrowRight className="w-3.5 h-3.5"/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-gray-950 text-center">
        <div className="max-w-xl mx-auto">
          <div className="text-5xl mb-5">🍱</div>
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">
            Food is going to waste<br/><span className="gradient-text">right now.</span>
          </h2>
          <p className="text-gray-400 mb-8 text-sm leading-relaxed">Join 500+ donors rescuing food in your city.</p>
          <Link href="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-bold rounded-2xl transition-all hover:-translate-y-0.5 text-sm"
            style={{ boxShadow:'0 4px 20px rgba(74,222,128,0.35)' }}>
            Start Rescuing Food →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white"/>
            </div>
            <span className="font-bold text-sm text-gray-800">ResQ<span className="text-green-600">Food</span></span>
          </div>
          <p className="text-xs text-gray-400">Built for HackDays 2026  GCET x HackBase x MLH  Powered by Google Gemini AI</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <Link href="/live" className="hover:text-gray-700">Live Feed</Link>
            <Link href="/auth" className="hover:text-gray-700">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
