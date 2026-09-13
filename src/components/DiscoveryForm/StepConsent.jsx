export default function StepConsent({ step, values, onToggle, onSubmit, isSubmitting = false }) {
  return (
    <div>
      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
        {step.title}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '18px', lineHeight: 1.6 }}>
        {step.helper}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '24px' }}>
        {step.options.map((option) => {
          const checked = values.includes(option)
          return (
            <button key={option} type="button" onClick={() => onToggle(option)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '10px', textAlign: 'left',
              border: checked ? '1.5px solid #C9A227' : '1px solid rgba(255,255,255,0.09)',
              background: checked ? 'rgba(201,162,39,0.10)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s ease',
            }}>
              <span style={{
                width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                border: checked ? '2px solid #C9A227' : '1.5px solid rgba(255,255,255,0.20)',
                background: checked ? '#C9A227' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', color: '#1C1A15',
                transition: 'all 0.2s ease',
              }}>
                {checked && '✓'}
              </span>
              <span style={{ fontSize: '13px', fontWeight: checked ? 600 : 400, color: checked ? '#fff' : 'rgba(255,255,255,0.65)', lineHeight: 1.45 }}>
                {option}
              </span>
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="btn-gold"
        style={{
          width: '100%',
          justifyContent: 'center',
          padding: '13px',
          opacity: isSubmitting ? 0.7 : 1,
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
        }}
      >
        {isSubmitting ? 'Saving response...' : 'Count me in →'}
      </button>
    </div>
  )
}
