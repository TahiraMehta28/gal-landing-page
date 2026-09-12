import useScrollReveal from '../hooks/useScrollReveal'
import HeroCanvas from './HeroCanvas'
import ImageSlider from './ImageSlider'

// Dynamically import any image placed into src/assets/images directory
const imageModules = import.meta.glob('../assets/images/*.{png,jpg,jpeg,webp,svg,gif,PNG,JPG,JPEG,WEBP,SVG,GIF}', {
  eager: true,
  import: 'default',
})

const heroImages = Object.values(imageModules)

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
      <HeroCanvas />

      <div
        ref={textRef}
        className={`relative z-10 w-full max-w-6xl mx-auto px-8 md:px-14 reveal ${textVisible ? 'is-visible' : ''}`}
        style={{ paddingTop: '120px', paddingBottom: '120px' }}
      >
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            <div style={{ marginBottom: '18px' }}>
              <span style={{ fontSize: '19px', fontWeight: 600, color: '#C9A227', letterSpacing: '0.04em' }}>
                Global Acceleration Lab
              </span>
            </div>

            <h1
              className="font-display font-bold"
              style={{ fontSize: 'clamp(54px, 7.5vw, 84px)', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: '22px' }}
            >
              Build <span style={{ color: '#C9A227' }}>what</span>
              <br />
              matters.
            </h1>

            <p style={{ fontSize: '24px', color: 'rgba(255,255,255,0.92)', fontWeight: 600, marginBottom: '18px', letterSpacing: '-0.01em' }}>
              To you. To others. To the future.
            </p>

            <p
              style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.80)',
                lineHeight: 1.65,
                maxWidth: '540px',
                marginBottom: '18px',
                fontWeight: 400,
              }}
            >
              Global Acceleration Lab is where the Innovation Triple Helix converges &mdash;
              Academia, Industry and Government &mdash; around the people who build a better future.
            </p>

            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                fontSize: '13px', color: 'rgba(255,255,255,0.60)',
                marginBottom: '32px',
                fontWeight: 500,
              }}
            >
              <span style={{ display: 'inline-block', width: '32px', height: '2px', background: '#C9A227' }} />
              Innovation &middot; Academia &middot; Industry &middot; Government
            </div>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={scrollToForm}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#fff',
                  border: 'none',
                  padding: '13px 26px',
                  borderRadius: '10px',
                  fontSize: '15.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(201,162,39,0.3)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B8880C'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C9A227'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                I&rsquo;m a GAL Builder &rarr;
              </button>

              <a
                href="#pathways"
                style={{
                  backgroundColor: 'transparent',
                  color: 'rgba(255,255,255,0.90)',
                  border: '1px solid rgba(255,255,255,0.28)',
                  padding: '13px 26px',
                  borderRadius: '10px',
                  fontSize: '15.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                See the pathways
              </a>
            </div>
          </div>

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
                boxShadow: '0 12px 36px rgba(0,0,0,0.35)',
              }}
            >
              <ImageSlider images={heroImages} height="215px" />

              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#C9A227',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '14px',
                }}
              >
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#C9A227' }} />
                Start Building
              </div>

              <p
                className="font-display font-bold"
                style={{ fontSize: '24px', lineHeight: 1.25, color: '#fff', marginBottom: '12px' }}
              >
                What are you building?
              </p>

              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, marginBottom: '22px', fontWeight: 400 }}>
                No forms about who you are. Just tell us what you&rsquo;re trying to build &mdash;
                we&rsquo;ll ask the rest as we go.
              </p>

              <button
                type="button"
                onClick={scrollToForm}
                style={{
                  width: '100%',
                  backgroundColor: '#C9A227',
                  color: '#fff',
                  border: 'none',
                  padding: '14px',
                  borderRadius: '10px',
                  fontSize: '15.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.15s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(201,162,39,0.25)',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#B8880C'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#C9A227'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Tell GAL &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

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