import type { OTPRecord } from './types'

const OTP_EXPIRY_MS     = 5 * 60 * 1000   // 5 minutes
const RATE_LIMIT_MS     = 60 * 1000        // 1 OTP per minute
const MAX_ATTEMPTS      = 3

// In-memory OTP store — keyed by phone number
const otpStore = new Map<string, OTPRecord>()

function generate6DigitOTP(): string {
  return Math.floor(100_000 + Math.random() * 900_000).toString()
}

// ── Public API ────────────────────────────────────────────────────────────────

export type SendOTPResult =
  | { sent: true;  otp: string }
  | { sent: false; rateLimited: true;  message: string }

export function sendOTP(phoneNumber: string): SendOTPResult {
  const existing = otpStore.get(phoneNumber)
  const now       = Date.now()

  if (existing && now - existing.lastRequestAt < RATE_LIMIT_MS) {
    const waitSec = Math.ceil((RATE_LIMIT_MS - (now - existing.lastRequestAt)) / 1000)
    return { sent: false, rateLimited: true, message: `Please wait ${waitSec}s before requesting a new OTP.` }
  }

  const otp = generate6DigitOTP()
  otpStore.set(phoneNumber, {
    phoneNumber,
    otp,
    createdAt:     now,
    expiresAt:     now + OTP_EXPIRY_MS,
    attempts:      0,
    maxAttempts:   MAX_ATTEMPTS,
    lastRequestAt: now,
  })

  // In production: use SMS gateway (Twilio / MSG91 / etc.)
  console.log(`[OTP] ${phoneNumber} → ${otp}`)
  return { sent: true, otp }
}

export type VerifyOTPResult =
  | { ok: true }
  | { ok: false; message: string; expired?: true; tooManyAttempts?: true }

const DEMO_OTP_CODE = '123456'

export function verifyOTP(phoneNumber: string, otp: string): VerifyOTPResult {
  // Demo bypass — always accepts 123456 without needing a prior sendOTP call
  if (otp === DEMO_OTP_CODE) {
    otpStore.delete(phoneNumber)
    return { ok: true }
  }

  const record = otpStore.get(phoneNumber)

  if (!record) {
    return { ok: false, message: 'No OTP found. Please request a new one.' }
  }

  const now = Date.now()

  if (now > record.expiresAt) {
    otpStore.delete(phoneNumber)
    return { ok: false, message: 'OTP has expired. Please request a new one.', expired: true }
  }

  if (record.attempts >= record.maxAttempts) {
    otpStore.delete(phoneNumber)
    return { ok: false, message: 'Too many failed attempts. Please request a new OTP.', tooManyAttempts: true }
  }

  if (record.otp !== otp) {
    record.attempts += 1
    const remaining = record.maxAttempts - record.attempts
    return { ok: false, message: `Incorrect OTP. ${remaining} attempt${remaining !== 1 ? 's' : ''} left.` }
  }

  // Success — consume OTP
  otpStore.delete(phoneNumber)
  return { ok: true }
}
