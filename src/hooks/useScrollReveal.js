import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element (fade + rise, or slide-in from the right) once it
 * enters the viewport. Returns a ref to attach and the visibility flag.
 *
 * Usage:
 *   const [ref, visible] = useScrollReveal()
 *   <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`} />
 */
export default function useScrollReveal({ threshold = 0.15, rootMargin = '0px 0px -60px 0px' } = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}
