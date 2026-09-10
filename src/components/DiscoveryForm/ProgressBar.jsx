export default function ProgressBar({ current, total }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '28px' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '999px',
            background: i < current ? '#f59e0b' : '#262626',
            transition: 'background-color 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}