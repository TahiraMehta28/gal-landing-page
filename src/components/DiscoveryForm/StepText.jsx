export default function StepText({ step, value, onChange }) {
  return (
    <div>
      <style>{`
        .gal-textarea::placeholder { color: rgba(163,163,163,0.75); }
      `}</style>
      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
        {step.title}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '18px', lineHeight: 1.6 }}>
        {step.helper}
      </p>
      <textarea
        rows={5}
        placeholder={step.placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="gal-textarea"
        style={{
          width: '100%',
          resize: 'vertical',
          background: 'rgba(2,6,23,0.80)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          padding: '12px 14px',
          fontSize: '13px',
          fontWeight: 500,
          color: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.15)' }}
        onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  )
}