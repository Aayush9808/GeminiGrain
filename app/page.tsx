'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BadgeDollarSign,
  Brain,
  HandHeart,
  HeartPulse,
  Play,
  ShieldCheck,
  Users,
  Utensils,
  Building2,
  Sparkles,
  Plus,
  HandHelping,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import HowItWorks from '@/components/HowItWorks'

const features = [
  {
    icon: BadgeDollarSign,
    title: 'Zero Cost',
    description: 'Donation listing, NGO matching, and volunteer coordination with no platform fees.',
  },
  {
    icon: Brain,
    title: 'AI Powered',
    description: 'Smart triage improves response speed and helps route food before spoilage.',
  },
  {
    icon: HandHeart,
    title: 'Real Impact',
    description: 'Every pickup is tracked to ensure measurable meals delivered across communities.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety First',
    description: 'Food quality prompts and verified partners keep every rescue trusted and safe.',
  },
]

const rescues = [
  {
    title: 'Community Kitchen Night Rescue',
    description: 'Surplus dinner trays redirected from a banquet hall to nearby shelters.',
    goal: '$8,000',
    raised: '$6,250',
    progress: 78,
    image:
      'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Weekend Event Food Recovery',
    description: 'Fresh packaged meals rescued after a large city-level social event.',
    goal: '$10,000',
    raised: '$7,100',
    progress: 71,
    image:
      'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Hotel Breakfast Redistribution',
    description: 'Breakfast buffet surplus distributed to three NGOs before noon.',
    goal: '$5,500',
    raised: '$4,820',
    progress: 87,
    image:
      'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80',
  },
]

const stats = [
  { icon: Utensils, value: '1.2M+', label: 'Meals Rescued' },
  { icon: Building2, value: '340+', label: 'NGOs' },
  { icon: Users, value: '68K', label: 'Volunteers' },
  { icon: Sparkles, value: '5', label: 'Cities' },
]

const volunteerPositions = [
  {
    icon: HandHelping,
    title: 'Pickup Volunteer',
    description: 'Collect food from donors and hand over safely to NGO points.',
  },
  {
    icon: Users,
    title: 'Community Coordinator',
    description: 'Coordinate calls between nearby NGOs, donors, and delivery volunteers.',
  },
  {
    icon: HeartPulse,
    title: 'Food Safety Monitor',
    description: 'Support quality checks and basic hygiene compliance during transfers.',
  },
  {
    icon: ArrowRight,
    title: 'Route Assistant',
    description: 'Help optimize delivery sequence for faster and safer last-mile handoff.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-rq-bg text-rq-text">
      <Navbar />

      <main>
        <section className="section-cream relative pt-28 sm:pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 world-map-overlay" aria-hidden="true" />
          <span className="dot-accent dot-amber top-24 left-[16%]" aria-hidden="true" />
          <span className="dot-accent dot-green top-40 right-[18%]" aria-hidden="true" />
          <span className="dot-accent dot-blue bottom-20 left-[40%]" aria-hidden="true" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-[44px] sm:text-[58px] lg:text-[68px] leading-[1.03] font-bold text-rq-text max-w-xl">
                  Every meal
                  <br />
                  saved is a
                  <br />
                  life changed.
                </h1>
                <p className="mt-6 text-[16px] text-rq-muted max-w-lg leading-relaxed">
                  We connect donors, NGOs, and volunteers to rescue safe surplus food and deliver it where it is needed most.
                </p>
                <div className="mt-8">
                  <Link
                    href="/auth"
                    className="pill-btn inline-flex items-center gap-2 bg-rq-text hover:bg-black text-white px-7 py-3.5 text-sm"
                  >
                    Donate Now
                  </Link>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute -left-10 top-8 w-7 h-7 rounded-full bg-rq-blue/20" />
                <div className="absolute right-8 bottom-8 w-10 h-10 rounded-full bg-rq-green/20" />
                <div className="relative w-[360px] h-[360px] sm:w-[430px] sm:h-[430px] rounded-[47%] overflow-hidden shadow-2xl border-[10px] border-white/90">
                  <img
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80"
                    alt="Community food support"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />

        <section className="section-white py-24" id="why">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-11">
              <p className="label-kicker">Why GeminiGrain</p>
              <h2 className="mt-4 text-[40px] leading-tight font-bold">Make a Difference</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {features.map((item) => (
                <article key={item.title} className="soft-card p-6">
                  <div className="w-11 h-11 rounded-full border border-rq-amber/35 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-rq-amber" />
                  </div>
                  <h3 className="text-[22px] font-bold text-rq-text">{item.title}</h3>
                  <p className="mt-2 text-[15px] text-rq-muted leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-cream py-24" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative min-h-[430px]">
              <span className="dot-accent dot-amber top-12 left-2" aria-hidden="true" />
              <span className="dot-accent dot-blue top-4 right-20" aria-hidden="true" />
              <span className="dot-accent dot-green bottom-12 left-24" aria-hidden="true" />

              <div className="absolute top-0 left-0 w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden shadow-2xl border-[8px] border-white">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80"
                  alt="Food rescue volunteers"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full overflow-hidden shadow-2xl border-[8px] border-white">
                <img
                  src="https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=900&q=80"
                  alt="Community meal distribution"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="label-kicker">About Us</p>
              <h2 className="mt-4 text-[40px] leading-tight font-bold">Rescuing Food with Intelligence</h2>
              <p className="mt-5 text-[18px] font-semibold text-rq-text max-w-xl leading-relaxed">
                GeminiGrain combines compassionate volunteering with intelligent coordination to reduce food waste and hunger simultaneously.
              </p>
              <p className="mt-4 text-[16px] text-rq-muted leading-relaxed max-w-xl">
                Our platform enables restaurants, events, and institutions to list safe surplus meals in minutes. NGOs and volunteers then coordinate pickup and delivery using real-time updates and guided flow stages.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/auth" className="pill-btn inline-flex items-center gap-2 bg-rq-text text-white px-6 py-3 text-sm">
                  Learn More
                </Link>
                <button className="pill-btn inline-flex items-center gap-2 bg-rq-green hover:bg-rq-green-dim text-white px-6 py-3 text-sm">
                  <Play className="w-4 h-4" />
                  Watch Video
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section-white py-24" id="rescues">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-11">
              <p className="label-kicker">Active Rescues</p>
              <h2 className="mt-4 text-[40px] leading-tight font-bold">Featured Rescues</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {rescues.map((item) => (
                <article key={item.title} className="soft-card overflow-hidden">
                  <div className="aspect-square overflow-hidden rounded-t-[12px]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 relative">
                    <div className="h-2.5 rounded-full bg-rq-border">
                      <div className="h-full rounded-full bg-rq-amber" style={{ width: `${item.progress}%` }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-rq-subtle font-medium">
                      <span>Goal: {item.goal}</span>
                      <span>Raised: {item.raised}</span>
                    </div>
                    <h3 className="mt-4 text-[24px] font-bold leading-tight">{item.title}</h3>
                    <p className="mt-2 text-[15px] text-rq-muted leading-relaxed pr-8">{item.description}</p>
                    <button className="absolute right-6 bottom-6 w-10 h-10 rounded-full bg-rq-amber text-white flex items-center justify-center hover:bg-rq-amber-dim transition-colors" aria-label="Open rescue">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-cream py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-14 h-14 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                  <item.icon className="w-6 h-6 text-rq-amber" />
                </div>
                <div className="font-serif text-[40px] leading-none font-bold text-rq-text">{item.value}</div>
                <p className="mt-2 text-sm text-rq-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section-white py-24" id="volunteer">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-11">
              <p className="label-kicker">Volunteer</p>
              <h2 className="mt-4 text-[40px] leading-tight font-bold">Volunteer Positions Available</h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {volunteerPositions.map((item) => (
                <article key={item.title} className="soft-card p-6">
                  <div className="w-11 h-11 rounded-full border border-rq-amber/35 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-rq-amber" />
                  </div>
                  <h3 className="text-[22px] font-bold text-rq-text">{item.title}</h3>
                  <p className="mt-2 text-[15px] text-rq-muted leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
