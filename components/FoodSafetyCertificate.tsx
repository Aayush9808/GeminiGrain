'use client'

import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { Download, ShieldCheck } from 'lucide-react'
import type { Donation, FoodSafetyCertificate } from '@/lib/types'

type Props = {
  data: FoodSafetyCertificate
  rescue: Donation
}

export default function FoodSafetyCertificate({ data, rescue }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const certId = useRef(`RSF-${Date.now().toString(36).toUpperCase()}`)

  async function downloadCertificate() {
    const element = cardRef.current
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2, backgroundColor: null })
    const link = document.createElement('a')
    link.download = `GeminiGrain-Certificate-${certId.current}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-4 sm:p-6 shadow-3d-lg">
      <div
        ref={cardRef}
        id="certificate-card"
        className="rounded-2xl border-2 border-emerald-700 bg-[linear-gradient(135deg,#f1f8e9_0%,#ffffff_100%)] p-6 sm:p-8 font-serif"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-emerald-800 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-semibold tracking-wide uppercase text-xs">Food Safety Certificate</span>
          </div>
          <h3 className="text-2xl font-bold text-emerald-900">GeminiGrain AI Safety Certificate</h3>
          <p className="text-xs text-slate-500 mt-1">Issued by GeminiGrain AI · Powered by Google Gemini</p>
          <p className="text-[11px] text-slate-400 mt-1">Cert ID: {certId.current}</p>
        </div>

        <div
          className={`mb-5 rounded-xl px-4 py-3 text-center text-white font-bold text-lg ${
            data.safetyStatus === 'SAFE' ? 'bg-emerald-700' : data.safetyStatus === 'CAUTION' ? 'bg-amber-600' : 'bg-red-700'
          }`}
        >
          {data.safetyStatus === 'SAFE' ? 'ASSESSMENT: SAFE FOR CONSUMPTION' : data.safetyStatus === 'CAUTION' ? 'ASSESSMENT: CAUTION' : 'ASSESSMENT: UNSAFE'}
        </div>

        <table className="w-full border-collapse text-sm">
          <tbody>
            {[
              ['Food Item', rescue.foodName],
              ['Quantity', rescue.quantity],
              ['Serving Estimate', data.servingSuggestion],
              ['Cook-to-Delivery', data.timeFromCookToDelivery],
              ['Consume By', data.safeConsumptionWindow],
              ['Allergens', data.allergenWarning || 'None reported'],
            ].map(([label, value]) => (
              <tr key={label} className="border-b border-emerald-100">
                <td className="py-2 pr-3 font-semibold text-slate-600 w-1/3">{label}</td>
                <td className="py-2 text-slate-800">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 rounded-xl border-l-4 border-emerald-500 bg-emerald-50 p-3 text-sm text-slate-700">
          <strong>AI Assessment:</strong> {data.assessmentSummary}
        </div>

        <div className="mt-5 text-center text-[11px] text-slate-500 space-y-1">
          <p>{data.fssaiNote}</p>
          <p>{data.certifiedBy}</p>
          <p>Verify at geminigrain.app/cert/{certId.current}</p>
        </div>
      </div>

      <button
        onClick={downloadCertificate}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        <Download className="w-4 h-4" />
        Download Certificate
      </button>
    </div>
  )
}