import { useState, useCallback } from 'react'
import { faqs } from '../data/faq'
import WheelWidget from './WheelWidget'
import useScrollReveal from '../hooks/useScrollReveal'

function FAQItemLight({ faq, isOpen, onToggle }) {
  return (
    <div style={{
      borderBottom: '1px solid rgba(28,26,21,0.12)',
      transition: 'background 0.22s',
      borderRadius: '0',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', display: 'flex',
          alignItems: 'flex-start', justifyContent: 'space-between',
          gap: '16px', padding: '20px 4px',
          background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}
        aria-expanded={isOpen}
      >
        <span style={{
          fontSize: '17px', fontWeight: 700,
          color: isOpen ? '#C9A227' : '#0f172a',
          lineHeight: 1.4, flex: 1,
          transition: 'color 0.2s',
        }}>
          {faq.question}
        </span>
        <span style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          backgroundColor: isOpen ? '#C9A227' : 'rgba(28,26,21,0.08)',
          color: isOpen ? '#1C1A15' : 'rgba(28,26,21,0.70)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '18px', fontWeight: 700, marginTop: '1px',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'all 0.30s cubic-bezier(0.22,1,0.36,1)',
        }}>
          +
        </span>
      </button>

      <div style={{
        maxHeight: isOpen ? '360px' : '0px',
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
      }}>
        <div style={{ padding: '0 4px 22px' }}>
          <div className="divider-gold" style={{ marginBottom: '14px', height: '2px', backgroundColor: '#C9A227' }} />
          <p style={{
            fontSize: '15.5px',
            fontWeight: 700,
            color: '#1e293b',
            lineHeight: 1.7,
            margin: 0,
          }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  // rotationIndex: where the wheel physically points — persists even after the
  // matching FAQ item is collapsed, so the wheel never snaps back unexpectedly.
  const [rotationIndex, setRotationIndex] = useState(0)
  // openIndex: which FAQ item is expanded — null means none are open. This also
  // drives the wheel's solid-black "selected" styling.
  const [openIndex, setOpenIndex] = useState(0)

  const [headingRef, headingVisible] = useScrollReveal()
  const [contentRef, contentVisible] = useScrollReveal()

  // Clicking a wheel node always opens its FAQ and rotates the wheel to it.
  const handleWheelSelect = useCallback((i) => {
    setRotationIndex(i)
    setOpenIndex(i)
  }, [])

  // Clicking an FAQ header is a true toggle: open items close, closed items
  // open (and rotate the wheel to match).
  const toggleItem = useCallback((i) => {
    setOpenIndex((prev) => (prev === i ? null : i))
    setRotationIndex(i)
  }, [])

  const wheelItems = faqs.map((f) => ({ id: f.id, nodeTitle: f.nodeTitle }))

  return (
    <section id="faq" className="section-cream" style={{ padding: '56px 0 72px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 40px' }}>

        {/* Heading */}
        <div
          ref={headingRef}
          className={`reveal ${headingVisible ? 'is-visible' : ''}`}
          style={{ marginBottom: '36px', maxWidth: '760px', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}
        >
          <span
            className="eyebrow eyebrow-light"
            style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}
          >
            Frequently Asked
          </span>
          <h2
            className="font-display"
            style={{
              marginBottom: '14px',
              color: '#000000',
              fontWeight: 800,
              fontSize: 'clamp(30px, 4.2vw, 46px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            Have questions?
          </h2>
          <p
            style={{
              fontSize: '17px',
              fontWeight: 600,
              color: '#3a362e',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto',
              whiteSpace: 'nowrap',
            }}
          >
            The wheel connects each topic, or{' '}
            <a href="#discovery-form" style={{ color: '#C9A227', fontWeight: 800, textDecoration: 'none' }}>contact us</a> directly.
          </p>
        </div>

        {/* Main layout: wheel LEFT, accordion RIGHT — vertically centered so both
            columns share the same visual height with no dead space. */}
        <div
          ref={contentRef}
          className={`reveal ${contentVisible ? 'is-visible' : ''}`}
          style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '48px', alignItems: 'center' }}
        >
          {/* Wheel */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WheelWidget
              items={wheelItems}
              rotationIndex={rotationIndex}
              activeIndex={openIndex}
              onSelect={handleWheelSelect}
            />
          </div>

          {/* Accordion */}
          <div>
            <div style={{ borderTop: '1px solid rgba(28,26,21,0.09)' }}>
              {faqs.map((faq, i) => (
                <FAQItemLight
                  key={faq.id}
                  faq={faq}
                  isOpen={openIndex === i}
                  onToggle={() => toggleItem(i)}
                />
              ))}
            </div>

            <p style={{ marginTop: '24px', fontSize: '13px', color: 'rgba(28,26,21,0.45)', lineHeight: 1.6 }}>
              Still have something on your mind?{' '}
              <a href="#discovery-form" style={{ color: '#C9A227', fontWeight: 600, textDecoration: 'none' }}>
                Tell GAL directly →
              </a>
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}