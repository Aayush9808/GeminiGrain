'use client'

import { useState } from 'react'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────────────
// DemoButton — drop it anywhere in a form page
//
// Usage:
//   <DemoButton onFill={() => applyDemoData()} />
//   <DemoButton label="Use Demo Credentials" onFill={fillDemoData} variants={[...]} />
//
// Props:
//   onFill     — called when a specific demo preset is chosen
//   variants   — optional list of named presets; if >1 a dropdown is shown
//   label      — button label (default: "Demo Mode")
//   className  — optional extra Tailwind classes
// ─────────────────────────────────────────────────────────────────────────────

export interface DemoVariant {
  label:   string
  onFill:  () => void
}

interface DemoButtonProps {
  /** Called immediately when there's only one variant */
  onFill?:    () => void
  /** Multiple presets — shows a dropdown */
  variants?:  DemoVariant[]
  label?:     string
  className?: string
}

export default function DemoButton({
  onFill,
  variants,
  label     = 'Demo Mode',
  className = '',
}: DemoButtonProps) {
  const [open, setOpen] = useState(false)

  const hasVariants = variants && variants.length > 1

  function handleClick() {
    if (hasVariants) {
      setOpen(v => !v)
    } else if (variants?.length === 1) {
      variants[0].onFill()
    } else if (onFill) {
      onFill()
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100 hover:border-amber-400 transition-all shadow-sm select-none"
      >
        <Zap className="w-3.5 h-3.5" strokeWidth={2.5} />
        {label}
        {hasVariants && (
          open
            ? <ChevronUp  className="w-3 h-3 ml-0.5" />
            : <ChevronDown className="w-3 h-3 ml-0.5" />
        )}
      </button>

      {/* Dropdown */}
      {hasVariants && open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 z-50 min-w-[180px] bg-white border border-rq-border rounded-xl shadow-xl overflow-hidden animate-fade-in">
            {variants!.map((v) => (
              <button
                key={v.label}
                type="button"
                onClick={() => { v.onFill(); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm text-rq-text hover:bg-amber-50 transition-colors flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                {v.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
