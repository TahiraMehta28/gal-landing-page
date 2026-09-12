import { useEffect, useState } from 'react'

/**
 * WheelWidget — Enneagram-inspired interactive wheel synced with FAQ accordion.
 * Click-to-rotate only — no auto-advance timer.
 *
 * Props:
 *  items         – array of { id, nodeTitle }
 *  rotationIndex – index the wheel should physically rotate to (never null —
 *                  the wheel remembers its last position even if the FAQ closes)
 *  activeIndex   – index that should render with the solid-black "selected" state
 *                  (null when the matching FAQ item is collapsed)
 *  onSelect      – callback(index) when a node/label is clicked
 */
export default function WheelWidget({ items = [], rotationIndex = 0, activeIndex = null, onSelect }) {
  const N = items.length
  const step = N > 0 ? 360 / N : 72

  const [rotation, setRotation] = useState(0)

  // Sync rotation to rotationIndex — smoothly carries the selected node to the top
  useEffect(() => {
    setRotation((prev) => {
      const normalized = ((prev % 360) + 360) % 360
      const target = ((-step * rotationIndex) % 360 + 360) % 360
      let diff = target - normalized
      if (diff > 180) diff -= 360
      if (diff < -180) diff += 360
      return prev + diff
    })
  }, [rotationIndex, step])

  const SIZE = 440
  const RING_R = 158     // radius of the colored ring / badge center
  const RING_W = 15      // ring stroke width
  const BADGE_D = 38     // numbered badge diameter
  const LABEL_R = 202    // radius for the outer text labels
  const HUB_R = 58       // hub radius
  const GAP_DEG = 6      // visual gap between ring segments
  const CX = SIZE / 2
  const CY = SIZE / 2

  // brand-toned palette: light gold -> deep bronze, one shade per node
  const PALETTE = ['#E8C468', '#D9AE3E', '#C9A227', '#A67C2E', '#8B6914', '#6B5115']

  const polar = (r, angleDeg) => {
    const rad = (angleDeg - 90) * (Math.PI / 180)
    return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
  }

  const describeArc = (r, startAngle, endAngle) => {
    const start = polar(r, endAngle)
    const end = polar(r, startAngle)
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  return (
    <div
      className="wheel-root"
      style={{
        position: 'relative',
        width: `${SIZE}px`,
        height: `${SIZE}px`,
        minWidth: `${SIZE}px`,
        flexShrink: 0,
        margin: '0 auto',
      }}
    >
      {/* Colored ring + geometric hub connector lines (static geometry, rotates with content) */}
      <svg
        style={{
          position: 'absolute', inset: 0, zIndex: 1,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.7s ease-out',
        }}
        width={SIZE}
        height={SIZE}
        aria-hidden="true"
      >
        {items.map((_, i) => {
          const centerAngle = step * i
          const half = (step - GAP_DEG) / 2
          return (
            <path
              key={`arc-${i}`}
              d={describeArc(RING_R, centerAngle - half, centerAngle + half)}
              stroke={PALETTE[i % PALETTE.length]}
              strokeWidth={RING_W}
              strokeLinecap="round"
              fill="none"
              opacity={activeIndex === i ? 1 : 0.55}
              style={{ transition: 'opacity 0.25s ease' }}
            />
          )
        })}
        {items.map((_, i) => {
          const angleDeg = step * i
          const hubPt = polar(HUB_R + 4, angleDeg)
          const innerRingPt = polar(RING_R - RING_W / 2 - 6, angleDeg)
          const isActive = i === activeIndex
          return (
            <line
              key={`line-${i}`}
              x1={hubPt.x} y1={hubPt.y} x2={innerRingPt.x} y2={innerRingPt.y}
              stroke={isActive ? '#000000' : 'rgba(28,26,21,0.20)'}
              strokeWidth={isActive ? '1.5' : '1'}
              strokeDasharray={isActive ? 'none' : '3 4'}
            />
          )
        })}
      </svg>

      {/* Rotating layer: badges + outer labels */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          transform: `rotate(${rotation}deg)`,
          transition: 'transform 0.7s ease-out',
        }}
      >
        {items.map((item, i) => {
          const angleDeg = step * i
          const badgePt = polar(RING_R, angleDeg)
          const labelPt = polar(LABEL_R, angleDeg)
          const isActive = i === activeIndex

          return (
            <div key={item.id}>
              {/* numbered badge, sits directly on the ring */}
              <button
                onClick={() => onSelect?.(i)}
                aria-label={item.nodeTitle}
                style={{
                  position: 'absolute',
                  left: badgePt.x - BADGE_D / 2,
                  top: badgePt.y - BADGE_D / 2,
                  width: BADGE_D,
                  height: BADGE_D,
                  borderRadius: '50%',
                  transform: `rotate(${-rotation}deg) scale(${isActive ? 1.10 : 1})`,
                  transition: 'transform 0.7s ease-out, background-color 0.25s ease, box-shadow 0.25s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', padding: 0, fontFamily: 'inherit',
                  border: isActive ? '2px solid #000000' : '2px solid #ffffff',
                  backgroundColor: isActive ? '#000000' : '#ffffff',
                  boxShadow: isActive
                    ? '0 10px 24px rgba(0,0,0,0.32)'
                    : '0 2px 10px rgba(28,26,21,0.18)',
                  zIndex: isActive ? 3 : 1,
                }}
              >
                <span style={{
                  fontSize: '14.5px', fontWeight: 800,
                  color: isActive ? '#ffffff' : '#0f172a',
                  transition: 'color 0.25s',
                }}>
                  {i + 1}
                </span>
              </button>

              {/* outer topic label */}
              <button
                onClick={() => onSelect?.(i)}
                aria-label={item.nodeTitle}
                style={{
                  position: 'absolute',
                  left: labelPt.x,
                  top: labelPt.y,
                  transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                  transition: 'transform 0.7s ease-out, color 0.25s ease',
                  background: 'none', border: 'none', padding: '4px 6px',
                  cursor: 'pointer', fontFamily: 'inherit',
                  maxWidth: '120px', textAlign: 'center',
                }}
              >
                <span style={{
                  fontSize: '12.5px',
                  fontWeight: 800,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  color: isActive ? '#0f172a' : '#334155',
                  lineHeight: 1.25,
                }}>
                  {item.nodeTitle}
                </span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Central Hub */}
      <div
        style={{
          position: 'absolute',
          left: CX - HUB_R,
          top: CY - HUB_R,
          width: HUB_R * 2,
          height: HUB_R * 2,
          borderRadius: '50%',
          backgroundColor: '#0d0c0a',
          border: '2px solid #000000',
          boxShadow: '0 0 0 8px rgba(0,0,0,0.05), 0 12px 32px rgba(0,0,0,0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
          gap: '3px',
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.08em' }}>GAL</span>
        <span
          style={{
            fontSize: '9px', fontWeight: 500,
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Ask<br />Anything
        </span>
      </div>
    </div>
  )
}