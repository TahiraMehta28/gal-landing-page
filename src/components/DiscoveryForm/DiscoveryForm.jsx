import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { formSteps } from '../../data/formSteps'
import useScrollReveal from '../../hooks/useScrollReveal'
import ProgressBar from './ProgressBar'
import StepText from './StepText'
import StepRadio from './StepRadio'
import StepMultiSelect from './StepMultiSelect'
import StepContact from './StepContact'
import StepConsent from './StepConsent'
import SuccessState from './SuccessState'
import { TELL_GAL_API_URL as API_BASE } from '../../config/api'

const TOTAL_STEPS = formSteps.length

const initialAnswers = {
  1: '',
  2: '',
  3: [],
  4: '',
  5: { persona: '', name: '', org: '', role: '', location: '', email: '', mobile: '' },
  6: [],
}

const DiscoveryForm = forwardRef(function DiscoveryForm({ user }, ref) {
  const [current, setCurrent] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [hasExistingResponse, setHasExistingResponse] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [answers, setAnswers] = useState(initialAnswers)
  const [cardRef, cardVisible] = useScrollReveal()
  const sectionRef = useRef(null)

  // Fetch any existing response when user logs in or mounts
  useEffect(() => {
    const fetchExistingSubmission = async () => {
      try {
        const token = localStorage.getItem('gal_token')
        const storedUser = user || JSON.parse(localStorage.getItem('gal_user') || 'null')
        const email = storedUser?.email || ''

        const url = `${API_BASE}/my-submission${email ? `?email=${encodeURIComponent(email)}` : ''}`
        const headers = {}
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        const res = await fetch(url, { headers })
        const json = await res.json()

        if (json.success && json.hasResponded && json.data?.answers) {
          setAnswers((prev) => ({
            ...prev,
            ...json.data.answers,
            5: {
              ...prev[5],
              ...(json.data.answers[5] || {}),
            },
          }))
          setSubmitted(true)
          setHasExistingResponse(true)
        } else if (storedUser) {
          // Pre-fill user name/email if user is logged in
          setAnswers((prev) => ({
            ...prev,
            5: {
              ...prev[5],
              name: prev[5].name || storedUser.name || '',
              email: prev[5].email || storedUser.email || '',
            },
          }))
        }
      } catch (err) {
        console.warn('Could not fetch existing Tell GAL response:', err.message)
      }
    }

    fetchExistingSubmission()
  }, [user])

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
      const list = prev[stepId] || []
      const next = list.includes(option) ? list.filter((o) => o !== option) : [...list, option]
      return { ...prev, [stepId]: next }
    })
  const updateContactField = (name, value) =>
    setAnswers((prev) => ({ ...prev, 5: { ...prev[5], [name]: value } }))
  const setPersona = (persona) =>
    setAnswers((prev) => ({ ...prev, 5: { ...prev[5], persona } }))
  const next = () => setCurrent((c) => Math.min(c + 1, TOTAL_STEPS))
  const back = () => setCurrent((c) => Math.max(c - 1, 1))

  const handleEdit = () => {
    setSubmitted(false)
    setCurrent(1)
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const token = localStorage.getItem('gal_token')
      const headers = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save response in MongoDB')
      }

      setHasExistingResponse(true)
      setSubmitted(true)
    } catch (err) {
      console.error('Submit error:', err)
      setSubmitError(err.message || 'Error connecting to backend')
      // Even if offline, show submitted locally so user flow is not broken
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="discovery-form" ref={sectionRef} className="section-dark-alt" style={{ padding: '48px 0 64px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '48px', alignItems: 'center' }}>

          {/* Left: heading + step tracker */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span className="eyebrow eyebrow-dark">Tell GAL</span>
              {hasExistingResponse && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#4ade80',
                  background: 'rgba(34,197,94,0.12)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                }}>
                  Response Recorded
                </span>
              )}
            </div>

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
              {hasExistingResponse
                ? 'Your responses are safely stored in MongoDB. You can review what you submitted or edit anytime.'
                : 'Six short steps. No name or email until the end — we want to hear what you’re building before we ask who you are.'}
            </p>

            {/* Step tracker */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {formSteps.map((s, idx) => {
                const isActive = current === s.id && !submitted
                const isDone = submitted || current > s.id
                const isLast = idx === formSteps.length - 1
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'stretch', gap: '14px' }}>
                    {/* gutter */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '28px', flexShrink: 0 }}>
                      <span style={{
                        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                        background: isDone ? '#f59e0b' : isActive ? 'rgba(245,158,11,0.25)' : '#262626',
                        border: isActive || isDone ? '2px solid #f59e0b' : '2px solid #404040',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: 800,
                        color: isDone ? '#1C1A15' : isActive ? '#f59e0b' : '#e5e5e5',
                        transition: 'all 0.3s ease',
                      }}>
                        {isDone ? '✓' : s.id}
                      </span>
                      {!isLast && (
                        <div style={{
                          flex: 1,
                          width: '2.5px',
                          minHeight: '14px',
                          margin: '4px 0',
                          borderRadius: '999px',
                          background: isDone ? '#f59e0b' : 'rgba(255,255,255,0.15)',
                          transition: 'background-color 0.3s ease',
                        }} />
                      )}
                    </div>

                    {/* label */}
                    <div
                      onClick={() => {
                        if (hasExistingResponse) {
                          setSubmitted(false)
                          setCurrent(s.id)
                        }
                      }}
                      style={{
                        flex: 1,
                        display: 'flex', alignItems: 'center',
                        marginBottom: '6px',
                        padding: isActive ? '10px 14px' : '8px 0',
                        borderRadius: '12px',
                        background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                        border: isActive ? '1px solid rgba(255,255,255,0.24)' : '1px solid transparent',
                        cursor: hasExistingResponse ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <span
                        style={{
                          fontSize: isActive ? '15px' : '14px',
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? '#ffffff' : isDone ? 'rgba(255,255,255,0.75)' : '#d4d4d4',
                          transition: 'color 0.2s',
                        }}
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
            >
              {!submitted && <ProgressBar current={current} total={TOTAL_STEPS} />}

              {hasExistingResponse && !submitted && (
                <div style={{
                  marginBottom: '18px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.25)',
                  color: '#fbbf24',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span>✏️ Editing your saved response</span>
                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    View Summary &rarr;
                  </button>
                </div>
              )}

              {submitError && (
                <div style={{
                  marginBottom: '16px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                  fontSize: '13px',
                }}>
                  {submitError}
                </div>
              )}

              {submitted ? (
                <SuccessState answers={answers} onEdit={handleEdit} />
              ) : (
                <>
                  {step.type === 'text' && <StepText step={step} value={answers[step.id]} onChange={(v) => updateAnswer(step.id, v)} />}
                  {step.type === 'radio' && <StepRadio step={step} value={answers[step.id]} onChange={(v) => updateAnswer(step.id, v)} />}
                  {step.type === 'multiselect' && <StepMultiSelect step={step} values={answers[step.id]} onToggle={(opt) => toggleMulti(step.id, opt)} />}
                  {step.type === 'contact' && <StepContact step={step} persona={answers[5].persona} onPersonaChange={setPersona} values={answers[5]} onFieldChange={updateContactField} />}
                  {step.type === 'consent' && (
                    <StepConsent
                      step={step}
                      values={answers[6]}
                      onToggle={(opt) => toggleMulti(6, opt)}
                      onSubmit={handleSubmit}
                      isSubmitting={isSubmitting}
                    />
                  )}

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
                    {step.type !== 'consent' ? (
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
                    ) : (
                      <button
                        id="gal-builder-submit-btn"
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '13px 28px', borderRadius: '12px',
                          background: isSubmitting
                            ? 'rgba(245,158,11,0.55)'
                            : 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                          color: '#020617',
                          fontWeight: 800, fontSize: '15px',
                          border: 'none',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit',
                          boxShadow: isSubmitting
                            ? 'none'
                            : '0 10px 28px rgba(245,158,11,0.35)',
                          transition: 'all 0.2s ease',
                          letterSpacing: '0.01em',
                        }}
                        onMouseEnter={e => { if (!isSubmitting) e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        {isSubmitting ? (
                          <>
                            <span style={{
                              width: '14px', height: '14px', border: '2px solid #020617',
                              borderTopColor: 'transparent', borderRadius: '50%',
                              display: 'inline-block', animation: 'spin 0.7s linear infinite',
                            }} />
                            Submitting…
                          </>
                        ) : (
                          <>✦ Submit</>
                        )}
                      </button>
                    )}
                  </div>
                  {step.type === 'consent' && (
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  )}
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