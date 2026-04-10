import { NextResponse } from 'next/server'
import { otpStore, verifiedUsers } from '../../../../lib/auth-store'

export async function POST(req: Request) {
  try {
    const { phoneNumber, otp } = await req.json()

    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, message: 'Phone number and OTP required' },
        { status: 400 }
      )
    }

    const storedData = otpStore.get(phoneNumber)

    if (!storedData) {
      return NextResponse.json(
        { success: false, message: 'OTP not found. Request a new OTP.' },
        { status: 400 }
      )
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
      otpStore.delete(phoneNumber)
      return NextResponse.json(
        { success: false, message: 'OTP expired. Request a new one.' },
        { status: 400 }
      )
    }

    // Check attempts (max 3)
    if (storedData.attempts >= 3) {
      otpStore.delete(phoneNumber)
      return NextResponse.json(
        { success: false, message: 'Too many attempts. Request new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      storedData.attempts += 1
      return NextResponse.json(
        { success: false, message: 'Invalid OTP', attempts: storedData.attempts },
        { status: 400 }
      )
    }

    // OTP verified
    verifiedUsers.set(phoneNumber, { verifiedAt: Date.now() })
    otpStore.delete(phoneNumber)

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      phoneNumber,
    })
  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
