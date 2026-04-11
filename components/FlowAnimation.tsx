'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  UtensilsCrossed,
  Brain,
  Building2,
  Bike,
  Heart,
  ShieldCheck,
  Sparkles,
  ScanLine,
} from 'lucide-react'

// ── Flow steps ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 0,
    icon: UtensilsCrossed,
    label: 'Donor',
    sub: 'Hindi / English\nmessage + photo',
    color: '#C4943A',
    bg: 'rgba(196,148,58,0.12)',
    ring: 'rgba(196,148,58,0.35)',
  },
  {
    id: 1,
    icon: Brain,
    label: 'Gemini AI',
    sub: null, // gemini node renders differently
    color: '#4285F4',
    bg: 'rgba(66,133,244,0.12)',
    ring: 'rgba(66,133,244,0.45)',
    isGemini: true,
  },
  {
    id: 2,
    icon: Building2,
    label: 'NGO',
    sub: 'Matched by AI\nRanked & notified',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.12)',
    ring: 'rgba(22,163,74,0.35)',
  },
  {
    id: 3,
    icon: Bike,
    label: 'Volunteer',
    sub: 'Route assigned\nPickup dispatched',
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.12)',
    ring: 'rgba(124,58,237,0.35)',
  },
  {
    id: 4,
    icon: Heart,
    label: 'Community',
    sub: 'Meal delivered\nHunger reduced',
    color: '#EF4444',
    bg: 'rgba(239,68,68,0.12)',
    ring: 'rgba(239,68,68,0.35)',
  },
]

const GEMINI_PILLS = [
  { icon: ScanLine,   label: 'Food Safety Check' },
  { icon: Brain,      label: 'Text Understanding' },
  { icon: Sparkles,   label: 'Smart NGO Matching' },
  { icon: ShieldCheck,label: 'Auto Reassignment' },
]

const CYCLE = 7000   // ms per full cycle
const STEP_MS = 900  // delay between step activations

// ── Particle ──────────────────────────────────────────────────────────────────
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: Math.random() * 5 + 3,
        height: Math.random() * 5 + 3,
        background: `hsl(${Math.random() * 60 + 30}, 80%, 65%)`,
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      }}
      animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.4, 0.5], y: [-8, 8, -8] }}
      transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay }}
    />
  )
}

// ── Connector line ─────────────────────────────────────────────────────────────
function Connector({ active }: { active: boolean }) {
  return (
    <div className="flex-1 flex items-center justify-center px-1 min-w-0">
      <div className="w-full h-[2px] relative overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #C4943A, #4285F4)' }}
          animate={{ width: active ? '100%' : '0%' }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FlowAnimation() {
  const [activeStep, setActiveStep] = useState(-1)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let timeouts: ReturnType<typeof setTimeout>[] = []

    const run = () => {
      setActiveStep(-1)
      STEPS.forEach((_, i) => {
        const t = setTimeout(() => setActiveStep(i), 300 + i * STEP_MS)
        timeouts.push(t)
      })
      const reset = setTimeout(() => {
        setCycle(c => c + 1)
      }, CYCLE)
      timeouts.push(reset)
    }

    run()
    return () => timeouts.forEach(clearTimeout)
  }, [cycle])

  return (
    <div className="relative w-full select-none">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <Particle key={i} delay={i * 0.4} />
        ))}
      </div>

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-xl p-5 sm:p-7">

        {/* Title */}
        <div className="text-center mb-6">
          <p className="text-[11px] font-semibold tracking-widest text-rq-amber uppercase">
            Powered by Gemini AI
          </p>
          <h3 className="mt-1 text-[18px] sm:text-[20px] font-bold text-rq-text">
            From Surplus to Served — in Minutes
          </h3>
        </div>

        {/* Pipeline row */}
        <div className="flex items-center justify-between gap-0">
          {STEPS.map((step, i) => {
            const isActive = activeStep >= i
            const Icon = step.icon

            if (step.isGemini) {
              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  {/* connector before */}
                  <Connector active={activeStep >= i} />

                  {/* Gemini node */}
                  <div className="flex flex-col items-center shrink-0 relative z-10">
                    <motion.div
                      className="relative flex flex-col items-center justify-center rounded-2xl border-2 cursor-default"
                      style={{
                        width: 74,
                        height: 74,
                        borderColor: isActive ? step.ring : 'transparent',
                        background: isActive ? step.bg : 'rgba(66,133,244,0.05)',
                        transition: 'all 0.4s',
                      }}
                      animate={isActive ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                      transition={{ duration: 1.4, repeat: isActive ? Infinity : 0 }}
                    >
                      {/* pulse ring */}
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl border-2"
                          style={{ borderColor: step.ring }}
                          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        />
                      )}
                      <Icon
                        className="w-7 h-7"
                        style={{ color: isActive ? step.color : '#9CA3AF' }}
                      />
                      <span
                        className="mt-0.5 text-[10px] font-bold"
                        style={{ color: isActive ? step.color : '#9CA3AF' }}
                      >
                        Gemini
                      </span>
                    </motion.div>
                    <span className="mt-2 text-[11px] font-semibold text-rq-text text-center leading-tight">
                      Gemini AI
                    </span>
                  </div>

                  {/* connector after */}
                  <Connector active={activeStep >= i + 1} />
                </div>
              )
            }

            return (
              <div key={step.id} className="flex items-center flex-initial">
                {/* connector before first node not needed */}
                <div className="flex flex-col items-center shrink-0 relative z-10">
                  <motion.div
                    className="relative flex items-center justify-center rounded-xl border-2 cursor-default"
                    style={{
                      width: 58,
                      height: 58,
                      borderColor: isActive ? step.ring : 'transparent',
                      background: isActive ? step.bg : 'rgba(107,114,128,0.06)',
                      transition: 'background 0.4s, borderColor 0.4s',
                    }}
                    whileHover={{ scale: 1.08 }}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border"
                        style={{ borderColor: step.ring }}
                        animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                      />
                    )}
                    <Icon
                      className="w-6 h-6 transition-colors duration-300"
                      style={{ color: isActive ? step.color : '#9CA3AF' }}
                    />
                  </motion.div>
                  <span
                    className="mt-2 text-[11px] font-semibold text-center leading-tight transition-colors duration-300"
                    style={{ color: isActive ? step.color : '#9CA3AF' }}
                  >
                    {step.label}
                  </span>
                  {/* sub text */}
                  <AnimatePresence>
                    {isActive && step.sub && (
                      <motion.span
                        key="sub"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-0.5 text-[9px] text-rq-muted text-center leading-tight whitespace-pre-line hidden sm:block"
                      >
                        {step.sub}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gemini pills — show when Gemini step is active */}
        <AnimatePresence>
          {activeStep >= 1 && (
            <motion.div
              key="pills"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.4 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              {GEMINI_PILLS.map((pill, i) => {
                const PillIcon = pill.icon
                return (
                  <motion.div
                    key={pill.label}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.12 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-medium"
                    style={{
                      borderColor: 'rgba(66,133,244,0.3)',
                      background: 'rgba(66,133,244,0.07)',
                      color: '#4285F4',
                    }}
                  >
                    <PillIcon className="w-3 h-3" />
                    {pill.label}
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <div className="mt-5 h-1 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            key={cycle}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C4943A, #4285F4, #16A34A)' }}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: CYCLE / 1000, ease: 'linear' }}
          />
        </div>
        <p className="mt-2 text-center text-[10px] text-rq-muted tracking-wide">
          Auto-playing · Every rescue looks like this
        </p>
      </div>
    </div>
  )
}
