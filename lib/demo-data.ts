// ─────────────────────────────────────────────────────────────────────────────
// GeminiGrain — centralized demo data
// One source of truth for all "Demo Mode" prefill values across the app.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_PHONE = '9876543210'
export const DEMO_OTP   = '123456'   // special OTP bypass handled by otp-service

// ── Registration demo sets (one per role) ─────────────────────────────────────

export const DEMO_INDIVIDUAL_DONOR = {
  role:    'donor'       as const,
  subtype: 'individual'  as const,
  phone:   DEMO_PHONE,
  email:   'demo.donor@geminigrain.app',
  name:    'Aayush Kumar (Demo)',
  address: 'B-14, Sector 62, Noida, Uttar Pradesh — 201309',
  docType: 'aadhaar'     as const,
  docValue:'987654321012',
}

export const DEMO_ORG_DONOR = {
  role:             'donor'        as const,
  subtype:          'organization' as const,
  phone:            DEMO_PHONE,
  email:            'demo.hotel@geminigrain.app',
  organizationName: 'Sharma Grand Hotel (Demo)',
  ownerName:        'Ramesh Sharma',
  address:          '21, MG Road, Connaught Place, New Delhi — 110001',
  docType:          'pan'          as const,
  docValue:         'ABCDE1234F',
}

export const DEMO_VOLUNTEER = {
  role:    'volunteer'  as const,
  phone:   DEMO_PHONE,
  email:   'demo.volunteer@geminigrain.app',
  name:    'Priya Singh (Demo)',
  address: 'Flat 202, Green Park Extension, New Delhi — 110016',
  docType: 'aadhaar'   as const,
  docValue:'987654321012',
}

export const DEMO_NGO = {
  role:                'ngo'       as const,
  phone:               DEMO_PHONE,
  email:               'demo.ngo@geminigrain.app',
  ngoName:             'Roti Bank Foundation (Demo)',
  contactPerson:       'Sandeep Verma',
  address:             'C-43, Lajpat Nagar II, New Delhi — 110024',
  estimatedVolunteers: '50',
  docType:             'aadhaar'   as const,
  docValue:            '987654321012',
}

// ── Donor submit form demo ────────────────────────────────────────────────────

export const DEMO_FOOD_INPUTS = [
  {
    label:    'Biryani (Hindi)',
    text:     'Mere paas 40 logon ka biryani aur raita hai, abhi hot hai, 2 ghante mein kharab ho jayega',
    location: 'Sector 15, Noida, UP',
  },
  {
    label:    'Office Event (English)',
    text:     '30 plates of leftover paneer butter masala and naan from our office farewell party today evening',
    location: 'Connaught Place, New Delhi',
  },
  {
    label:    'Wedding Leftovers',
    text:     'Shaadi mein 80 plate khana bach gaya — dal makhani, rice, gulab jamun. Jaldi uthwa lo, abhi garam hai',
    location: 'Karol Bagh, New Delhi',
  },
]

export const DEMO_FOOD = DEMO_FOOD_INPUTS[0]

// ── Login demo ────────────────────────────────────────────────────────────────

export const DEMO_LOGIN = {
  phone: DEMO_PHONE,
  otp:   DEMO_OTP,
}
