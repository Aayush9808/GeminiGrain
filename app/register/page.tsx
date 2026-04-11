'use client'

import { useState, useRef } from 'react'
import { useRouter }        from 'next/navigation'
import toast                from 'react-hot-toast'
import {
  User, Building2, Truck,
  Phone, ShieldCheck, FileText,
  Upload, CheckCircle2, ChevronRight,
  ChevronLeft, Loader2, Eye, EyeOff,
  AlertCircle,
} from 'lucide-react'
import { useAuth, getRoleDashboard } from '@/lib/auth-context'
import type { UserRole, DonorSubtype } from '@/lib/auth/types'
import DemoButton, { type DemoVariant } from '@/components/DemoButton'
import {
  DEMO_INDIVIDUAL_DONOR, DEMO_ORG_DONOR,
  DEMO_VOLUNTEER, DEMO_NGO, DEMO_OTP,
} from '@/lib/demo-data'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type Step = 'role' | 'details' | 'otp' | 'document' | 'upload' | 'success'

interface FormState {
  // Step 1
  role:    UserRole    | ''
  subtype: DonorSubtype | ''

  // Step 2 — all roles share phone + email
  phone: string
  email: string

  // Individual donor / volunteer
  name: string
  address: string

  // Organization donor
  organizationName: string
  ownerName: string

  // NGO
  ngoName: string
  contactPerson: string
  estimatedVolunteers: string

  // Step 3 — OTP
  otp: string
  demoOtp: string

  // Step 4 — document
  docType:  'aadhaar' | 'pan'
  docValue: string
  docVerified: boolean
  docMasked: string

  // Step 5 — file upload
  uploadedUrl: string
}

const INITIAL: FormState = {
  role: '', subtype: '',
  phone: '', email: '',
  name: '', address: '',
  organizationName: '', ownerName: '',
  ngoName: '', contactPerson: '', estimatedVolunteers: '',
  otp: '', demoOtp: '',
  docType: 'aadhaar', docValue: '', docVerified: false, docMasked: '',
  uploadedUrl: '',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const STEPS: Step[] = ['role', 'details', 'otp', 'document', 'upload', 'success']

function needsUpload(role: UserRole | '', subtype: DonorSubtype | ''): boolean {
  return role === 'ngo' || (role === 'donor' && subtype === 'organization')
}

function stepLabel(s: Step): string {
  return {
    role: 'Role', details: 'Details', otp: 'Verify Phone',
    document: 'ID Verification', upload: 'Documents', success: 'Done',
  }[s]
}

function visibleSteps(role: UserRole | '', subtype: DonorSubtype | ''): Step[] {
  const base: Step[] = ['role', 'details', 'otp', 'document']
  if (needsUpload(role, subtype)) base.push('upload')
  base.push('success')
  return base
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router        = useRouter()
  const { login }     = useAuth()
  const fileRef       = useRef<HTMLInputElement>(null)

  const [form,    setForm]    = useState<FormState>(INITIAL)
  const [step,    setStep]    = useState<Step>('role')
  const [loading, setLoading] = useState(false)
  const [errors,  setErrors]  = useState<Partial<Record<keyof FormState, string>>>({})

  // Derived
  const steps = visibleSteps(form.role, form.subtype)
  const stepIdx = steps.indexOf(step)

  function updateField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: undefined }))
  }

  // ── Demo fill ──────────────────────────────────────────────────────────────

  function applyDemo(preset: typeof DEMO_INDIVIDUAL_DONOR | typeof DEMO_ORG_DONOR | typeof DEMO_VOLUNTEER | typeof DEMO_NGO) {
    setErrors({})
    if (preset.role === 'donor') {
      const sub = (preset as typeof DEMO_INDIVIDUAL_DONOR | typeof DEMO_ORG_DONOR).subtype
      if (sub === 'individual') {
        const d = preset as typeof DEMO_INDIVIDUAL_DONOR
        setForm({ ...INITIAL, role: 'donor', subtype: 'individual', phone: d.phone, email: d.email, name: d.name, address: d.address, docType: d.docType, docValue: d.docValue, otp: DEMO_OTP, demoOtp: DEMO_OTP })
      } else {
        const d = preset as typeof DEMO_ORG_DONOR
        setForm({ ...INITIAL, role: 'donor', subtype: 'organization', phone: d.phone, email: d.email, organizationName: d.organizationName, ownerName: d.ownerName, address: d.address, docType: d.docType, docValue: d.docValue, otp: DEMO_OTP, demoOtp: DEMO_OTP })
      }
    } else if (preset.role === 'volunteer') {
      const d = preset as typeof DEMO_VOLUNTEER
      setForm({ ...INITIAL, role: 'volunteer', phone: d.phone, email: d.email, name: d.name, address: d.address, docType: d.docType, docValue: d.docValue, otp: DEMO_OTP, demoOtp: DEMO_OTP })
    } else {
      const d = preset as typeof DEMO_NGO
      setForm({ ...INITIAL, role: 'ngo', phone: d.phone, email: d.email, ngoName: d.ngoName, contactPerson: d.contactPerson, address: d.address, estimatedVolunteers: d.estimatedVolunteers, docType: d.docType, docValue: d.docValue, otp: DEMO_OTP, demoOtp: DEMO_OTP })
    }
    setStep('role')
    toast.success('Demo data loaded! Click Continue on each step.')
  }

  const demoVariants: DemoVariant[] = [
    { label: 'Individual Donor',   onFill: () => applyDemo(DEMO_INDIVIDUAL_DONOR) },
    { label: 'Organization Donor', onFill: () => applyDemo(DEMO_ORG_DONOR) },
    { label: 'Volunteer',          onFill: () => applyDemo(DEMO_VOLUNTEER) },
    { label: 'NGO / Charity',      onFill: () => applyDemo(DEMO_NGO) },
  ]

  function addError(k: keyof FormState, msg: string) {
    setErrors(e => ({ ...e, [k]: msg }))
  }

  // ── Step navigation ────────────────────────────────────────────────────────

  function goBack() {
    const prev = steps[stepIdx - 1]
    if (prev) setStep(prev)
  }

  // ── Validate step 2 fields ─────────────────────────────────────────────────

  function validateDetails(): boolean {
    let ok = true
    const phone = form.phone.replace(/\s/g, '')
    if (!/^[6-9]\d{9}$/.test(phone)) {
      addError('phone', 'Enter a valid 10-digit Indian mobile number.')
      ok = false
    }
    if (!form.email.includes('@')) {
      addError('email', 'Enter a valid email address.')
      ok = false
    }
    if (!form.address.trim()) {
      addError('address', 'Address is required.')
      ok = false
    }

    if (form.role === 'donor' && form.subtype === 'individual') {
      if (!form.name.trim()) { addError('name', 'Full name is required.'); ok = false }
    } else if (form.role === 'donor' && form.subtype === 'organization') {
      if (!form.organizationName.trim()) { addError('organizationName', 'Organization name is required.'); ok = false }
      if (!form.ownerName.trim())        { addError('ownerName', 'Owner name is required.'); ok = false }
    } else if (form.role === 'volunteer') {
      if (!form.name.trim()) { addError('name', 'Full name is required.'); ok = false }
    } else if (form.role === 'ngo') {
      if (!form.ngoName.trim())        { addError('ngoName', 'NGO name is required.'); ok = false }
      if (!form.contactPerson.trim())  { addError('contactPerson', 'Contact person name is required.'); ok = false }
    }
    return ok
  }

  // ── API calls ──────────────────────────────────────────────────────────────

  async function handleSendOTP() {
    if (!validateDetails()) return
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: form.phone.replace(/\s/g, '') }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.message); return }
      updateField('demoOtp', data.demo_otp ?? '')
      toast.success('OTP sent!')
      setStep('otp')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyOTP() {
    if (form.otp.length !== 6) { addError('otp', 'Enter the 6-digit OTP.'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: form.phone.replace(/\s/g, ''), otp: form.otp }),
      })
      const data = await res.json()
      if (!data.success) { addError('otp', data.message); return }
      toast.success('Phone verified!')
      setStep('document')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyDocument() {
    if (!form.docValue.trim()) { addError('docValue', 'Enter your document number.'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/auth/verify-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: form.phone.replace(/\s/g, ''),
          type:  form.docType,
          value: form.docValue,
        }),
      })
      const data = await res.json()
      if (!data.success) { addError('docValue', data.message); return }
      updateField('docVerified', true)
      updateField('docMasked',   data.maskedValue)
      toast.success(data.message)
    } catch {
      toast.error('Verification failed. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const phone = form.phone.replace(/\s/g, '')
    const type  = form.role === 'ngo' ? 'ngo_certificate' : 'fssai'
    const formData = new FormData()
    formData.append('file',        file)
    formData.append('type',        type)
    formData.append('phoneNumber', phone)
    setLoading(true)
    try {
      const res  = await fetch('/api/uploads', { method: 'POST', body: formData })
      const data = await res.json()
      if (!data.success) { toast.error(data.message); return }
      updateField('uploadedUrl', data.url)
      toast.success('Document uploaded!')
    } catch {
      toast.error('Upload failed. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister() {
    setLoading(true)
    try {
      const phone = form.phone.replace(/\s/g, '')

      // Build role-specific details payload
      let details: Record<string, unknown> = { email: form.email, address: form.address }
      if (form.role === 'donor' && form.subtype === 'individual') {
        details = { ...details, name: form.name }
      } else if (form.role === 'donor' && form.subtype === 'organization') {
        details = { ...details, organizationName: form.organizationName, ownerName: form.ownerName }
      } else if (form.role === 'volunteer') {
        details = { ...details, name: form.name }
      } else if (form.role === 'ngo') {
        details = { ...details, ngoName: form.ngoName, contactPerson: form.contactPerson, estimatedVolunteers: form.estimatedVolunteers }
      }

      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone, role: form.role, subtype: form.subtype || undefined, details }),
      })
      const data = await res.json()
      if (!data.success) { toast.error(data.message); return }
      login(data.token, data.user)
      toast.success('Welcome to GeminiGrain! 🌾')
      setStep('success')
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Continue button logic ──────────────────────────────────────────────────

  async function handleContinue() {
    if (step === 'role') {
      if (!form.role) { toast.error('Please select a role.'); return }
      if (form.role === 'donor' && !form.subtype) { toast.error('Please select donor type.'); return }
      setStep('details')
    } else if (step === 'details') {
      await handleSendOTP()
    } else if (step === 'otp') {
      await handleVerifyOTP()
    } else if (step === 'document') {
      // If user presses Enter / Continue while doc is unverified, auto-trigger verification
      if (!form.docVerified) {
        await handleVerifyDocument()
        return
      }
      if (needsUpload(form.role, form.subtype)) setStep('upload')
      else await handleRegister()
    } else if (step === 'upload') {
      await handleRegister()
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-rq-bg flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-rq-muted hover:text-rq-text mb-3 transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
          Back to Home
        </a>
        <div className="flex justify-center mb-3">
          <a href="/" className="inline-block transition-opacity hover:opacity-80">
            <img src="/logo.png" alt="GeminiGrain Logo" style={{width: '180px', height: 'auto'}} className="object-contain" />
          </a>
        </div>
        <p className="text-rq-muted text-sm">Create your account — it takes under 2 minutes</p>
        <div className="mt-3 flex justify-center">
          <DemoButton label="Use Demo Credentials" variants={demoVariants} />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="w-full max-w-lg mb-6">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < stepIdx  ? 'bg-rq-green text-white' :
                  i === stepIdx ? 'bg-rq-amber text-white scale-110 shadow-md' :
                  'bg-rq-border text-rq-muted'
                }`}>
                  {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] hidden sm:block ${i === stepIdx ? 'text-rq-amber font-semibold' : 'text-rq-muted'}`}>
                  {stepLabel(s)}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 transition-all ${i < stepIdx ? 'bg-rq-green' : 'bg-rq-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card */}
      <form
        onSubmit={e => { e.preventDefault(); handleContinue() }}
        noValidate
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-rq-border p-8 animate-fade-in"
      >

        {/* ── Step 1: Role ───────────────────────────────────────────────── */}
        {step === 'role' && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Who are you?</h2>
            <p className="text-rq-muted text-sm mb-6">Select your role on the platform.</p>

            <div className="grid gap-3 mb-6">
              {[
                { role: 'donor',     icon: User,      label: 'Food Donor',     desc: 'Donate surplus food from home, restaurant, or events.' },
                { role: 'volunteer', icon: Truck,      label: 'Volunteer',      desc: 'Pick up and deliver food to NGOs in your area.' },
                { role: 'ngo',       icon: Building2,  label: 'NGO / Charity',  desc: 'Receive food donations for beneficiaries you serve.' },
              ].map(({ role, icon: Icon, label, desc }) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => updateField('role', role as UserRole)}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    form.role === role
                      ? 'border-rq-amber bg-amber-50'
                      : 'border-rq-border hover:border-rq-border-hi'
                  }`}
                >
                  <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    form.role === role ? 'bg-rq-amber text-white' : 'bg-rq-surface2 text-rq-muted'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-rq-text">{label}</p>
                    <p className="text-sm text-rq-muted">{desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {form.role === 'donor' && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-rq-text mb-2">Donor type</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { sub: 'individual',   icon: User,      label: 'Individual',    desc: 'Home cook, household' },
                    { sub: 'organization', icon: Building2, label: 'Organization',  desc: 'Restaurant, hotel, event' },
                  ].map(({ sub, icon: Icon, label, desc }) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => updateField('subtype', sub as DonorSubtype)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all ${
                        form.subtype === sub
                          ? 'border-rq-amber bg-amber-50'
                          : 'border-rq-border hover:border-rq-border-hi'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${form.subtype === sub ? 'text-rq-amber' : 'text-rq-muted'}`} />
                      <p className="font-semibold text-sm text-rq-text">{label}</p>
                      <p className="text-xs text-rq-muted">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Details ────────────────────────────────────────────── */}
        {step === 'details' && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Your Details</h2>
            <p className="text-rq-muted text-sm mb-6">Fill in your information.</p>
            <div className="space-y-4">

              {/* Individual donor / volunteer */}
              {(form.role === 'volunteer' || (form.role === 'donor' && form.subtype === 'individual')) && (
                <Field label="Full Name" error={errors.name}>
                  <input value={form.name} onChange={e => updateField('name', e.target.value)}
                    placeholder="e.g. Aayush Shrivastava" className={inputCls(errors.name)} />
                </Field>
              )}

              {/* Organization donor */}
              {form.role === 'donor' && form.subtype === 'organization' && (<>
                <Field label="Organization Name" error={errors.organizationName}>
                  <input value={form.organizationName} onChange={e => updateField('organizationName', e.target.value)}
                    placeholder="e.g. Sharma Caterers Pvt. Ltd." className={inputCls(errors.organizationName)} />
                </Field>
                <Field label="Owner / Authorized Person Name" error={errors.ownerName}>
                  <input value={form.ownerName} onChange={e => updateField('ownerName', e.target.value)}
                    placeholder="e.g. Ramesh Sharma" className={inputCls(errors.ownerName)} />
                </Field>
              </>)}

              {/* NGO */}
              {form.role === 'ngo' && (<>
                <Field label="NGO / Organization Name" error={errors.ngoName}>
                  <input value={form.ngoName} onChange={e => updateField('ngoName', e.target.value)}
                    placeholder="e.g. Roti Bank Foundation" className={inputCls(errors.ngoName)} />
                </Field>
                <Field label="Contact Person" error={errors.contactPerson}>
                  <input value={form.contactPerson} onChange={e => updateField('contactPerson', e.target.value)}
                    placeholder="e.g. Priya Singh" className={inputCls(errors.contactPerson)} />
                </Field>
                <Field label="Estimated Number of Beneficiaries / Volunteers">
                  <input type="number" min="0" value={form.estimatedVolunteers}
                    onChange={e => updateField('estimatedVolunteers', e.target.value)}
                    placeholder="e.g. 100" className={inputCls()} />
                </Field>
              </>)}

              <Field label="Email Address" error={errors.email}>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
                  placeholder="you@example.com" className={inputCls(errors.email)} />
              </Field>

              <Field label="Phone Number" error={errors.phone} hint="10-digit Indian mobile number">
                <div className="flex">
                  <span className="flex items-center px-3 bg-rq-surface2 border border-rq-border rounded-l-lg text-rq-muted text-sm border-r-0">
                    +91
                  </span>
                  <input type="tel" value={form.phone} onChange={e => updateField('phone', e.target.value)}
                    placeholder="98765 43210" maxLength={10}
                    className={`flex-1 ${inputCls(errors.phone)} rounded-l-none`} />
                </div>
              </Field>

              <Field label="Address" error={errors.address}>
                <textarea value={form.address} onChange={e => updateField('address', e.target.value)}
                  placeholder="House/Building no., Street, City, State — PIN" rows={2}
                  className={`${inputCls(errors.address)} resize-none`} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 3: OTP ────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <div>
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-rq-amber" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Verify your phone</h2>
            <p className="text-rq-muted text-sm mb-1">
              An OTP has been sent to <span className="font-semibold text-rq-text">+91 {form.phone}</span>
            </p>

            {form.demoOtp && (
              <div className="mb-5 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm">
                <AlertCircle className="w-4 h-4 text-rq-amber flex-shrink-0" />
                <span className="text-amber-800">Demo OTP: <strong className="font-mono tracking-widest">{form.demoOtp}</strong></span>
              </div>
            )}

            <Field label="Enter 6-digit OTP" error={errors.otp}>
              <input
                type="text" inputMode="numeric" pattern="[0-9]*"
                maxLength={6} value={form.otp}
                autoFocus
                onChange={e => updateField('otp', e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                className={`${inputCls(errors.otp)} text-center tracking-[0.5em] text-xl font-mono`}
              />
            </Field>

            <button
              type="button"
              onClick={() => handleSendOTP()}
              className="mt-2 text-sm text-rq-amber hover:underline"
            >
              Resend OTP
            </button>
          </div>
        )}

        {/* ── Step 4: Document ───────────────────────────────────────────── */}
        {step === 'document' && (
          <div>
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-rq-green" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Identity Verification</h2>
            <p className="text-rq-muted text-sm mb-5">
              Verify with Aadhaar or PAN. <span className="text-amber-600 font-medium">Demo mode — no real data sent.</span>
            </p>

            <div className="flex gap-3 mb-4">
              {(['aadhaar', 'pan'] as const).map(t => (
                <button type="button" key={t} onClick={() => { updateField('docType', t); updateField('docVerified', false); updateField('docValue', '') }}
                  className={`flex-1 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${
                    form.docType === t ? 'border-rq-amber bg-amber-50 text-rq-amber' : 'border-rq-border text-rq-muted hover:border-rq-border-hi'
                  }`}>
                  {t === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card'}
                </button>
              ))}
            </div>

            {!form.docVerified ? (
              <>
                <Field
                  label={form.docType === 'aadhaar' ? 'Aadhaar Number (12 digits)' : 'PAN Number'}
                  error={errors.docValue}
                  hint={form.docType === 'aadhaar' ? 'Format: XXXX XXXX XXXX' : 'Format: ABCDE1234F'}
                >
                  <input
                    value={form.docValue}
                    onChange={e => updateField('docValue', e.target.value)}
                    placeholder={form.docType === 'aadhaar' ? '0000 0000 0000' : 'ABCDE1234F'}
                    maxLength={form.docType === 'aadhaar' ? 14 : 10}
                    className={inputCls(errors.docValue)}
                  />
                </Field>
                <button type="button" onClick={handleVerifyDocument} disabled={loading}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 bg-rq-green text-white rounded-xl font-semibold text-sm hover:bg-rq-green-dim transition-colors disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  Verify (Demo)
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-rq-green flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 text-sm">Verification successful</p>
                  <p className="text-green-700 text-xs font-mono mt-0.5">{form.docMasked}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 5: File Upload ────────────────────────────────────────── */}
        {step === 'upload' && (
          <div>
            <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-rq-blue" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-1">Upload Certificate</h2>
            <p className="text-rq-muted text-sm mb-5">
              {form.role === 'ngo'
                ? 'Upload your NGO Registration Certificate.'
                : 'Upload your FSSAI Food License Certificate (mandatory for organization donors).'}
              <br />
              <span className="text-xs">Accepted: PDF, JPEG, PNG — max 5 MB</span>
            </p>

            {!form.uploadedUrl ? (
              <>
                <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload} className="hidden" />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={loading}
                  className="w-full border-2 border-dashed border-rq-border rounded-xl py-10 flex flex-col items-center gap-3 hover:border-rq-amber hover:bg-amber-50/30 transition-all disabled:opacity-50">
                  {loading
                    ? <Loader2 className="w-8 h-8 text-rq-amber animate-spin" />
                    : <Upload className="w-8 h-8 text-rq-muted" />}
                  <span className="text-sm text-rq-muted">
                    {loading ? 'Uploading…' : 'Click to select file'}
                  </span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
                <CheckCircle2 className="w-6 h-6 text-rq-green flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-green-800 text-sm">File uploaded successfully</p>
                  <p className="text-green-700 text-xs truncate mt-0.5">{form.uploadedUrl}</p>
                </div>
                <button onClick={() => updateField('uploadedUrl', '')}
                  className="ml-auto text-xs text-rq-muted hover:text-red-500" type="button">
                  Replace
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 6: Success ────────────────────────────────────────────── */}
        {step === 'success' && (
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-rq-green" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-rq-text mb-2">You&apos;re all set!</h2>
            <p className="text-rq-muted text-sm mb-6">
              Welcome to GeminiGrain. Your account has been created and verified.
            </p>
            <button
              onClick={() => router.push(getRoleDashboard(form.role as UserRole))}
              className="w-full py-3 bg-rq-amber text-white rounded-xl font-semibold hover:bg-rq-amber-dim transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ── Action Buttons ─────────────────────────────────────────────── */}
        {step !== 'success' && (
          <div className={`mt-8 flex gap-3 ${stepIdx === 0 ? 'justify-end' : 'justify-between'}`}>
            {stepIdx > 0 && (
              <button type="button" onClick={goBack} disabled={loading}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-rq-border text-rq-muted text-sm font-semibold hover:border-rq-border-hi transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {/* Document step: show the submit button that triggers either verify or continue */}
            {step !== 'document' && (
              <button type="submit" disabled={loading}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rq-amber text-white text-sm font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {step === 'upload'   ? (form.uploadedUrl ? 'Complete Registration' : 'Skip & Register') :
                 step === 'details'  ? 'Send OTP' :
                 step === 'otp'      ? 'Verify OTP' : 'Continue'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {step === 'document' && (
              <button type="submit" disabled={loading}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rq-amber text-white text-sm font-semibold hover:bg-rq-amber-dim transition-colors disabled:opacity-50">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {form.docVerified ? 'Continue' : 'Verify ID'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}

        {step !== 'success' && (
          <p className="mt-6 text-center text-sm text-rq-muted">
            Already have an account?{' '}
            <a href="/login" className="text-rq-amber hover:underline font-semibold">Sign in</a>
          </p>
        )}
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────────

function inputCls(error?: string): string {
  return `w-full px-4 py-2.5 rounded-xl border text-sm text-rq-text placeholder-rq-subtle focus:outline-none focus:ring-2 transition-all ${
    error
      ? 'border-red-400 bg-red-50 focus:ring-red-200'
      : 'border-rq-border bg-rq-surface2 focus:border-rq-amber focus:ring-amber-100'
  }`
}

function Field({
  label, error, hint, children,
}: {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-rq-text mb-1.5">{label}</label>
      {children}
      {hint  && !error && <p className="mt-1 text-xs text-rq-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  )
}
