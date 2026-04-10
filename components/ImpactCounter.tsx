'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  label: string
  suffix?: string
  prefix?: string
  color?: 'green' | 'orange' | 'violet' | 'white'
  className?: string
}

export default function ImpactCounter({ value, label, suffix = '', prefix = '', color = 'green', className }: Props) {
  const [display, setDisplay] = useState(0)
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    if (triggered) return
    setTriggered(true)
    const duration = 1800
    const steps    = 60
    const step     = value / steps
    let current    = 0
    const id = setInterval(() => {
      current += step
      if (current >= value) {
        setDisplay(value)
        clearInterval(id)
      } else {
        setDisplay(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(id)
  }, [value, triggered])

  const colorMap = {
    green:  'text-emerald-400',
    orange: 'text-orange-400',
    violet: 'text-violet-400',
    white:  'text-emerald-50',
  }

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className={cn('text-3xl sm:text-4xl font-bold tabular-nums tracking-tight', colorMap[color])}>
        {prefix}{display.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-rq-muted uppercase tracking-widest text-center">{label}</div>
    </div>
  )
}
