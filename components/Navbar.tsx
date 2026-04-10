'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, Menu, X, ChevronDown, Phone, Search, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { UserRole } from '@/lib/types'

const roleLabel: Record<UserRole, string> = {
  donor:     'Food Donor',
  ngo:       'NGO Partner',
  volunteer: 'Volunteer',
}

const roleColor: Record<UserRole, string> = {
  donor:     'text-slate-700 bg-slate-100 border-slate-300',
  ngo:       'text-slate-700 bg-slate-100 border-slate-300',
  volunteer: 'text-slate-700 bg-slate-100 border-slate-300',
}

const roleHome: Record<UserRole, string> = {
  donor:     '/donor',
  ngo:       '/ngo',
  volunteer: '/volunteer',
}

export default function Navbar() {
  const router     = useRouter()
  const [role, setRole] = useState<UserRole | null>(null)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('rq_role') as UserRole | null
    setRole(stored)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function signOut() {
    localStorage.removeItem('rq_role')
    router.push('/')
  }

  return (
    <nav
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm'
          : 'bg-transparent py-5',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-rq-amber flex items-center justify-center shadow-lg shadow-amber-300/60">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <div>
            <div className="font-serif font-bold text-lg leading-tight text-rq-text">GeminiGrain</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-rq-subtle">Share More. Waste Less.</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {[
            { label: 'Home', href: '/' },
            { label: 'About', href: '/#about' },
            { label: 'Rescues', href: '/#rescues' },
            { label: 'Volunteer', href: '/#volunteer' },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-rq-text hover:text-rq-amber transition-colors font-medium inline-flex items-center gap-1">
              {item.label}
              <ChevronDown className="w-3.5 h-3.5 text-rq-subtle" />
            </Link>
          ))}
          {role && (
            <Link href={roleHome[role]} className="text-sm text-rq-text hover:text-rq-amber font-semibold transition-colors">
              Dashboard
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 text-sm text-rq-muted font-medium">
            <Phone className="w-4 h-4 text-rq-amber" />
            +91 98765 43210
          </div>
          <button className="w-9 h-9 rounded-full bg-white/90 text-rq-text shadow-sm flex items-center justify-center hover:text-rq-amber transition-colors" aria-label="Search">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-white/90 text-rq-text shadow-sm flex items-center justify-center hover:text-rq-amber transition-colors" aria-label="Profile">
            <User className="w-4 h-4" />
          </button>
          {role ? (
            <>
              <span className={cn('text-xs px-2.5 py-1 rounded-full border font-medium', roleColor[role])}>
                {roleLabel[role]}
              </span>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 text-sm text-rq-text hover:text-red-600 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-sm text-rq-text hover:text-rq-amber transition-colors font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/auth"
                className="pill-btn flex items-center gap-1.5 text-sm px-5 py-2.5 bg-rq-amber hover:bg-rq-amber-dim text-white transition-colors shadow-lg shadow-amber-200/70"
              >
                Donate Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-rq-text p-1"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white px-4 py-5 flex flex-col gap-3 shadow-lg">
          <Link href="/" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Home</Link>
          <Link href="/#about" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>About</Link>
          <Link href="/#rescues" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Rescues</Link>
          <Link href="/#volunteer" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Volunteer</Link>
          {role ? (
            <>
              <Link href={roleHome[role]} className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              {role === 'donor' && (
                <Link href="/donor/submit" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Donate Food</Link>
              )}
              <Link href="/live" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Live Feed</Link>
              <button onClick={signOut} className="text-sm text-red-600 text-left py-2">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/auth" className="text-sm text-rq-text py-2" onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/auth" className="pill-btn text-center text-sm text-white bg-rq-amber font-semibold py-2.5" onClick={() => setOpen(false)}>Donate Now</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
