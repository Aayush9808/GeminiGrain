'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface StepContent {
  title: string
  icon: string
  desc: string
}

const STEPS: StepContent[] = [
  {
    title: 'Donor Lists Food',
    icon: '📸',
    desc: 'Snaps a photo or speaks in their language. Done in 30 seconds.',
  },
  {
    title: 'NGO Gets Matched',
    icon: '🎯',
    desc: 'Gemini AI finds the best NGO instantly. One tap to accept.',
  },
  {
    title: 'Volunteer Picks Up',
    icon: '🗺️',
    desc: 'Nearest volunteer gets GPS-routed to the donor location.',
  },
  {
    title: 'Food Reaches the Needy',
    icon: '🙏',
    desc: 'Meals delivered. Impact logged. Lives changed.',
  },
]

export default function HowItWorks() {
  const containerRef = useRef<HTMLElement | null>(null)
  const hasPlayedRef = useRef(false)
  const timeoutRef = useRef<number[]>([])
  const counterRafRef = useRef<number | null>(null)

  const [visibleSteps, setVisibleSteps] = useState([false, false, false, false])
  const [playSteps, setPlaySteps] = useState([false, false, false, false])
  const [drawnConnectors, setDrawnConnectors] = useState([false, false, false])
  const [impactCount, setImpactCount] = useState(0)
  const [showCounter, setShowCounter] = useState(false)
  const [isOutOfView, setIsOutOfView] = useState(true)

  const runCounter = useCallback(() => {
    const end = 45
    const duration = 1200
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setImpactCount(Math.floor(progress * end))
      if (progress < 1) {
        counterRafRef.current = requestAnimationFrame(tick)
      } else {
        setImpactCount(end)
        setShowCounter(true)
      }
    }

    counterRafRef.current = requestAnimationFrame(tick)
  }, [])

  const playSequence = useCallback(() => {
    if (hasPlayedRef.current) return
    hasPlayedRef.current = true

    STEPS.forEach((_, index) => {
      const stepTimeout = window.setTimeout(() => {
        setVisibleSteps((prev) => {
          const next = [...prev]
          next[index] = true
          return next
        })

        const playTimeout = window.setTimeout(() => {
          setPlaySteps((prev) => {
            const next = [...prev]
            next[index] = true
            return next
          })
        }, 130)
        timeoutRef.current.push(playTimeout)

        if (index < STEPS.length - 1) {
          setDrawnConnectors((prev) => {
            const next = [...prev]
            next[index] = true
            return next
          })
        }

        if (index === STEPS.length - 1) {
          const counterTimeout = window.setTimeout(runCounter, 900)
          timeoutRef.current.push(counterTimeout)
        }
      }, index * 300)

      timeoutRef.current.push(stepTimeout)
    })
  }, [runCounter])

  useEffect(() => {
    const section = containerRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsOutOfView(false)
            playSequence()
          } else if (hasPlayedRef.current) {
            setIsOutOfView(true)
          }
        })
      },
      { threshold: 0.25 },
    )

    observer.observe(section)

    return () => {
      observer.disconnect()
      timeoutRef.current.forEach((id) => clearTimeout(id))
      timeoutRef.current = []
      if (counterRafRef.current !== null) {
        cancelAnimationFrame(counterRafRef.current)
      }
    }
  }, [playSequence])

  return (
    <section ref={containerRef} className={`hiw-section ${isOutOfView ? 'out-of-view' : ''}`} id="how-it-works">
      <div className="hiw-world-map" aria-hidden="true" />
      <span className="hiw-dot hiw-dot-orange hiw-dot-1" aria-hidden="true" />
      <span className="hiw-dot hiw-dot-green hiw-dot-2" aria-hidden="true" />
      <span className="hiw-dot hiw-dot-orange hiw-dot-3" aria-hidden="true" />
      <span className="hiw-dot hiw-dot-green hiw-dot-4" aria-hidden="true" />
      <span className="hiw-dot hiw-dot-orange hiw-dot-5" aria-hidden="true" />

      <div className="hiw-container">
        <p className="hiw-label">How It Works</p>
        <h2 className="hiw-heading">A Rescue in 4 Simple Steps</h2>

        <div className="hiw-flow-shell">
          <div className="hiw-desktop-connectors" aria-hidden="true">
            <svg viewBox="0 0 1200 140" preserveAspectRatio="none">
              <defs>
                <marker id="hiw-arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#2DBD6E" />
                </marker>
              </defs>
              <path
                className={`hiw-connector-path ${drawnConnectors[0] ? 'draw' : ''}`}
                d="M180 80 C240 28 300 28 360 80"
              />
              <path
                className={`hiw-connector-path ${drawnConnectors[1] ? 'draw' : ''}`}
                d="M480 80 C540 28 600 28 660 80"
              />
              <path
                className={`hiw-connector-path ${drawnConnectors[2] ? 'draw' : ''}`}
                d="M780 80 C840 28 900 28 960 80"
              />
            </svg>
          </div>

          <div className="hiw-steps-grid">
            <div className="hiw-step-wrap">
              <article className={`hiw-step-card ${visibleSteps[0] ? 'visible' : ''} ${playSteps[0] ? 'play' : ''}`}>
                <div className="hiw-step-badge">1</div>
                <div className="hiw-silhouette-zone">
                  <svg viewBox="0 0 140 120" aria-hidden="true">
                    <g className="hiw-step1-main" fill="#1B4332">
                      <circle cx="52" cy="20" r="10" />
                      <rect x="44" y="31" width="16" height="30" rx="8" />
                      <rect x="45" y="37" width="14" height="16" rx="4" fill="#F5A623" opacity="0.82" />
                      <rect x="30" y="38" width="20" height="8" rx="4" transform="rotate(20 30 38)" />
                      <rect x="56" y="36" width="22" height="8" rx="4" transform="rotate(-12 56 36)" />
                      <rect x="43" y="61" width="7" height="26" rx="3" />
                      <rect x="54" y="61" width="7" height="26" rx="3" />
                    </g>
                    <g>
                      <rect className="hiw-step1-tray" x="69" y="42" width="34" height="8" rx="4" fill="#F5A623" />
                      <rect className="hiw-step1-phone" x="18" y="44" width="10" height="18" rx="2" fill="#1B4332" />
                      <rect className="hiw-step1-phone-screen" x="20" y="47" width="6" height="9" rx="1.5" fill="#F5A623" />
                    </g>
                  </svg>
                </div>
                <h3 className="hiw-step-title">{STEPS[0].title}</h3>
                <div className="hiw-accent-icon" aria-hidden="true">
                  {STEPS[0].icon}
                </div>
                <p className="hiw-step-desc">{STEPS[0].desc}</p>
              </article>
              <svg className={`hiw-mobile-connector ${drawnConnectors[0] ? 'draw' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-0" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-0)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className={`hiw-step-card ${visibleSteps[1] ? 'visible' : ''} ${playSteps[1] ? 'play' : ''}`}>
                <div className="hiw-step-badge">2</div>
                <div className="hiw-silhouette-zone">
                  <svg viewBox="0 0 140 120" aria-hidden="true">
                    <g className="hiw-step2-main" fill="#1B4332">
                      <circle cx="53" cy="20" r="10" />
                      <rect x="45" y="30" width="16" height="30" rx="8" />
                      <rect x="30" y="37" width="20" height="8" rx="4" />
                      <rect x="58" y="37" width="20" height="8" rx="4" />
                      <rect x="44" y="60" width="7" height="24" rx="3" />
                      <rect x="55" y="60" width="7" height="24" rx="3" />
                    </g>
                    <g>
                      <rect className="hiw-step2-box" x="74" y="45" width="28" height="20" rx="3" fill="#F5A623" />
                      <circle className="hiw-step2-bell" cx="104" cy="14" r="5" fill="#F5A623" />
                      <path
                        className="hiw-step2-check"
                        d="M93 82 C93 76 97 72 103 72 C109 72 113 76 113 82 C113 88 109 92 103 92 C97 92 93 88 93 82 Z"
                        fill="#2DBD6E"
                        opacity="0"
                      />
                      <path
                        className="hiw-step2-check"
                        d="M98 82 L102 86 L108 78"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0"
                      />
                    </g>
                  </svg>
                </div>
                <h3 className="hiw-step-title">{STEPS[1].title}</h3>
                <div className="hiw-accent-icon" aria-hidden="true">
                  {STEPS[1].icon}
                </div>
                <p className="hiw-step-desc">{STEPS[1].desc}</p>
              </article>
              <svg className={`hiw-mobile-connector ${drawnConnectors[1] ? 'draw' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-1" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-1)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className={`hiw-step-card ${visibleSteps[2] ? 'visible' : ''} ${playSteps[2] ? 'play' : ''}`}>
                <div className="hiw-step-badge">3</div>
                <div className="hiw-silhouette-zone">
                  <svg viewBox="0 0 140 120" aria-hidden="true">
                    <g className="hiw-step3-main" fill="#1B4332">
                      <circle cx="52" cy="20" r="10" />
                      <rect x="44" y="30" width="16" height="28" rx="8" transform="skewX(-7)" />
                      <rect x="34" y="37" width="20" height="8" rx="4" transform="rotate(28 34 37)" />
                      <rect x="57" y="36" width="22" height="8" rx="4" transform="rotate(-28 57 36)" />
                      <rect x="39" y="58" width="7" height="25" rx="3" transform="rotate(-20 39 58)" />
                      <rect x="57" y="58" width="7" height="25" rx="3" transform="rotate(18 57 58)" />
                    </g>
                    <rect className="hiw-step3-bag" x="63" y="42" width="20" height="24" rx="4" fill="#1B4332" />
                    <rect className="hiw-step3-bag" x="66" y="46" width="14" height="7" rx="3" fill="#F5A623" />
                    <path className="hiw-step3-bowl" d="M90 79 Q96 92 112 92 Q128 92 134 79 L90 79 Z" fill="#1B4332" />
                    <rect className="hiw-step3-bowl" x="95" y="92" width="34" height="3" rx="1.5" fill="#1B4332" />
                    <path
                      className="hiw-step3-path"
                      d="M18 88 C38 84 58 86 78 84"
                      stroke="#2DBD6E"
                      strokeWidth="2.5"
                      strokeDasharray="3 4"
                      fill="none"
                    />
                    <path
                      className="hiw-step3-pin"
                      d="M106 18 C100 18 96 22 96 28 C96 34 106 46 106 46 C106 46 116 34 116 28 C116 22 112 18 106 18 Z"
                      fill="#F5A623"
                      opacity="0"
                    />
                    <circle className="hiw-step3-pin" cx="106" cy="28" r="3" fill="#1B4332" opacity="0" />
                    <circle className="hiw-step3-pin-pulse" cx="106" cy="36" r="6" fill="rgba(245,166,35,0.5)" opacity="0" />
                  </svg>
                </div>
                <h3 className="hiw-step-title">{STEPS[2].title}</h3>
                <div className="hiw-accent-icon" aria-hidden="true">
                  {STEPS[2].icon}
                </div>
                <p className="hiw-step-desc">{STEPS[2].desc}</p>
              </article>
              <svg className={`hiw-mobile-connector ${drawnConnectors[2] ? 'draw' : ''}`} viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-2" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-2)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className={`hiw-step-card ${visibleSteps[3] ? 'visible' : ''} ${playSteps[3] ? 'play' : ''}`}>
                <div className="hiw-step-badge">4</div>
                <div className="hiw-silhouette-zone">
                  <svg viewBox="0 0 140 120" aria-hidden="true">
                    <g className="hiw-member hiw-member-1" fill="#1B4332">
                      <circle cx="36" cy="30" r="9" />
                      <rect x="28" y="39" width="16" height="24" rx="8" />
                      <rect x="26" y="62" width="7" height="20" rx="3" />
                      <rect x="39" y="62" width="7" height="20" rx="3" />
                    </g>
                    <g className="hiw-member hiw-member-2" fill="#1B4332">
                      <circle cx="70" cy="27" r="10" />
                      <rect x="62" y="38" width="16" height="26" rx="8" />
                      <rect x="61" y="63" width="7" height="21" rx="3" />
                      <rect x="74" y="63" width="7" height="21" rx="3" />
                    </g>
                    <g className="hiw-member hiw-member-3" fill="#1B4332">
                      <circle cx="103" cy="31" r="8" />
                      <rect x="96" y="40" width="14" height="22" rx="7" />
                      <rect x="95" y="61" width="6" height="18" rx="3" />
                      <rect x="106" y="61" width="6" height="18" rx="3" />
                    </g>
                    <rect className="hiw-step4-box" x="26" y="82" width="28" height="13" rx="3" fill="#F5A623" />
                    <rect className="hiw-step4-box" x="56" y="84" width="28" height="13" rx="3" fill="#F5A623" />
                    <rect className="hiw-step4-box" x="86" y="82" width="22" height="13" rx="3" fill="#F5A623" />
                  </svg>

                  <div className="hiw-hearts" aria-hidden="true">
                    <span className="hiw-heart hiw-heart-1">❤</span>
                    <span className="hiw-heart hiw-heart-2">❤</span>
                    <span className="hiw-heart hiw-heart-3">❤</span>
                  </div>

                  <div className="hiw-confetti" aria-hidden="true">
                    <span className="hiw-piece hiw-piece-orange hiw-piece-1" />
                    <span className="hiw-piece hiw-piece-green hiw-piece-2" />
                    <span className="hiw-piece hiw-piece-orange hiw-piece-3" />
                    <span className="hiw-piece hiw-piece-green hiw-piece-4" />
                    <span className="hiw-piece hiw-piece-orange hiw-piece-5" />
                    <span className="hiw-piece hiw-piece-green hiw-piece-6" />
                  </div>
                </div>
                <h3 className="hiw-step-title">{STEPS[3].title}</h3>
                <div className="hiw-accent-icon" aria-hidden="true">
                  {STEPS[3].icon}
                </div>
                <p className="hiw-step-desc">{STEPS[3].desc}</p>
                <div className={`hiw-impact-counter ${showCounter ? 'show' : ''}`}>+{impactCount} people fed</div>
              </article>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hiw-section {
          width: 100%;
          background: #f5f3ee;
          padding: 90px 24px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .hiw-world-map {
          position: absolute;
          inset: 0;
          opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1400 600'%3E%3Cg fill='%23000000'%3E%3Cpath d='M70 240c70-66 160-74 254-52 52 12 95 43 157 43 50 0 78-39 125-56 66-24 122-9 168 43 33 36 45 80 37 128-12 62-48 98-104 123-46 21-97 26-147 26-66 0-126-15-181-51-36-24-64-58-111-67-66-12-133 33-191 0-39-22-56-58-58-101-3-53 17-101 51-136z'/%3E%3Cpath d='M640 172c86-56 168-60 257-42 63 13 122 45 187 46 51 2 101-20 150-33 75-21 148-18 218 20 54 29 94 72 110 133 20 71 2 136-47 190-57 63-132 86-214 94-95 9-186-3-278-29-74-20-143-53-218-69-73-15-142-8-211 29-53 28-102 71-168 51-47-14-69-51-70-99-2-70 30-130 73-183 54-68 129-83 211-108z'/%3E%3Cpath d='M1075 437c45-36 100-58 159-53 52 4 100 27 126 75 24 45 19 99-11 141-39 54-104 80-170 88-81 10-174-9-228-74-47-58-30-126 35-177 27-21 59-35 89-52z'/%3E%3C/g%3E%3C/svg%3E");
          background-size: cover;
          background-position: center;
          z-index: -1;
        }

        .hiw-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          z-index: 1;
        }

        .hiw-dot-orange {
          background: #f5a623;
        }

        .hiw-dot-green {
          background: #2dbd6e;
        }

        .hiw-dot-1 {
          top: 70px;
          left: 80px;
        }

        .hiw-dot-2 {
          top: 104px;
          left: 116px;
        }

        .hiw-dot-3 {
          top: 86px;
          right: 134px;
        }

        .hiw-dot-4 {
          bottom: 86px;
          left: 17%;
        }

        .hiw-dot-5 {
          bottom: 74px;
          right: 13%;
        }

        .hiw-container {
          max-width: 1250px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hiw-label {
          text-align: center;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #f5a623;
          font-weight: 700;
          margin-bottom: 14px;
        }

        .hiw-heading {
          text-align: center;
          font-family: var(--font-serif-display), serif;
          font-size: clamp(34px, 5vw, 54px);
          line-height: 1.12;
          color: #1a1a1a;
          margin-bottom: 58px;
        }

        .hiw-flow-shell {
          position: relative;
          padding-top: 18px;
        }

        .hiw-desktop-connectors {
          position: absolute;
          left: 0;
          right: 0;
          top: 122px;
          height: 140px;
          pointer-events: none;
          z-index: 1;
          display: block;
        }

        .hiw-desktop-connectors svg {
          width: 100%;
          height: 100%;
        }

        .hiw-connector-path {
          fill: none;
          stroke: #2dbd6e;
          stroke-width: 4;
          stroke-linecap: round;
          marker-end: url(#hiw-arrowhead);
          stroke-dasharray: 320;
          stroke-dashoffset: 320;
          transition: stroke-dashoffset 0.8s ease-in-out;
        }

        .hiw-connector-path.draw {
          stroke-dashoffset: 0;
          animation: hiw-connector-pulse 1.2s ease-in-out 0.8s 1;
        }

        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
          position: relative;
          z-index: 2;
        }

        .hiw-step-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .hiw-step-card {
          width: 100%;
          background: #f9f6f0;
          border-radius: 16px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.07);
          padding: 24px 20px 22px;
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
          position: relative;
          overflow: hidden;
          min-height: 372px;
        }

        .hiw-step-card.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .hiw-step-badge {
          width: 40px;
          height: 40px;
          margin: 0 auto 14px;
          border-radius: 999px;
          background: #f5a623;
          color: #fff;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans-body), sans-serif;
          font-size: 15px;
          letter-spacing: 0.02em;
        }

        .hiw-silhouette-zone {
          height: 128px;
          margin-bottom: 12px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hiw-silhouette-zone svg {
          width: 140px;
          height: 120px;
          overflow: visible;
        }

        .hiw-step-title {
          font-family: var(--font-serif-display), serif;
          font-size: 28px;
          line-height: 1.08;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 8px;
          min-height: 58px;
        }

        .hiw-accent-icon {
          font-size: 18px;
          line-height: 1;
          margin-bottom: 10px;
          color: #f5a623;
        }

        .hiw-step-desc {
          font-size: 14px;
          line-height: 1.55;
          color: #626262;
          max-width: 230px;
          margin: 0 auto;
        }

        .hiw-mobile-connector {
          width: 48px;
          height: 48px;
          margin: 8px 0;
          display: none;
        }

        .hiw-mobile-connector path {
          fill: none;
          stroke: #2dbd6e;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-dasharray: 130;
          stroke-dashoffset: 130;
          transition: stroke-dashoffset 0.8s ease-in-out;
        }

        .hiw-mobile-connector.draw path {
          stroke-dashoffset: 0;
        }

        .hiw-step-card.play .hiw-step1-main {
          animation: hiw-walk-in 0.6s ease-out both;
        }

        .hiw-step-card.play .hiw-step1-tray {
          animation: hiw-glow-pulse 1.5s infinite alternate 0.6s;
        }

        .hiw-step-card.play .hiw-step1-phone {
          animation: hiw-phone-tap 0.7s ease-in-out 0.8s infinite;
        }

        .hiw-step-card.play .hiw-step1-phone-screen {
          animation: hiw-screen-blink 0.6s ease-in-out 0.85s infinite;
        }

        .hiw-step-card.play .hiw-step2-main {
          animation: hiw-ngo-bounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .hiw-step-card.play .hiw-step2-bell {
          animation: hiw-bell-shake 1s ease-in-out 0.35s 2;
          transform-origin: 104px 15px;
        }

        .hiw-step-card.play .hiw-step2-check {
          animation: hiw-check-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both;
        }

        .hiw-step-card.play .hiw-step2-box {
          animation: hiw-box-flash 0.8s ease-in-out 0.55s 1;
        }

        .hiw-step-card.play .hiw-step3-main {
          animation: hiw-run-in 0.6s ease-out both;
        }

        .hiw-step-card.play .hiw-step3-pin {
          animation: hiw-pin-drop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.35s both;
        }

        .hiw-step-card.play .hiw-step3-pin-pulse {
          animation: hiw-pin-pulse 1.2s ease-out 0.8s infinite;
          transform-origin: 105px 36px;
        }

        .hiw-step-card.play .hiw-step3-path {
          stroke-dasharray: 120;
          stroke-dashoffset: 120;
          animation: hiw-path-draw 0.8s ease-in-out 0.55s forwards;
        }

        .hiw-step-card.play .hiw-step3-bag {
          animation: hiw-bag-bounce 0.8s ease-in-out 0.9s infinite;
        }

        .hiw-step-card.play .hiw-step3-bowl {
          animation: hiw-bowl-tilt 1.2s ease-in-out 1s infinite;
          transform-origin: 112px 90px;
        }

        .hiw-member {
          opacity: 0;
        }

        .hiw-step-card.play .hiw-member-1 {
          animation: hiw-fade-member 0.4s ease-out 0.2s both;
        }

        .hiw-step-card.play .hiw-member-2 {
          animation: hiw-fade-member 0.4s ease-out 0.5s both;
        }

        .hiw-step-card.play .hiw-member-3 {
          animation: hiw-fade-member 0.4s ease-out 0.8s both;
        }

        .hiw-step-card.play .hiw-step4-box {
          animation: hiw-food-glow 1.5s infinite alternate 0.95s;
        }

        .hiw-hearts {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hiw-heart {
          position: absolute;
          color: #f5a623;
          font-size: 16px;
          opacity: 0;
        }

        .hiw-step-card.play .hiw-heart-1 {
          left: 24%;
          top: 62%;
          animation: hiw-float-heart 2s ease-in-out 1s infinite;
        }

        .hiw-step-card.play .hiw-heart-2 {
          left: 52%;
          top: 58%;
          animation: hiw-float-heart 2s ease-in-out 1.35s infinite;
        }

        .hiw-step-card.play .hiw-heart-3 {
          left: 74%;
          top: 64%;
          animation: hiw-float-heart 2s ease-in-out 1.7s infinite;
        }

        .hiw-confetti {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .hiw-piece {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 1px;
          opacity: 0;
        }

        .hiw-piece-orange {
          background: #f5a623;
        }

        .hiw-piece-green {
          background: #2dbd6e;
        }

        .hiw-step-card.play .hiw-piece {
          animation: hiw-confetti-burst 1s ease-out 1.05s both;
        }

        .hiw-piece-1 {
          left: 34%;
          top: 40%;
          --tx: -26px;
          --ty: -42px;
        }

        .hiw-piece-2 {
          left: 44%;
          top: 36%;
          --tx: 18px;
          --ty: -40px;
        }

        .hiw-piece-3 {
          left: 54%;
          top: 39%;
          --tx: 28px;
          --ty: -26px;
        }

        .hiw-piece-4 {
          left: 62%;
          top: 45%;
          --tx: 32px;
          --ty: 12px;
        }

        .hiw-piece-5 {
          left: 40%;
          top: 47%;
          --tx: -22px;
          --ty: 18px;
        }

        .hiw-piece-6 {
          left: 50%;
          top: 42%;
          --tx: 0px;
          --ty: 34px;
        }

        .hiw-impact-counter {
          margin-top: 10px;
          color: #2dbd6e;
          font-weight: 700;
          font-size: 17px;
          letter-spacing: 0.01em;
          opacity: 0;
          transform: translateY(6px);
          transition: 0.35s ease;
        }

        .hiw-impact-counter.show {
          opacity: 1;
          transform: translateY(0);
        }

        .hiw-section.out-of-view :global(.hiw-step-card.play) :global(*) {
          animation-play-state: paused !important;
        }

        @keyframes hiw-connector-pulse {
          0%,
          100% {
            stroke-width: 4;
            opacity: 1;
          }
          50% {
            stroke-width: 5;
            opacity: 0.86;
          }
        }

        @keyframes hiw-walk-in {
          from {
            transform: translateX(-32px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes hiw-run-in {
          from {
            transform: translateX(-36px) skewX(-5deg);
            opacity: 0;
          }
          to {
            transform: translateX(0) skewX(0deg);
            opacity: 1;
          }
        }

        @keyframes hiw-glow-pulse {
          from {
            filter: drop-shadow(0 0 0 rgba(245, 166, 35, 0.2));
          }
          to {
            filter: drop-shadow(0 0 11px rgba(245, 166, 35, 0.9));
          }
        }

        @keyframes hiw-phone-tap {
          0%,
          100% {
            transform: rotate(0deg);
          }
          45% {
            transform: rotate(8deg);
          }
          65% {
            transform: rotate(-5deg);
          }
        }

        @keyframes hiw-screen-blink {
          0%,
          100% {
            opacity: 0.36;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes hiw-ngo-bounce {
          0% {
            transform: translateY(16px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes hiw-bell-shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-18deg);
          }
          50% {
            transform: rotate(10deg);
          }
          75% {
            transform: rotate(-8deg);
          }
        }

        @keyframes hiw-check-pop {
          0% {
            opacity: 0;
            transform: scale(0.2);
          }
          70% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes hiw-box-flash {
          0% {
            filter: drop-shadow(0 0 0 rgba(245, 166, 35, 0));
          }
          50% {
            filter: drop-shadow(0 0 12px rgba(245, 166, 35, 0.95));
          }
          100% {
            filter: drop-shadow(0 0 0 rgba(245, 166, 35, 0));
          }
        }

        @keyframes hiw-pin-drop {
          from {
            transform: translateY(-22px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes hiw-pin-pulse {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes hiw-path-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes hiw-bag-bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes hiw-bowl-tilt {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-4deg);
          }
        }

        @keyframes hiw-fade-member {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hiw-food-glow {
          from {
            filter: drop-shadow(0 0 0 rgba(245, 166, 35, 0.2));
          }
          to {
            filter: drop-shadow(0 0 12px rgba(245, 166, 35, 0.95));
          }
        }

        @keyframes hiw-float-heart {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.8);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-46px) scale(1.08);
          }
        }

        @keyframes hiw-confetti-burst {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          25% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate(var(--tx), var(--ty)) scale(0.9);
          }
        }

        @media (max-width: 1080px) {
          .hiw-steps-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .hiw-desktop-connectors {
            display: none;
          }

          .hiw-mobile-connector {
            display: block;
          }
        }

        @media (max-width: 700px) {
          .hiw-section {
            padding: 76px 16px;
          }

          .hiw-step-card {
            min-height: unset;
          }

          .hiw-heading {
            margin-bottom: 44px;
          }

          .hiw-dot-1 {
            top: 56px;
            left: 22px;
          }

          .hiw-dot-2 {
            top: 78px;
            left: 44px;
          }

          .hiw-dot-3 {
            top: 62px;
            right: 28px;
          }

          .hiw-dot-4 {
            bottom: 56px;
            left: 18px;
          }

          .hiw-dot-5 {
            bottom: 42px;
            right: 26px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </section>
  )
}
