export const DEMO_COORDS = {
  donor:     [28.4744, 77.5040] as [number, number],  // Greater Noida Sector 15
  ngo1:      [28.4595, 77.4963] as [number, number],  // Roti Bank – Pari Chowk
  ngo2:      [28.4979, 77.5152] as [number, number],  // Asha Foundation – Knowledge Park
  ngo3:      [28.4700, 77.4800] as [number, number],  // Sewa Samiti – Surajpur
  volunteer: [28.4769, 77.5100] as [number, number],  // Volunteer – Alpha 1
}

export const NEEDY_ZONES: { pos: [number, number]; label: string; population: number }[] = [
  { pos: [28.4508, 77.5022], label: 'Surajpur Village',           population: 4200  },
  { pos: [28.4670, 77.4700], label: 'Kasna Labour Colony',        population: 8500  },
  { pos: [28.4900, 77.5300], label: 'Bisrakh Migrant Camp',       population: 3100  },
  { pos: [28.4580, 77.5200], label: 'Ecotech-III Slum Cluster',   population: 6000  },
  { pos: [28.5050, 77.4850], label: 'Dadri Construction Workers', population: 2800  },
]
