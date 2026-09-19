import { useState, useEffect, useRef } from 'react'

export default function ImageSlider({ images = [], height = '200px', interval = 2800 }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const [direction, setDirection] = useState('next') // 'next' | 'prev'
  const timerRef = useRef(null)

  const total = images.length

  const goToSlide = (nextIndex, dir = 'next') => {
    if (nextIndex === current) return
    setDirection(dir)
    setPrev(current)
    setCurrent(nextIndex)
  }

  const nextSlide = () => {
    const nextIdx = (current + 1) % total
    goToSlide(nextIdx, 'next')
  }

  const prevSlide = () => {
    const prevIdx = (current - 1 + total) % total
    goToSlide(prevIdx, 'prev')
  }

  // Automatic slide timer
  useEffect(() => {
    if (total <= 1) return

    timerRef.current = setInterval(() => {
      setCurrent((prevCurrent) => {
        const nextIdx = (prevCurrent + 1) % total
        setDirection('next')
        setPrev(prevCurrent)
        return nextIdx
      })
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [total, interval, current])

  if (!images || total === 0) return null

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height,
        borderRadius: '14px',
        overflow: 'hidden',
        marginBottom: '22px',
        backgroundColor: '#161310',
        boxShadow: '0 12px 32px rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.12)',
        userSelect: 'none',
      }}
    >
      {/* Slides Container */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        {images.map((img, idx) => {
          const isCurrent = idx === current
          const isPrev = idx === prev

          // Compute transform and opacity based on sliding direction
          let transform = 'translateX(100%)'
          let opacity = 0
          let zIndex = 0

          if (isCurrent) {
            transform = 'translateX(0%)'
            opacity = 1
            zIndex = 2
          } else if (isPrev) {
            transform = direction === 'next' ? 'translateX(-100%)' : 'translateX(100%)'
            opacity = 0
            zIndex = 1
          } else {
            transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)'
            opacity = 0
            zIndex = 0
          }

          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                transform,
                opacity,
                zIndex,
                transition: 'transform 0.62s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.55s ease',
                pointerEvents: isCurrent ? 'auto' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#161310',
              }}
            >
              {/* Ambient blurred backdrop to seamlessly blend aspect ratios */}
              <img
                src={img}
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'blur(16px) brightness(0.35)',
                  transform: 'scale(1.12)',
                  pointerEvents: 'none',
                }}
              />

              {/* Main sharp image - fully visible with contain so nothing is cut off */}
              <img
                src={img}
                alt={`Hero Slide ${idx + 1}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  zIndex: 2,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prevSlide() }}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(24,21,18,0.75)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227'
              e.currentTarget.style.color = '#1C1A15'
              e.currentTarget.style.borderColor = '#C9A227'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(24,21,18,0.75)'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
          >
            &#8249;
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); nextSlide() }}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'rgba(24,21,18,0.75)',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.20)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              fontSize: '16px',
              backdropFilter: 'blur(6px)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#C9A227'
              e.currentTarget.style.color = '#1C1A15'
              e.currentTarget.style.borderColor = '#C9A227'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(24,21,18,0.75)'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
            }}
          >
            &#8250;
          </button>

          {/* Dots Indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              zIndex: 10,
              padding: '5px 10px',
              borderRadius: '999px',
              backgroundColor: 'rgba(24,21,18,0.70)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  goToSlide(idx, idx > current ? 'next' : 'prev')
                }}
                aria-label={`Go to slide ${idx + 1}`}
                style={{
                  width: current === idx ? '22px' : '7px',
                  height: '7px',
                  borderRadius: '999px',
                  backgroundColor: current === idx ? '#C9A227' : 'rgba(255,255,255,0.40)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
