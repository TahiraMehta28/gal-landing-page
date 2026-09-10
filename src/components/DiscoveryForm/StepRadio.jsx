export default function StepRadio({ step, value, onChange }) {
  return (
    <div>
      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
        {step.title}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '18px', lineHeight: 1.6 }}>
        {step.helper}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {step.options.map((option) => {
          const sel = value === option
          return (
            <label key={option} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px', borderRadius: '10px',
              border: sel ? '1.5px solid #C9A227' : '1px solid rgba(255,255,255,0.09)',
              background: sel ? 'rgba(201,162,39,0.12)' : 'rgba(255,255,255,0.03)',
              cursor: 'pointer', fontSize: '13px',
              color: sel ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: sel ? 600 : 400,
              transition: 'all 0.2s ease',
            }}>
              <input type="radio" name={step.name} checked={sel} onChange={() => onChange(option)} style={{ accentColor: '#C9A227' }} />
              {option}
            </label>
          )
        })}
      </div>
    </div>
  )
}
