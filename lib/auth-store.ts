// Shared in-memory storage for user data
// In production, replace this with a real database

export interface UserData {
  id: string
  phoneNumber: string
  role: string
  name: string
  address: string
  [key: string]: any
}

export interface OTPData {
  otp: string
  timestamp: number
  attempts: number
}

// User database: { phoneNumber -> UserData }
export const usersDb = new Map<string, UserData>()

// Legacy OTP stores kept for backward compatibility with existing API routes.
export const otpStore = new Map<string, OTPData>()
export const verifiedUsers = new Map<string, { verifiedAt: number }>()
