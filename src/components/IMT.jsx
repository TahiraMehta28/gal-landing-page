import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const FOCUS_AREAS = [
  {
    num: '01',
    title: 'Strategy & Governance',
    description: 'Set direction and structure that outlast any one grant cycle.',
    detail: 'Define your incubator\'s theory of change, stakeholder accountability framework and board-level reporting so your program survives leadership transitions and funding changes.',
  },
  {
    num: '02',
    title: 'Startup Support Systems',
    description: 'Screening, mentoring and programming that actually moves founders forward.',
    detail: 'Build intake frameworks that identify high-potential teams early, design milestone-based support tracks, and create mentoring structures where advice translates into action.',
  },
  {
    num: '03',
    title: 'Ecosystem Partnerships',
    description: 'Corporate, mentor and investor networks your startups can actually use.',
    detail: 'Develop structured corporate challenge programs, build curated mentor pools with real accountability, and create warm-introduction pipelines to capital — not just lists of contacts.',
  },
  {
    num: '04',
    title: 'Financial Sustainability',
    description: 'Funding and operating models that don\'t collapse when the grant ends.',
    detail: 'Map your revenue diversification strategy across fee-for-service, equity, corporate sponsorship and public funding — then build the systems to execute across all of them.',
  },
  {
    num: '05',
    title: 'Impact Measurement',
    description: 'Proof that your ecosystem is producing outcomes, not just activity.',
    detail: 'Design metrics frameworks that capture real economic and social value, build stakeholder dashboards that demonstrate ROI, and create narratives that secure continued investment.',
  },
]

function FocusRow({ area, delay, isActive, onToggle }) {
  const [ref, visible] = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'is-visible' : ''}`}
    >
      <div
        onClick={onToggle}
        className={`list-row-light ${isActive ? 'active-row' : ''}`}
        style={{
          cursor: 'pointer',
          borderTop: '2px solid rgba(15,23,42,0.20)',
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr 36px',
          gap: '20px',
          padding: '24px 16px',
          alignItems: 'start',
        }}>
          {/* Number */}
          <div>
            <span style={{
              fontSize: 'clamp(26px,3vw,34px)',
              fontWeight: 900,
              fontFamily: '"Space Grotesk", monospace, sans-serif',
              color: isActive ? '#C9A227' : 'rgba(15,23,42,0.80)',
              lineHeight: 1,
              display: 'block',
              transition: 'color 0.3s',
            }}>
              {area.num}
            </span>
          </div>

          {/* Content */}
          <div>
            <h3 className="font-display" style={{
              fontSize: '20px', fontWeight: 800,
              letterSpacing: '-0.01em',
              color: isActive ? '#C9A227' : '#000000',
              marginBottom: '6px', lineHeight: 1.3,
              transition: 'color 0.2s',
            }}>
              {area.title}
            </h3>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#334155', lineHeight: 1.65, marginTop: '4px', marginBottom: isActive ? '14px' : '0' }}>
              {area.description}
            </p>
            {/* Expandable detail */}
            <div style={{
              maxHeight: isActive ? '160px' : '0',
              overflow: 'hidden',
              transition: 'max-height 0.42s cubic-bezier(0.22,1,0.36,1)',
            }}>
              <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(15,23,42,0.65)', lineHeight: 1.72, paddingTop: '4px' }}>
                {area.detail}
              </p>
            </div>
          </div>

          {/* Chevron */}
          <div style={{ paddingTop: '4px' }}>
            <span
              className="imt-toggle"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '30px', height: '30px', borderRadius: '50%',
                background: isActive ? '#000000' : '#e2e8f0',
                color: isActive ? '#ffffff' : '#0f172a',
                fontSize: '18px', fontWeight: 700,
                transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s cubic-bezier(0.22,1,0.36,1), background-color 0.2s, color 0.2s',
              }}
            >
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IMT({ onInterested }) {
  const [headingRef, headingVisible] = useScrollReveal()
  const [ctaRef, ctaVisible] = useScrollReveal()
  const [activeIndex, setActiveIndex] = useState(-1)

  return (
    <section id="imt" className="section-cream" style={{ padding: '88px 0 80px' }}>
      <style>{`
        .imt-toggle:hover {
          background-color: #000000 !important;
          color: #ffffff !important;
        }
      `}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 40px' }}>

        {/* Heading */}
        <div
          ref={headingRef}
          className={`reveal ${headingVisible ? 'is-visible' : ''}`}
          style={{ marginBottom: '52px' }}
        >
          <span className="eyebrow eyebrow-light" style={{ marginBottom: '14px', display: 'flex' }}>For Incubation Professionals</span>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h2 className="section-h2-light font-display" style={{ marginBottom: '14px' }}>
                Incubation Management Training
              </h2>
              <div style={{ maxWidth: '480px' }}>
                <p style={{
                  fontSize: 'clamp(18px, 2vw, 20px)',
                  fontWeight: 800,
                  color: '#000000',
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  Strong founders need strong incubation ecosystems.
                </p>
                <p style={{
                  fontSize: 'clamp(18px, 2vw, 20px)',
                  fontWeight: 500,
                  color: '#1e293b',
                  lineHeight: 1.4,
                  margin: '10px 0 0',
                }}>
                  IMT is the first professional development framework designed
                  <strong style={{ fontWeight: 800, color: '#000000' }}> for people who run incubators and accelerators</strong> — not for founders.
                </p>
                <p style={{
                  fontSize: 'clamp(18px, 2vw, 20px)',
                  fontWeight: 800,
                  color: '#000000',
                  lineHeight: 1.4,
                  margin: '10px 0 0',
                }}>
                  Five focus areas. One cohesive capability model.
                </p>
              </div>
            </div>
            {/* Stat */}
            <div style={{
              border: '2px solid rgba(15,23,42,0.20)',
              borderRadius: '14px',
              padding: '24px 28px',
              textAlign: 'center',
              flexShrink: 0,
              background: 'rgba(15,23,42,0.03)',
            }}>
              <div style={{ fontSize: '36px', fontWeight: 900, color: '#000000', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>5</div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(15,23,42,0.60)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '6px' }}>Focus Areas</div>
            </div>
          </div>
        </div>

        {/* Focus list */}
        <div style={{ borderTop: '2px solid rgba(15,23,42,0.20)', marginBottom: '36px' }}>
          {FOCUS_AREAS.map((area, i) => (
            <FocusRow
              key={area.num}
              area={area}
              delay={i * 60}
              isActive={activeIndex === i}
              onToggle={() => setActiveIndex(prev => prev === i ? -1 : i)}
            />
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className={`reveal ${ctaVisible ? 'is-visible' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onInterested?.()}
            className="btn-gold"
          >
            I&rsquo;m interested in IMT →
          </button>
          <p style={{ fontSize: '13px', fontWeight: 500, color: 'rgba(15,23,42,0.55)', lineHeight: 1.6 }}>
            Practice-led, not purely theoretical.
          </p>
        </div>

      </div>
    </section>
  )
}