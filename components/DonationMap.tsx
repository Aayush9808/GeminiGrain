'use client'

/**
 * DonationMap — Leaflet / OpenStreetMap based map for all 3 dashboards.
 * Dynamically imported (no SSR) via MapView.tsx.
 *
 * viewAs='donor'     → shows donor pin + NGO pins with distance badges
 * viewAs='ngo'       → shows all donation pins, filtered by status
 * viewAs='volunteer' → shows pickup + dropoff pins + OSRM route polyline
 */

import React, { useEffect, useState, useRef } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Donation } from '@/lib/types'

// ── Fix Leaflet default icon paths (broken in webpack builds) ────────────────
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// ── Icon factories ────────────────────────────────────────────────────────────
function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        border:3px solid white;
        box-shadow:0 2px 8px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);font-size:13px;filter:brightness(0) invert(1)">${label}</span>
      </div>`,
    iconSize:   [36, 36],
    iconAnchor: [18, 36],
    popupAnchor:[0, -38],
  })
}

const DONOR_ICON     = makeIcon('#F5A623', '🍱')
const NGO_ICON       = makeIcon('#2DBD6E', '🏥')
const VOLUNTEER_ICON = makeIcon('#3B82F6', '🚴')
const PICKUP_ICON    = makeIcon('#F87171', '📦')
const DROPOFF_ICON   = makeIcon('#10B981', '🏁')
const NEED_ICON      = makeIcon('#8B5CF6', '🏠')

// ── Demo coordinates (Greater Noida / Delhi NCR) ──────────────────────────────
export const DEMO_COORDS = {
  donor:     [28.4744, 77.5040] as [number, number],  // Greater Noida Sector 15
  ngo1:      [28.4595, 77.4963] as [number, number],  // Roti Bank – Pari Chowk
  ngo2:      [28.4979, 77.5152] as [number, number],  // Asha Foundation – Knowledge Park
  ngo3:      [28.4700, 77.4800] as [number, number],  // Sewa Samiti – Surajpur
  volunteer: [28.4769, 77.5100] as [number, number],  // Volunteer – Alpha 1
}

// ── Needy / high-need zones in Greater Noida ─────────────────────────────────
export const NEEDY_ZONES: { pos: [number, number]; label: string; population: number }[] = [
  { pos: [28.4508, 77.5022], label: 'Surajpur Village',           population: 4200  },
  { pos: [28.4670, 77.4700], label: 'Kasna Labour Colony',        population: 8500  },
  { pos: [28.4900, 77.5300], label: 'Bisrakh Migrant Camp',       population: 3100  },
  { pos: [28.4580, 77.5200], label: 'Ecotech-III Slum Cluster',   population: 6000  },
  { pos: [28.5050, 77.4850], label: 'Dadri Construction Workers', population: 2800  },
]

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}

// ── Helper: auto-fit bounds ───────────────────────────────────────────────────
function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length > 0) {
      map.fitBounds(L.latLngBounds(points), { padding: [48, 48] })
    }
  }, [map, points])
  return null
}

// ── Route fetch via OSRM public API ──────────────────────────────────────────
async function fetchRoute(
  a: [number, number],
  b: [number, number],
): Promise<{ coords: [number, number][]; distanceKm: number; durationMin: number }> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${a[1]},${a[0]};${b[1]},${b[0]}?overview=full&geometries=geojson`
    const res  = await fetch(url)
    const json = await res.json()
    const route = json.routes?.[0]
    if (!route) throw new Error('No route')
    const coords: [number, number][] = route.geometry.coordinates.map(
      ([lng, lat]: [number, number]) => [lat, lng],
    )
    return {
      coords,
      distanceKm:  Math.round(route.distance / 100) / 10,
      durationMin: Math.round(route.duration / 60),
    }
  } catch {
    // Fallback: straight line
    return { coords: [a, b], distanceKm: haversineKm(a, b), durationMin: Math.round(haversineKm(a, b) * 3) }
  }
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  viewAs:    'donor' | 'ngo' | 'volunteer'
  donations?: Donation[]
  donorCoords?:     [number, number]
  onNgoSelect?:     (idx: number) => void
  selectedNgo?:     number
  showNeedyZones?:  boolean
}

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════

export default function DonationMap({
  viewAs,
  donations = [],
  donorCoords = DEMO_COORDS.donor,
  onNgoSelect,
  selectedNgo = 0,
  showNeedyZones = false,
}: Props) {
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([])
  const [routeInfo,   setRouteInfo]   = useState<{ distanceKm: number; durationMin: number } | null>(null)
  const didFetch = useRef(false)

  const NGO_POSITIONS: { pos: [number, number]; name: string }[] = [
    { pos: DEMO_COORDS.ngo1, name: 'Roti Bank — Pari Chowk' },
    { pos: DEMO_COORDS.ngo2, name: 'Asha Foundation — Knowledge Park' },
    { pos: DEMO_COORDS.ngo3, name: 'Sewa Samiti — Surajpur' },
  ]

  // Fetch route for volunteer view
  useEffect(() => {
    if (viewAs !== 'volunteer' || didFetch.current) return
    didFetch.current = true
    fetchRoute(donorCoords, DEMO_COORDS.ngo1).then(r => {
      setRouteCoords(r.coords)
      setRouteInfo({ distanceKm: r.distanceKm, durationMin: r.durationMin })
    })
  }, [viewAs, donorCoords])

  // Compute all points for bounds
  const allPoints: [number, number][] = viewAs === 'donor'
    ? [donorCoords, ...NGO_POSITIONS.map(n => n.pos)]
    : viewAs === 'ngo'
    ? [DEMO_COORDS.ngo1, donorCoords, DEMO_COORDS.volunteer]
    : [donorCoords, DEMO_COORDS.ngo1, DEMO_COORDS.volunteer]

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Route info strip (volunteer only) */}
      {viewAs === 'volunteer' && routeInfo && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-3 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
          <span className="font-semibold text-slate-900">📍 {routeInfo.distanceKm} km</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-700">~{routeInfo.durationMin} min drive</span>
          <a
            href={`https://www.google.com/maps/dir/${donorCoords[0]},${donorCoords[1]}/${DEMO_COORDS.ngo1[0]},${DEMO_COORDS.ngo1[1]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
          >
            🗺️ Get Directions
          </a>
        </div>
      )}

      {/* NGO distance badges (donor view) */}
      {viewAs === 'donor' && (
        <div className="absolute bottom-3 left-3 z-[1000] flex flex-col gap-1">
          {NGO_POSITIONS.map((n, i) => {
            const dist = haversineKm(donorCoords, n.pos).toFixed(1)
            const isNearest = i === 0
            return (
              <button
                key={i}
                onClick={() => onNgoSelect?.(i)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-md transition-all ${
                  selectedNgo === i
                    ? 'bg-emerald-600 text-white'
                    : isNearest
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                🏥 {n.name} — {dist} km {isNearest && selectedNgo !== i ? '⭐ Nearest' : ''}
              </button>
            )
          })}
        </div>
      )}

      <MapContainer
        center={donorCoords}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: '380px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={allPoints} />

        {/* ── DONOR VIEW ─────────────────────────────────────────── */}
        {viewAs === 'donor' && (
          <>
            {/* Donor location */}
            <Marker position={donorCoords} icon={DONOR_ICON}>
              <Popup>
                <strong>📦 Your Donation Location</strong><br />
                Sector 15, Greater Noida
              </Popup>
            </Marker>
            {/* Radius ring (5 km) */}
            <Circle
              center={donorCoords}
              radius={5000}
              pathOptions={{ color: '#F5A623', fillColor: '#F5A623', fillOpacity: 0.06, weight: 1.5, dashArray: '6 4' }}
            />
            {/* NGO pins */}
            {NGO_POSITIONS.map((n, i) => (
              <Marker key={i} position={n.pos} icon={NGO_ICON}>
                <Popup>
                  <strong>🏥 {n.name}</strong><br />
                  Distance: {haversineKm(donorCoords, n.pos).toFixed(1)} km<br />
                  {i === 0 && <span style={{ color: '#2DBD6E', fontWeight: 600 }}>⭐ Nearest Match</span>}
                </Popup>
              </Marker>
            ))}
            {/* Highlight nearest NGO */}
            <Circle
              center={NGO_POSITIONS[selectedNgo].pos}
              radius={600}
              pathOptions={{ color: '#2DBD6E', fillColor: '#2DBD6E', fillOpacity: 0.12, weight: 2 }}
            />
            {/* Needy zones */}
            {showNeedyZones && NEEDY_ZONES.map((z, i) => (
              <React.Fragment key={i}>
                <Circle
                  center={z.pos}
                  radius={450}
                  pathOptions={{ color: '#8B5CF6', fillColor: '#8B5CF6', fillOpacity: 0.18, weight: 1.5, dashArray: '4 3' }}
                />
                <Marker position={z.pos} icon={NEED_ICON}>
                  <Popup>
                    <strong>🏠 {z.label}</strong><br />
                    ~{z.population.toLocaleString()} residents<br />
                    <span style={{ color: '#8B5CF6', fontWeight: 600 }}>High-need delivery zone</span>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </>
        )}

        {/* ── NGO VIEW ───────────────────────────────────────────── */}
        {viewAs === 'ngo' && (
          <>
            {/* NGO HQ */}
            <Marker position={DEMO_COORDS.ngo1} icon={NGO_ICON}>
              <Popup><strong>🏥 Your NGO — Roti Bank</strong><br />Pari Chowk, Greater Noida</Popup>
            </Marker>
            {/* Pending donation locations */}
            {donations.length === 0 ? (
              <Marker position={donorCoords} icon={DONOR_ICON}>
                <Popup><strong>📦 Ravi Sharma</strong><br />Sector 15, Greater Noida<br />25 plates — Vegetarian</Popup>
              </Marker>
            ) : (
              donations.slice(0, 8).map((d, i) => {
                // Greater Noida–based offsets
                const offsets: [number, number][] = [
                  [28.4744, 77.5040], [28.4820, 77.4980], [28.4650, 77.5100],
                  [28.4900, 77.4900], [28.4580, 77.5200], [28.4710, 77.4800],
                  [28.4830, 77.5150], [28.4620, 77.4950],
                ]
                return (
                  <Marker key={d.id} position={offsets[i % offsets.length]} icon={DONOR_ICON}>
                    <Popup>
                      <strong>📦 {d.donorName}</strong><br />
                      {d.foodName}<br />
                      {d.quantity}<br />
                      <span style={{ color: d.urgency === 'HIGH' || d.urgency === 'CRITICAL' ? '#F87171' : '#6B7280' }}>
                        ⚡ {d.urgency} urgency
                      </span>
                      {d.riskFlag && <><br /><span style={{ color: '#F59E0B' }}>⚠️ {d.riskFlag}</span></>}
                    </Popup>
                  </Marker>
                )
              })
            )}
            {/* Volunteer location */}
            <Marker position={DEMO_COORDS.volunteer} icon={VOLUNTEER_ICON}>
              <Popup><strong>🚴 Platform Volunteer</strong><br />Available — Alpha 1, Greater Noida</Popup>
            </Marker>
            {/* High-need zones (always shown for NGO) */}
            {NEEDY_ZONES.map((z, i) => (
              <React.Fragment key={i}>
                <Circle
                  center={z.pos}
                  radius={400}
                  pathOptions={{ color: '#8B5CF6', fillColor: '#8B5CF6', fillOpacity: 0.15, weight: 1.5, dashArray: '4 3' }}
                />
                <Marker position={z.pos} icon={NEED_ICON}>
                  <Popup>
                    <strong>📍 {z.label}</strong><br />
                    ~{z.population.toLocaleString()} residents<br />
                    <span style={{ color: '#8B5CF6' }}>Suggested delivery zone</span>
                  </Popup>
                </Marker>
              </React.Fragment>
            ))}
          </>
        )}

        {/* ── VOLUNTEER VIEW ─────────────────────────────────────── */}
        {viewAs === 'volunteer' && (
          <>
            {/* Pickup */}
            <Marker position={donorCoords} icon={PICKUP_ICON}>
              <Popup><strong>📦 Pickup Point</strong><br />Ravi Sharma<br />Sector 15, Noida</Popup>
            </Marker>
            {/* Dropoff */}
            <Marker position={DEMO_COORDS.ngo1} icon={DROPOFF_ICON}>
              <Popup><strong>🏁 Dropoff Point</strong><br />Roti Bank Delhi<br />Connaught Place, Delhi</Popup>
            </Marker>
            {/* Volunteer current position */}
            <Marker position={DEMO_COORDS.volunteer} icon={VOLUNTEER_ICON}>
              <Popup><strong>📍 Your Location</strong><br />Lajpat Nagar, Delhi</Popup>
            </Marker>
            {/* OSRM route polyline */}
            {routeCoords.length > 0 && (
              <Polyline
                positions={routeCoords}
                pathOptions={{ color: '#3B82F6', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' }}
              />
            )}
          </>
        )}
      </MapContainer>
    </div>
  )
}
