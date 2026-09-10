import { useEffect, useRef } from 'react'

const BOKEH = [
  { inner: 'rgba(201, 162, 39, 0.45)', outer: 'rgba(201, 162, 39, 0)' },
  { inner: 'rgba(220, 175, 50, 0.35)', outer: 'rgba(220, 175, 50, 0)' },
  { inner: 'rgba(180, 140, 28, 0.42)', outer: 'rgba(180, 140, 28, 0)' },
  { inner: 'rgba(235, 195, 70, 0.28)', outer: 'rgba(235, 195, 70, 0)' },
  { inner: 'rgba(160, 125, 20, 0.35)', outer: 'rgba(160, 125, 20, 0)' },
]

function rand(a, b) { return a + Math.random() * (b - a) }

function makeOrb(w, h) {
  return {
    x: rand(0, w), y: rand(0, h),
    r: rand(80, 220),
    col: BOKEH[Math.floor(Math.random() * BOKEH.length)],
    vx: rand(-0.18, 0.18), vy: rand(-0.14, 0.14),
    depth: rand(0.5, 1.4),
    phase: rand(0, Math.PI * 2),
    ps: rand(0.003, 0.009),
    pa: rand(0.06, 0.20),
  }
}

export default function HeroCanvas() {
  const canvasRef = useRef(null)
  const orbs = useRef([])
  const raf = useRef(null)
  const t = useRef(0)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')

    const resize = () => {
      cv.width = cv.offsetWidth
      cv.height = cv.offsetHeight
      orbs.current = Array.from({ length: 14 }, () => makeOrb(cv.width, cv.height))
    }

    const onMouse = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouse)

    const draw = () => {
      const { width: W, height: H } = cv
      t.current++
      ctx.clearRect(0, 0, W, H)

      for (const o of [...orbs.current].sort((a, b) => a.depth - b.depth)) {
        const mx = (mouse.current.x - W / 2) * 0.012 * o.depth
        const my = (mouse.current.y - H / 2) * 0.008 * o.depth
        const pulse = 1 + Math.sin(t.current * o.ps + o.phase) * o.pa
        const R = o.r * o.depth * pulse

        o.x += o.vx; o.y += o.vy
        if (o.x + R < -80) o.x = W + R
        if (o.x - R > W + 80) o.x = -R
        if (o.y + R < -80) o.y = H + R
        if (o.y - R > H + 80) o.y = -R

        const dx = o.x + mx, dy = o.y + my
        const g = ctx.createRadialGradient(dx, dy, 0, dx, dy, R)
        g.addColorStop(0,   o.col.inner)
        g.addColorStop(0.45, o.col.inner.replace(/[\d.]+\)$/, '0.12)'))
        g.addColorStop(1,   o.col.outer)

        ctx.beginPath()
        ctx.arc(dx, dy, R, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      raf.current = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    />
  )
}
