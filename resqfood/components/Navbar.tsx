'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Leaf, Menu, X, LogOut, Activity } from 'lucide-react'

const NAV_LINKS = [
  { href: '/live',   label: 'Live Feed' },
]

const ROLE_BADGES: Record<string, { label: string; color: string; href: string }> = {
  donor:     { label: 'Donor',     color: 'bg-green-100 text-green-700',   href: '/donor' },
  ngo:       { label: 'NGO',       color: 'bg-amber-100 text-amber-700',   href: '/ngo' },
  volunteer: { label: 'Volunteer', color: 'bg-orange-100 text-orange-700', href: '/volunteer' },
}

export default function Navbar() {
  const [role, setRole]       = useState<string | null>(null)
  const [name, setName]       = useState<string | null>(null)
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router   = useRouter()

  useEffect(() => {
    setRole(localStorage.getItem('rq_role'))
    setName(localStorage.getItem('rq_name'))
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  function logout() {
    localStorage.removeItem('rq_role')
    localStorage.removeItem('rq_name')
    router.push('/auth')
  }

  const badge = role ? ROLE_BADGES[role] : null

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center shadow-green">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-[15px] tracking-tight">
            ResQ<span className="text-green-600">Food</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === href ? 'text-green-600' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {href === '/live' && (
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              )}
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {badge && role ? (
            <>
              <Link href={badge.href} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badge.color}`}>
                {name ?? badge.label}
              </Link>
              {role === 'donor' && (
                <Link href="/donor/submit" className="btn btn-primary text-xs px-3 py-2">
                  + Donate Food
                </Link>
              )}
              <button onClick={logout} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link href="/auth" className="text-sm font-semibold px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors shadow-green">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-gray-100">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 hover:text-green-600">
              {label}
            </Link>
          ))}
          {!role && (
            <Link href="/auth" onClick={() => setOpen(false)}
              className="block w-full text-center py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl mt-2">
              Get Started
            </Link>
          )}
          {role && (
            <button onClick={logout} className="block w-full text-left py-2.5 text-sm text-red-500">
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
