import { useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

const PANELS = [
  {
    id: 'academia',
    label: 'Academia',
    role: 'Brings research & talent',
    description: 'Universities, research institutes and knowledge networks that surface ideas worth building. GAL channels this output toward real-world application and commercialisation.',
    detail: [
      'Research talent and knowledge',
      'IP, patents and technology transfer',
      'Lab access and prototyping',
      'Global research connections',
    ],
  },
  {
    id: 'builder',
    label: 'The Builder',
    role: 'At the centre',
    description: 'You — the founder, researcher or professional with a problem worth solving. Everything GAL does is organised around making your journey faster and less lonely.',
    detail: [
      'Founder or startup team',
      'Researcher or academic',
      'Incubation professional',
      'Student innovator',
    ],
    emphasis: true,
  },
  {
    id: 'industry',
    label: 'Industry',
    role: 'Brings markets & capital',
    description: 'Corporations, SMEs and sector partners who bring genuine problems, distribution channels and early commercial validation to the ecosystem.',
    detail: [
      'Real market problems',
      'Distribution and access',
      'Early commercial validation',
      'Corporate investment',
    ],
  },
  {
    id: 'government',
    label: 'Government',
    role: 'Brings policy & funding',
    description: 'Regulatory frameworks, public funding mechanisms and infrastructure investment that make innovation viable at scale — not just at demo day.',
    detail: [
      'Public funding and grants',
      'Policy support and regulation',
      'Infrastructure investment',
      'Scale enablement',
    ],
  },
]

function Panel({ panel, delay }) {
  const [ref, visible] = useScrollReveal()
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`slide-in ${visible ? 'is-visible' : ''}`}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: panel.emphasis ? 'rgba(201,162,39,0.10)' : 'rgba(255,255,255,0.04)',
          border: panel.emphasis
            ? '1px solid rgba(201,162,39,0.35)'
            : hovered ? '1px solid rgba(201,162,39,0.25)' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px',
          padding: '28px 24px',
          transform: panel.emphasis ? 'none' : hovered ? 'translateY(-5px)' : 'translateY(0)',
          transition: 'transform 0.30s cubic-bezier(0.22,1,0.36,1), border-color 0.30s, box-shadow 0.30s',
          boxShadow: hovered && !panel.emphasis ? '0 20px 48px rgba(0,0,0,0.30)' : 'none',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Role label */}
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: panel.emphasis ? '#C9A227' : 'rgba(255,255,255,0.35)',
          marginBottom: '12px',
        }}>
          {panel.role}
        </p>

        {/* Label */}
        <h3 className="font-display" style={{
          fontSize: '22px', fontWeight: 700,
          color: panel.emphasis ? '#C9A227' : '#fff',
          marginBottom: '12px', lineHeight: 1.2,
        }}>
          {panel.label}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '13px', lineHeight: 1.72,
          color: 'rgba(255,255,255,0.52)',
          marginBottom: '20px',
        }}>
          {panel.description}
        </p>

        {/* Detail list */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {panel.detail.map((d) => (
            <li key={d} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#C9A227', flexShrink: 0, marginTop: '6px', opacity: 0.8 }} />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function Ecosystem() {
  const [headingRef, headingVisible] = useScrollReveal()

  return (
    <section id="triple-helix" className="section-dark" style={{ padding: '88px 0 80px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>

        {/* Heading */}
        <div
          ref={headingRef}
          className={`reveal ${headingVisible ? 'is-visible' : ''}`}
          style={{ marginBottom: '52px', maxWidth: '600px' }}
        >
          <span className="eyebrow eyebrow-dark" style={{ marginBottom: '14px', display: 'flex' }}>The Triple Helix</span>
          <h2 className="section-h2-dark font-display" style={{ marginBottom: '14px' }}>
            You bring the work.
            <br />
            <span className="gold">The ecosystem brings the rest.</span>
          </h2>
          <p className="body-dark">
            GAL brings Academia, Industry and Government together around the builder — not the other way round.
            Most ecosystems ask builders to navigate them. GAL inverts that.
          </p>
        </div>

        {/* 4-panel grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {PANELS.map((panel, i) => (
            <Panel key={panel.id} panel={panel} delay={i * 100} />
          ))}
        </div>

      </div>
    </section>
  )
}
