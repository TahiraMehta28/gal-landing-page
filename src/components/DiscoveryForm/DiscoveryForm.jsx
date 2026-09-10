import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { formSteps } from '../../data/formSteps'
import useScrollReveal from '../../hooks/useScrollReveal'
import ProgressBar from './ProgressBar'
import StepText from './StepText'
import StepRadio from './StepRadio'
import StepMultiSelect from './StepMultiSelect'
import StepContact from './StepContact'
import StepConsent from './StepConsent'
import SuccessState from './SuccessState'

const TOTAL_STEPS = formSteps.length

const initialAnswers = {
  1: '',
  2: '',
  3: [],
  4: '',
  5: { persona: '', name: '', org: '', role: '', location: '', email: '', mobile: '' },
  6: [],
}

const DiscoveryForm = forwardRef(function DiscoveryForm(_, ref) {
  const [current, setCurrent] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [answers, setAnswers] = useState(initialAnswers)
  const [cardRef, cardVisible] = useScrollReveal()
  const sectionRef = useRef(null)

  useImperativeHandle(ref, () => ({
    goToStep(step) {
      setSubmitted(false)
      setCurrent(step)
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
    },
  }))

  const step = formSteps.find((s) => s.id === current)
  const updateAnswer = (stepId, value) => setAnswers((prev) => ({ ...prev, [stepId]: value }))
  const toggleMulti = (stepId, option) =>
    setAnswers((prev) => {
      const list = prev[stepId]
      const next = list.includes(option) ? list.filter((o) => o !== option) : [...list, option]
      return { ...prev, [stepId]: next }
    })
  const updateContactField = (name, value) =>
    setAnswers((prev) => ({ ...prev, 5: { ...prev[5], [name]: value } }))
  const setPersona = (persona) =>
    setAnswers((prev) => ({ ...prev, 5: { ...prev[5], persona } }))
  const next = () => setCurrent((c) => Math.min(c + 1, TOTAL_STEPS))
  const back = () => setCurrent((c) => Math.max(c - 1, 1))
  const handleSubmit = () => { console.log('GAL discovery submission', answers); setSubmitted(true) }

  return (
    <section id="discovery-form" ref={sectionRef} className="section-dark-alt" style={{ padding: '48px 0 64px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '48px', alignItems: 'center' }}>

          {/* Left: heading + step tracker */}
          <div>
            <span className="eyebrow eyebrow-dark" style={{ marginBottom: '16px', display: 'flex' }}>Tell GAL</span>
            <h2 className="font-display" style={{
              marginBottom: '14px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 48px)',
              lineHeight: 1.08,
            }}>
              Let&rsquo;s have the
              <br />
              <span style={{
                color: '#f59e0b',
                fontStyle: 'italic',
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontWeight: 700,
              }}>
                real conversation.
              </span>
            </h2>
            <p style={{
              marginBottom: '36px',
              maxWidth: '320px',
              color: '#d4d4d4',
              fontWeight: 500,
              fontSize: '16px',
              lineHeight: 1.65,
            }}>
              Six short steps. No name or email until the end — we want to hear what
              you&rsquo;re building before we ask who you are.
            </p>

            {/* Step tracker: each row owns its own gutter (circle + connector), so the
                line always meets the next circle exactly, regardless of row height. */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {formSteps.map((s, idx) => {
                const isActive = current === s.id
                const isDone = current > s.id
                const isLast = idx === formSteps.length - 1
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'stretch', gap: '12px' }}>
                    {/* gutter: circle + connector */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '22px', flexShrink: 0 }}>
                      <span style={{
                        width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                        background: isDone ? '#f59e0b' : isActive ? 'rgba(245,158,11,0.20)' : '#262626',
                        border: isActive || isDone ? '1.5px solid #f59e0b' : '1.5px solid #404040',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '10px', fontWeight: 700,
                        color: isDone ? '#1C1A15' : isActive ? '#f59e0b' : '#d4d4d4',
                        transition: 'all 0.3s ease',
                      }}>
                        {isDone ? '✓' : s.id}
                      </span>
                      {!isLast && (
                        <div style={{
                          flex: 1,
                          width: '2px',
                          minHeight: '10px',
                          margin: '3px 0',
                          borderRadius: '999px',
                          background: isDone ? '#f59e0b' : 'rgba(255,255,255,0.12)',
                          transition: 'background-color 0.3s ease',
                        }} />
                      )}
                    </div>

                    {/* label / active card */}
                    <div style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center',
                      marginBottom: '4px',
                      padding: isActive ? '10px 12px' : '9px 0',
                      borderRadius: '12px',
                      background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                      border: isActive ? '1px solid rgba(255,255,255,0.20)' : '1px solid transparent',
                      backdropFilter: isActive ? 'blur(8px)' : 'none',
                      WebkitBackdropFilter: isActive ? 'blur(8px)' : 'none',
                      transition: 'all 0.3s ease',
                    }}>
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#ffffff' : isDone ? 'rgba(255,255,255,0.45)' : '#d4d4d4',
                          transition: 'color 0.2s',
                          cursor: 'default',
                        }}
                        onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#ffffff' }}
                        onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = isDone ? 'rgba(255,255,255,0.45)' : '#d4d4d4' }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: form card */}
          <div ref={cardRef} className={`slide-in ${cardVisible ? 'is-visible' : ''}`}>
            <div
              style={{
                background: 'rgba(23,23,23,0.90)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 25px 60px rgba(0,0,0,0.50)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                transition: 'border-color 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
            >
              {!submitted && <ProgressBar current={current} total={TOTAL_STEPS} />}

              {submitted ? (
                <SuccessState />
              ) : (
                <>
                  {step.type === 'text' && <StepText step={step} value={answers[step.id]} onChange={(v) => updateAnswer(step.id, v)} />}
                  {step.type === 'radio' && <StepRadio step={step} value={answers[step.id]} onChange={(v) => updateAnswer(step.id, v)} />}
                  {step.type === 'multiselect' && <StepMultiSelect step={step} values={answers[step.id]} onToggle={(opt) => toggleMulti(step.id, opt)} />}
                  {step.type === 'contact' && <StepContact step={step} persona={answers[5].persona} onPersonaChange={setPersona} values={answers[5]} onFieldChange={updateContactField} />}
                  {step.type === 'consent' && <StepConsent step={step} values={answers[6]} onToggle={(opt) => toggleMulti(6, opt)} onSubmit={handleSubmit} />}

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', alignItems: 'center' }}>
                    <button
                      type="button" onClick={back}
                      style={{
                        padding: '9px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
                        color: 'rgba(255,255,255,0.40)', background: 'none',
                        border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
                        fontFamily: 'inherit', visibility: current === 1 ? 'hidden' : 'visible',
                        transition: 'color 0.2s, border-color 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.40)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      ← Back
                    </button>
                    {step.type !== 'consent' && (
                      <button
                        type="button"
                        onClick={next}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '13px 24px', borderRadius: '12px',
                          background: '#f59e0b', color: '#020617',
                          fontWeight: 700, fontSize: '14px',
                          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                          boxShadow: '0 10px 24px rgba(245,158,11,0.20)',
                          transition: 'background-color 0.2s ease, transform 0.15s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#fbbf24' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f59e0b' }}
                      >
                        Continue →
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
})

export default DiscoveryForm