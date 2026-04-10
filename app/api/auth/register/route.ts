import { NextResponse } from 'next/server'
import { usersDb } from '@/lib/auth-store'
import { registerNGOProfile } from '@/lib/store'

export async function POST(req: Request) {
  try {
    const { phoneNumber, role, details } = await req.json()

    if (!phoneNumber || !role || !details) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate details based on role
    const { name, address, ...restDetails } = details

    if (!name || !address) {
      return NextResponse.json(
        { success: false, message: 'Name and address are required' },
        { status: 400 }
      )
    }

    if (role === 'donor' && !details.restaurantType) {
      return NextResponse.json(
        { success: false, message: 'Restaurant/Hostel type is required for donor' },
        { status: 400 }
      )
    }

    if (role === 'ngo' && (!details.capacity || !details.dietaryPref || typeof details.hasVolunteer !== 'boolean')) {
      return NextResponse.json(
        { success: false, message: 'Capacity, dietary preference and volunteer availability are required for NGO' },
        { status: 400 }
      )
    }

    if (role === 'volunteer' && !details.vehicleType) {
      return NextResponse.json(
        { success: false, message: 'Vehicle type is required for volunteer' },
        { status: 400 }
      )
    }

    // Create user profile
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const userProfile = {
      id: userId,
      phoneNumber,
      role,
      name,
      address,
      ...restDetails,
      createdAt: new Date(),
      verified: true,
    }

    usersDb.set(phoneNumber, userProfile)

    if (role === 'ngo') {
      registerNGOProfile({
        name,
        capacity: Number(details.capacity),
        dietaryPref: details.dietaryPref,
        hasVolunteer: Boolean(details.hasVolunteer),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: userProfile,
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to register user' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const phoneNumber = searchParams.get('phoneNumber')

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, message: 'Phone number required' },
        { status: 400 }
      )
    }

    const user = usersDb.get(phoneNumber)

    if (!user) {
      return NextResponse.json({
        success: true,
        user: null,
        message: 'User not found',
      })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
