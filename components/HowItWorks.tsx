'use client'

interface StepContent {
  title: string
  desc: string
}

const STEPS: StepContent[] = [
  {
    title: 'Donor Lists Food',
    desc: 'Snaps a photo or speaks in their language. Done in 30 seconds.',
  },
  {
    title: 'NGO Gets Matched',
    desc: 'Gemini AI finds the best NGO instantly. One tap to accept.',
  },
  {
    title: 'Volunteer Picks Up',
    desc: 'Nearest volunteer gets GPS-routed to the donor location.',
  },
  {
    title: 'Food Reaches the Needy',
    desc: 'Meals delivered. Impact logged. Lives changed.',
  },
]

export default function HowItWorks() {
  return (
    <section className="hiw-section" id="how-it-works">
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
              <path className="hiw-connector-path" d="M180 80 C240 28 300 28 360 80" />
              <path className="hiw-connector-path" d="M480 80 C540 28 600 28 660 80" />
              <path className="hiw-connector-path" d="M780 80 C840 28 900 28 960 80" />
            </svg>
          </div>

          <div className="hiw-steps-grid">
            <div className="hiw-step-wrap">
              <article className="hiw-step-card">
                <div className="hiw-step-badge">STEP 01</div>
                <div className="hiw-silhouette-zone">
                  <img
                    className="hiw-step-image"
                    src="/pics/pro-step-1.png"
                    alt="Food donor holding a tray of food"
                    loading="lazy"
                  />
                </div>
                <h3 className="hiw-step-title">{STEPS[0].title}</h3>
                <p className="hiw-step-desc">{STEPS[0].desc}</p>
              </article>
              <svg className="hiw-mobile-connector" viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-0" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-0)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className="hiw-step-card">
                <div className="hiw-step-badge">STEP 02</div>
                <div className="hiw-silhouette-zone">
                  <img
                    className="hiw-step-image"
                    src="/pics/pro-step-2.png"
                    alt="NGO member receiving a food box"
                    loading="lazy"
                  />
                </div>
                <h3 className="hiw-step-title">{STEPS[1].title}</h3>
                <p className="hiw-step-desc">{STEPS[1].desc}</p>
              </article>
              <svg className="hiw-mobile-connector" viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-1" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-1)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className="hiw-step-card">
                <div className="hiw-step-badge">STEP 03</div>
                <div className="hiw-silhouette-zone">
                  <img
                    className="hiw-step-image"
                    src="/pics/pro-step-3.png"
                    alt="Volunteer carrying food for delivery"
                    loading="lazy"
                  />
                </div>
                <h3 className="hiw-step-title">{STEPS[2].title}</h3>
                <p className="hiw-step-desc">{STEPS[2].desc}</p>
              </article>
              <svg className="hiw-mobile-connector" viewBox="0 0 48 48" aria-hidden="true">
                <defs>
                  <marker id="hiw-arrowhead-mobile-2" markerWidth="8" markerHeight="6" refX="6.5" refY="3" orient="auto">
                    <polygon points="0 0, 8 3, 0 6" fill="#2DBD6E" />
                  </marker>
                </defs>
                <path markerEnd="url(#hiw-arrowhead-mobile-2)" d="M24 4 C24 16 24 24 24 42" />
              </svg>
            </div>

            <div className="hiw-step-wrap">
              <article className="hiw-step-card">
                <div className="hiw-step-badge">STEP 04</div>
                <div className="hiw-silhouette-zone">
                  <img
                    className="hiw-step-image"
                    src="/pics/pro-step-4.png"
                    alt="Needy family receiving meals"
                    loading="lazy"
                  />
                </div>
                <h3 className="hiw-step-title">{STEPS[3].title}</h3>
                <p className="hiw-step-desc">{STEPS[3].desc}</p>
              </article>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hiw-section {
          width: 100%;
          background: linear-gradient(160deg, #f7f4ed 0%, #f1eee7 48%, #ece9e0 100%);
          padding: 90px 24px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
        }

        .hiw-section::before {
          content: '';
          position: absolute;
          inset: -120px -70px auto auto;
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(45, 189, 110, 0.11) 0%, rgba(45, 189, 110, 0) 72%);
          pointer-events: none;
          z-index: 0;
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
          max-width: 1280px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .hiw-label {
          width: fit-content;
          margin: 0 auto 14px;
          padding: 7px 14px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #1b4332;
          font-weight: 700;
          border: 1px solid #d5cfbf;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.72);
        }

        .hiw-heading {
          text-align: center;
          font-family: var(--font-serif-display), serif;
          font-size: clamp(34px, 4.6vw, 52px);
          line-height: 1.1;
          letter-spacing: -0.015em;
          color: #1c1c1c;
          max-width: 700px;
          margin: 0 auto 58px;
        }

        .hiw-flow-shell {
          position: relative;
          padding-top: 20px;
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
          stroke: #93aa9d;
          stroke-width: 2.25;
          stroke-linecap: round;
          marker-end: url(#hiw-arrowhead);
        }

        .hiw-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          position: relative;
          z-index: 2;
        }

        .hiw-step-wrap {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
        }

        .hiw-step-card {
          width: 100%;
          background: rgba(255, 255, 255, 0.45);
          border: 1px solid #d7d0c2;
          border-radius: 20px;
          box-shadow: 0 8px 24px rgba(36, 36, 36, 0.06);
          padding: 16px 16px 18px;
          text-align: center;
          opacity: 1;
          transform: translateY(0);
          position: relative;
          overflow: hidden;
          min-height: 430px;
        }

        .hiw-step-badge {
          width: auto;
          height: auto;
          margin: 0 auto 11px;
          padding: 6px 11px;
          border-radius: 999px;
          background: #ffffff;
          color: #1b4332;
          font-weight: 600;
          border: 1px solid #d8d3c9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-sans-body), sans-serif;
          font-size: 13px;
          letter-spacing: 0.08em;
        }

        .hiw-silhouette-zone {
          height: 292px;
          margin-bottom: 14px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid #ddd8cc;
          background: linear-gradient(180deg, #f8f6f1 0%, #f2eee6 100%);
        }

        .hiw-step-image {
          height: 96%;
          width: 96%;
          object-fit: contain;
          object-position: center;
          display: block;
          filter: none;
        }

        .hiw-step-title {
          font-family: var(--font-serif-display), serif;
          font-size: 23px;
          line-height: 1.1;
          font-weight: 700;
          color: #1f1f1f;
          margin-bottom: 9px;
          min-height: 52px;
        }

        .hiw-step-desc {
          font-size: 14px;
          line-height: 1.6;
          color: #5b5b5b;
          max-width: 100%;
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
          stroke: #93aa9d;
          stroke-width: 2.25;
          stroke-linecap: round;
        }

        @media (max-width: 1080px) {
          .hiw-steps-grid {
            grid-template-columns: 1fr;
            gap: 12px;
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

          .hiw-heading {
            max-width: 100%;
          }

          .hiw-silhouette-zone {
            height: 248px;
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
      `}</style>
    </section>
  )
}