import useScrollReveal from '../hooks/useScrollReveal'
import HeroCanvas from './HeroCanvas'

export default function Hero() {
  const [textRef, textVisible] = useScrollReveal()
  const [cardRef, cardVisible] = useScrollReveal()

  const scrollToForm = () => {
    document.getElementById('discovery-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: '#181512', color: '#ffffff' }}
    >
      {/* Animated bokeh orbs */}
      <HeroCanvas />

      {/* Content grid — no extra overlay, let the canvas show through naturally */}
      <div
        ref={textRef}
        className={`relative z-10 w-full max-w-6xl mx-auto px-8 md:px-14 reveal ${textVisible ? 'is-visible' : ''}`}
        style={{ paddingTop: '120px', paddingBottom: '120px' }}
      >
        <div className="grid md:grid-cols-12 gap-10 items-center">

          {/* ── Left Column ───────────────────────────── */}
          <div className="md:col-span-7">
            {/* Badge */}
            <div style={{ marginBottom: '20px' }}>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.04em' }}>
                Global Acceleration Lab
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(52px, 7vw, 80px)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '20px' }}
            >
              Build <span style={{ color: '#C9A227' }}>what</span>
              <br />
              matters.
            </h1>

            {/* Subline */}
            <p
              style={{ fontSize: '20px', color: 'rgba(255,255,255,0.78)', fontWeight: 500, marginBottom: '20px' }}
            >
              To you. To others. To the future.
            </p>

            {/* Body */}
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.65,
                maxWidth: '440px',
                marginBottom: '14px',
              }}
            >
              Global Acceleration Lab is where the Innovation Triple Helix converges &mdash;
              Academia, Industry and Government &mdash; around the people who build a better future.
            </p>

            {/* Innovation line */}
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '11px', color: 'rgba(255,255,255,0.35)',
                marginBottom: '32px',
              }}
            >
              <span style={{ display: 'inline-block', width: '28px', height: '1px', background: 'rgba(255,255,255,0.2)' }} />
              Innovation &middot; Academia &middot; Industry &middot; Government
            </div>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={scrollToForm}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#fff',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B8880C'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A227'}
              >
                I&rsquo;m a GAL Builder &rarr;
              </button>

              <a
                href="#pathways"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.85)',
                  border: '1px solid rgba(255,255,255,0.22)',
                  padding: '11px 22px',
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
              >
                See the pathways
              </a>
            </div>
          </div>

          {/* ── Right Card ────────────────────────────── */}
          <div
            ref={cardRef}
            className={`md:col-span-5 slide-in ${cardVisible ? 'is-visible' : ''}`}
          >
            <div
              style={{
                backgroundColor: '#252019',
                borderRadius: '16px',
                padding: '28px 30px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {/* Card badge */}
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px',
                  fontSize: '11px', fontWeight: 700,
                  color: '#C9A227',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9A227' }} />
                Start Building
              </div>

              {/* Card heading */}
              <p
                className="font-display font-bold"
                style={{ fontSize: '22px', lineHeight: 1.3, color: '#fff', marginBottom: '12px' }}
              >
                What matters enough to you to build it?
              </p>

              {/* Card body */}
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '22px' }}>
                No forms about who you are. Just tell us what you&rsquo;re trying to build &mdash;
                we&rsquo;ll ask the rest as we go.
              </p>

              {/* Card CTA */}
              <button
                onClick={scrollToForm}
                style={{
                  width: '100%',
                  backgroundColor: '#C9A227',
                  color: '#fff',
                  border: 'none',
                  padding: '13px',
                  borderRadius: '9px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#B8880C'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#C9A227'}
              >
                Tell GAL &rarr;
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom wave transitioning into cream body */}
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          lineHeight: 0, pointerEvents: 'none', zIndex: 20,
        }}
      >
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '56px' }}>
          <path
            d="M0,40 C200,80 450,5 750,45 C1050,85 1280,18 1440,38 L1440,80 L0,80 Z"
            fill="#FDFBF5"
          />
        </svg>
      </div>
    </section>
  )
}