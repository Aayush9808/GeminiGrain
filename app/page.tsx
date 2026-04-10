'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building2,
  Heart,
  Leaf,
  Sparkles,
  Utensils,
  Bike,
  Brain,
  Clock3,
  MapPin,
  ShieldCheck,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

const quickStats = [
  { value: '1,284+', label: 'Meals rescued today' },
  { value: '91%', label: 'Average AI match confidence' },
  { value: '5 min', label: 'From listing to pickup' },
]

const steps = [
  {
    icon: Utensils,
    title: 'Donor posts surplus',
    text: 'Restaurants and events list extra food in under 30 seconds.',
  },
  {
    icon: Brain,
    title: 'AI triages urgency',
    text: 'Gemini detects quantity, shelf-life risk, and best NGO match.',
  },
  {
    icon: Bike,
    title: 'Volunteer delivers fast',
    text: 'Pickup and delivery are tracked in real-time with live ETA.',
  },
]

const pillars = [
  {
    icon: Clock3,
    title: 'Built for speed',
    text: 'Frictionless flow optimized for teams that operate under time pressure.',
  },
  {
    icon: ShieldCheck,
    title: 'Reliable operations',
    text: 'Role-gated onboarding and verification keep every rescue accountable.',
  },
  {
    icon: MapPin,
    title: 'Hyperlocal matching',
    text: 'Nearest capable NGO is prioritized to minimize spoilage and transit time.',
  },
]

const roles = [
  {
    icon: Utensils,
    title: 'Food Donor',
    text: 'Hotels, hostels, events, and kitchens with surplus food.',
    accent: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Building2,
    title: 'NGO Partner',
    text: 'Shelters and community kitchens receiving rescued food.',
    accent: 'from-orange-500 to-amber-500',
  },
  {
    icon: Bike,
    title: 'Volunteer',
    text: 'Local heroes helping with pickup and doorstep delivery.',
    accent: 'from-emerald-500 to-teal-500',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-mesh min-h-screen text-rq-text">
      <Navbar />

      <main>
        <section className="relative pt-28 pb-20 sm:pt-32 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-16 left-8 w-72 h-72 rounded-full bg-slate-300/30 blur-3xl" />
            <div className="absolute top-24 right-10 w-80 h-80 rounded-full bg-slate-400/25 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 rounded-full bg-slate-500/20 blur-3xl" />
            <div className="food-carry-scene" aria-hidden="true">
              <div className="food-carry-track">
                <div className="food-carry-figure">
                  <span className="food-carry-head" />
                  <span className="food-carry-body" />
                  <span className="food-carry-arm" />
                  <span className="food-carry-box" />
                  <span className="food-carry-leg-left" />
                  <span className="food-carry-leg-right" />
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/90 backdrop-blur px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Modern food rescue platform
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.06 }}
                  className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                >
                  <span className="gradient-text">Snap. Speak. Save lives.</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12 }}
                  className="mt-5 text-base sm:text-lg text-rq-muted max-w-xl leading-relaxed"
                >
                  GeminiGrain turns donation messages into live rescue actions by matching nearby
                  donors, NGOs, and volunteers in minutes with AI-powered urgency scoring.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <Link
                    href="/auth"
                    className="inline-flex items-center gap-2 rounded-xl bg-rq-blue hover:bg-rq-blue-dim text-white px-6 py-3 font-semibold shadow-xl shadow-blue-500/20 transition-all hover:-translate-y-0.5"
                  >
                    Start now <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/live"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 hover:bg-white px-6 py-3 font-semibold text-slate-700 transition-all hover:-translate-y-0.5"
                  >
                    View live feed
                  </Link>
                </motion.div>

                <div className="mt-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {quickStats.map((stat) => (
                    <div key={stat.label} className="card-glass rounded-2xl px-4 py-3">
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs uppercase tracking-wide text-rq-subtle mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="relative"
              >
                <div className="card-glass rounded-3xl p-6 sm:p-7 border border-white/70 shadow-3d-lg">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-slate-900">Live Rescue Signal</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-2.5 py-1">
                      <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-lg">
                    <p className="text-xs text-slate-500">Incoming donation</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">40 meal boxes · pickup in 18 min</p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-slate-100 p-3">
                        <p className="text-[11px] text-slate-500">Nearest NGO</p>
                        <p className="text-sm font-medium mt-0.5 text-slate-900">Roti Bank Central</p>
                      </div>
                      <div className="rounded-xl bg-slate-100 p-3">
                        <p className="text-[11px] text-slate-500">AI confidence</p>
                        <p className="text-sm font-medium mt-0.5 text-slate-900">91%</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2.5 text-center">
                    <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                      <p className="text-xl font-bold text-slate-900">2.4km</p>
                      <p className="text-[11px] text-slate-600">Distance</p>
                    </div>
                    <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                      <p className="text-xl font-bold text-slate-900">23m</p>
                      <p className="text-[11px] text-slate-600">ETA</p>
                    </div>
                    <div className="rounded-xl bg-slate-100 border border-slate-200 p-3">
                      <p className="text-xl font-bold text-slate-900">98%</p>
                      <p className="text-[11px] text-slate-600">Freshness</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -z-10 -bottom-6 -right-6 w-40 h-40 rounded-full bg-slate-400/25 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 border-y border-slate-200/80 bg-white/70 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-700 font-semibold">How It Works</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">A crisp 3-step rescue flow</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mb-4 shadow-md shadow-slate-500/25">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-rq-muted leading-relaxed">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-6 items-start">
              <div className="rounded-3xl bg-white border border-slate-200 p-7 sm:p-9 shadow-3d-lg">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-700 font-semibold">Why GeminiGrain</p>
                <h2 className="mt-4 text-3xl sm:text-4xl font-bold leading-tight text-slate-900">
                  Designed to look simple.
                  <br />
                  Engineered to move fast.
                </h2>
                <p className="mt-4 text-slate-600 max-w-lg">
                  The UI removes clutter so donors, NGOs, and volunteers focus on action,
                  not screens. Clean visual hierarchy means fewer mistakes and faster rescues.
                </p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Leaf className="w-4 h-4" />
                  Less waste. More lives fed.
                </div>
              </div>

              <div className="grid gap-4">
                {pillars.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                        <p className="mt-1.5 text-sm text-rq-muted leading-relaxed">{item.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20 sm:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-9">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-700 font-semibold">Choose your role</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">One platform, three collaborators</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
              {roles.map((role, idx) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Link href="/auth" className="block group rounded-2xl p-[1px] bg-gradient-to-br from-slate-200 to-slate-100 hover:from-blue-400/60 hover:to-orange-400/60 transition-all">
                    <div className="rounded-2xl bg-white p-6 h-full">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.accent} text-white flex items-center justify-center shadow-md mb-4`}>
                        <role.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">{role.title}</h3>
                      <p className="mt-2 text-sm text-rq-muted leading-relaxed">{role.text}</p>
                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 group-hover:gap-3 transition-all">
                        Continue <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl border border-slate-200 bg-white/90 backdrop-blur p-8 sm:p-10 text-center shadow-3d">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 rounded-full px-3 py-1.5">
                <Heart className="w-4 h-4" />
                Save food. Serve people.
              </div>
              <h3 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-900">Ready to launch your first rescue?</h3>
              <p className="mt-3 text-rq-muted max-w-2xl mx-auto">
                Join donors, NGOs, and volunteers on one clear operational canvas.
                Beautiful interface, practical workflow, measurable impact.
              </p>
              <Link
                href="/auth"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 font-semibold transition-all"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
