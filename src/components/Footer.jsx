import useScrollReveal from '../hooks/useScrollReveal'

export default function Footer() {
  const [ref, visible] = useScrollReveal()

  return (
    <footer
      className="section-dark"
      style={{ padding: '80px 40px 48px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`}>
        <h2
          className="font-display"
          style={{
            fontSize: 'clamp(26px, 4vw, 48px)', fontWeight: 700,
            letterSpacing: '-0.02em', lineHeight: 1.15,
            maxWidth: '600px', margin: '0 auto 28px',
            color: '#fff',
          }}
        >
          Build what matters.
          <br />
          <span className="gold">To you. To others. To the future.</span>
        </h2>

        <a
          href="#discovery-form"
          className="btn-gold"
          style={{ display: 'inline-flex', fontSize: '15px', padding: '14px 32px' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#B8880C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#C9A227'; e.currentTarget.style.transform = 'translateY(0)' }}
        >
          Start the conversation →
        </a>
      </div>

      <p style={{ marginTop: '56px', fontSize: '12px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em' }}>
        Global Acceleration Lab &mdash; a Triple Helix initiative for Academia, Industry and Government.
      </p>
    </footer>
  )
}
