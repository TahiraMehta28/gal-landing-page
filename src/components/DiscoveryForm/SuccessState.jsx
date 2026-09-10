export default function SuccessState() {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div style={{
        width: '52px', height: '52px', borderRadius: '50%',
        background: 'rgba(201,162,39,0.15)', border: '2px solid #C9A227',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: '20px', color: '#C9A227',
      }}>
        ✓
      </div>
      <h3 className="font-display" style={{ fontSize: '22px', fontWeight: 700, color: '#fff', marginBottom: '10px' }}>
        You&rsquo;re a GAL Builder.
      </h3>
      <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.52)', maxWidth: '280px', margin: '0 auto', lineHeight: 1.72 }}>
        We&rsquo;ll use what Builders tell us to decide what GAL builds first. We&rsquo;ll be in touch.
      </p>
    </div>
  )
}
