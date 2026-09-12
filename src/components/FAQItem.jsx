export default function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className="faq-card"
      style={{
        background: isOpen
          ? 'rgba(201,74,16,0.08)'
          : 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '14px',
        border: isOpen
          ? '1px solid rgba(201,74,16,0.30)'
          : '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        transition: 'box-shadow 0.3s, background 0.3s, border-color 0.3s, transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        transform: isOpen ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isOpen
          ? '0 8px 36px rgba(201,74,16,0.14), 0 2px 8px rgba(0,0,0,0.20)'
          : '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '18px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
        aria-expanded={isOpen}
      >
        {/* Node label */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '3px 9px',
              borderRadius: '6px',
              fontSize: '9px',
              fontWeight: 800,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              background: isOpen ? 'rgba(201,74,16,0.18)' : 'rgba(255,255,255,0.06)',
              color: isOpen ? '#C94A10' : 'rgba(255,255,255,0.35)',
              border: isOpen ? '1px solid rgba(201,74,16,0.28)' : '1px solid rgba(255,255,255,0.08)',
              flexShrink: 0,
              marginTop: '2px',
              transition: 'all 0.3s',
            }}
          >
            {faq.nodeTitle}
          </span>

          <span
            style={{
              fontSize: '16.5px',
              fontWeight: 700,
              color: isOpen ? '#fff' : 'rgba(255,255,255,0.85)',
              lineHeight: 1.4,
              transition: 'color 0.2s',
            }}
          >
            {faq.question}
          </span>
        </div>

        {/* Toggle icon */}
        <span
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: isOpen ? '#C94A10' : 'rgba(255,255,255,0.07)',
            color: isOpen ? '#fff' : 'rgba(255,255,255,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: 1,
            transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            marginTop: '1px',
          }}
        >
          +
        </span>
      </button>

      {/* Answer */}
      <div
        style={{
          maxHeight: isOpen ? '360px' : '0px',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'max-height 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease',
        }}
      >
        <div style={{ padding: '0 20px 20px', paddingLeft: '20px' }}>
          <div
            style={{
              width: '28px',
              height: '2px',
              backgroundColor: '#C94A10',
              borderRadius: '2px',
              marginBottom: '12px',
              marginLeft: '42px',
              opacity: 0.7,
            }}
          />
          <p
            style={{
              fontSize: '15.5px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.92)',
              lineHeight: 1.7,
              margin: 0,
              paddingLeft: '42px',
            }}
          >
            {faq.answer}
          </p>
        </div>
      </div>
    </div>
  )
}
