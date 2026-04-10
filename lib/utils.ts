import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { UrgencyLevel, DonationStatus } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function urgencyColor(level: UrgencyLevel): string {
  return {
    CRITICAL: 'text-red-700',
    HIGH:     'text-orange-700',
    MEDIUM:   'text-amber-700',
    LOW:      'text-emerald-700',
  }[level]
}

export function urgencyBg(level: UrgencyLevel): string {
  return {
    CRITICAL: 'bg-red-500/15 border-red-500/30',
    HIGH:     'bg-orange-500/15 border-orange-500/30',
    MEDIUM:   'bg-yellow-500/15 border-yellow-500/30',
    LOW:      'bg-emerald-500/15 border-emerald-500/30',
  }[level]
}

export function urgencyDot(level: UrgencyLevel): string {
  return {
    CRITICAL: 'bg-red-400',
    HIGH:     'bg-orange-400',
    MEDIUM:   'bg-yellow-400',
    LOW:      'bg-emerald-400',
  }[level]
}

export function urgencyPercent(level: UrgencyLevel): number {
  return { CRITICAL: 95, HIGH: 70, MEDIUM: 40, LOW: 15 }[level]
}

export function statusColor(s: DonationStatus): string {
  return {
    PENDING:    'text-violet-700',
    ACCEPTED_BY_NGO: 'text-blue-700',
    SEARCHING_VOLUNTEER: 'text-amber-700',
    IN_TRANSIT: 'text-orange-700',
    COMPLETED:  'text-emerald-700',
  }[s]
}

export function statusBg(s: DonationStatus): string {
  return {
    PENDING:    'bg-violet-500/15 border-violet-500/30',
    ACCEPTED_BY_NGO: 'bg-blue-500/15 border-blue-500/30',
    SEARCHING_VOLUNTEER: 'bg-yellow-500/15 border-yellow-500/30',
    IN_TRANSIT: 'bg-orange-500/15 border-orange-500/30',
    COMPLETED:  'bg-emerald-500/15 border-emerald-500/30',
  }[s]
}

export function statusLabel(s: DonationStatus): string {
  return {
    PENDING:    'Pending',
    ACCEPTED_BY_NGO: 'Accepted by NGO',
    SEARCHING_VOLUNTEER: 'Searching for Volunteer',
    IN_TRANSIT: 'In Transit',
    COMPLETED:  'Completed',
  }[s]
}

export function timeAgo(date: Date | string): string {
  const d = new Date(date)
  const diff = Date.now() - d.getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function expiresIn(createdAt: Date | string, windowHours: number): string {
  const created     = new Date(createdAt).getTime()
  const expiresAt   = created + windowHours * 3_600_000
  const remaining   = expiresAt - Date.now()
  if (remaining <= 0) return 'Expired'
  const h = Math.floor(remaining / 3_600_000)
  const m = Math.floor((remaining % 3_600_000) / 60_000)
  if (h > 0) return `${h}h ${m}m left`
  return `${m}m left`
}

export function co2Saved(servings: number): number {
  return Math.round(servings * 0.2 * 10) / 10
}
