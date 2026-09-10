const fieldStyle = {
  width: '100%', background: 'rgba(255,255,255,0.06)',
  border: '1.5px solid rgba(255,255,255,0.10)', borderRadius: '10px',
  padding: '11px 14px', fontSize: '13px', color: '#fff',
  fontFamily: 'Inter, sans-serif', outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
}
const onFocus = e => { e.currentTarget.style.borderColor = '#C9A227'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(201,162,39,0.12)' }
const onBlur  = e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; e.currentTarget.style.boxShadow = 'none' }

export default function StepContact({ step, persona, onPersonaChange, values, onFieldChange }) {
  return (
    <div>
      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
        {step.title}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px', lineHeight: 1.6 }}>
        {step.helper}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '18px' }}>
        {step.personas.map((option) => {
          const sel = persona === option
          return (
            <button key={option} type="button" onClick={() => onPersonaChange(option)} style={{
              padding: '7px 13px', borderRadius: '8px', fontSize: '12px', fontFamily: 'inherit',
              border: sel ? '1.5px solid #C9A227' : '1px solid rgba(255,255,255,0.10)',
              background: sel ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
              color: sel ? '#C9A227' : 'rgba(255,255,255,0.60)',
              fontWeight: sel ? 700 : 400, cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}>
              {option}
            </button>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {step.fields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.name] || ''}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            className="field-dark"
            style={fieldStyle}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        ))}
      </div>
    </div>
  )
}
