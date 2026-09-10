export default function StepMultiSelect({ step, values, onToggle }) {
  return (
    <div>
      <style>{`
        .gal-ms-grid::-webkit-scrollbar { width: 6px; }
        .gal-ms-grid::-webkit-scrollbar-track { background: transparent; }
        .gal-ms-grid::-webkit-scrollbar-thumb { background: rgba(245,158,11,0.45); border-radius: 999px; }
      `}</style>
      <h3 className="font-display" style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '5px' }}>
        {step.title}
      </h3>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px', lineHeight: 1.6 }}>
        {step.helper}
      </p>
      <div
        className="gal-ms-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          maxHeight: '270px',
          overflowY: 'auto',
          paddingRight: '6px',
        }}
      >
        {step.options.map((option) => {
          const checked = values.includes(option)
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                width: '100%', minHeight: '44px', boxSizing: 'border-box',
                padding: '10px 14px', borderRadius: '10px', fontSize: '12px',
                textAlign: 'left', lineHeight: 1.35,
                border: checked ? '1.5px solid #C9A227' : '1px solid rgba(255,255,255,0.10)',
                background: checked ? 'rgba(201,162,39,0.15)' : 'rgba(255,255,255,0.04)',
                color: checked ? '#C9A227' : 'rgba(255,255,255,0.65)',
                fontWeight: checked ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.18s ease',
              }}
            >
              {checked && '✓ '}{option}
            </button>
          )
        })}
      </div>
    </div>
  )
}