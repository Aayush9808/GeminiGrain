'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { COMPLAINT_CATEGORY_LABELS, type ComplaintCategory } from '@/lib/complaints'

interface ComplaintModalProps {
  donationId: string
  donationName: string
  ngoId: string
  ngoName: string
  onClose: () => void
  onSubmitted?: () => void
}

const CATEGORIES = Object.entries(COMPLAINT_CATEGORY_LABELS) as [ComplaintCategory, string][]

export default function ComplaintModal({
  donationId,
  donationName,
  ngoId,
  ngoName,
  onClose,
  onSubmitted,
}: ComplaintModalProps) {
  const [category,    setCategory]    = useState<ComplaintCategory | ''>('')
  const [description, setDescription] = useState('')
  const [submitting,  setSubmitting]  = useState(false)
  const [submitted,   setSubmitted]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!category) { toast.error('Please select a category'); return }
    if (description.trim().length < 10) { toast.error('Please add more detail (min 10 chars)'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/complaints', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ donationId, ngoId, ngoName, category, description }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)
      setSubmitted(true)
      onSubmitted?.()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to submit complaint')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.35 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">File a Complaint</h2>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{donationName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">Complaint Submitted</h3>
                <p className="text-sm text-slate-600 mb-5">
                  Our team will review this within 24 hours and take appropriate action.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Issue Category <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setCategory(key)}
                        className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                          category === key
                            ? 'border-red-400 bg-red-50 text-red-800'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the issue in detail. Be specific about what went wrong…"
                    rows={4}
                    maxLength={500}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all"
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-400">Minimum 10 characters</span>
                    <span className="text-xs text-slate-400">{description.length}/500</span>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2.5">
                  ⚠️ Complaints are reviewed by our platform team. Submitting false complaints may result in account restrictions.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !category || description.trim().length < 10}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                  ) : (
                    <>Submit Complaint</>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
