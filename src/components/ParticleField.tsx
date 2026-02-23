import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  brightness: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768

    let resizeTimer: number
    function resize() {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
        canvas!.width = window.innerWidth * dpr
        canvas!.height = window.innerHeight * dpr
        canvas!.style.width = `${window.innerWidth}px`
        canvas!.style.height = `${window.innerHeight}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      }, 100)
    }

    // Initial setup without debounce
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    window.addEventListener('resize', resize)

    function spawnParticle(): Particle {
      const isBright = Math.random() > 0.7
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.08 - Math.random() * 0.15,
        life: 0,
        maxLife: 250 + Math.random() * 350,
        size: isBright ? 1.5 + Math.random() * 1.5 : 0.8 + Math.random() * 1,
        brightness: isBright ? 0.6 + Math.random() * 0.4 : 0.2 + Math.random() * 0.3,
      }
    }

    // Fewer particles on mobile for performance
    const count = isMobile
      ? Math.min(30, Math.floor(window.innerWidth / 15))
      : Math.min(60, Math.floor(window.innerWidth / 25))

    for (let i = 0; i < count; i++) {
      const p = spawnParticle()
      p.life = Math.random() * p.maxLife
      particlesRef.current.push(p)
    }

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight

      ctx!.clearRect(0, 0, w, h)

      const particles = particlesRef.current

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx + Math.sin(p.life * 0.008) * 0.05
        p.y += p.vy

        // Smooth fade curve
        const lifeRatio = p.life / p.maxLife
        let alpha: number
        if (lifeRatio < 0.15) {
          alpha = (lifeRatio / 0.15)
        } else if (lifeRatio > 0.75) {
          alpha = ((1 - lifeRatio) / 0.25)
        } else {
          alpha = 1
        }
        alpha *= p.brightness

        // Core particle — bright gold
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(240, 193, 75, ${alpha * 0.7})`
        ctx!.fill()

        // Inner glow
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2)
        ctx!.fillStyle = `rgba(240, 193, 75, ${alpha * 0.12})`
        ctx!.fill()

        // Outer halo for bright particles (skip on mobile)
        if (!isMobile && p.brightness > 0.5) {
          ctx!.beginPath()
          ctx!.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
          ctx!.fillStyle = `rgba(240, 193, 75, ${alpha * 0.04})`
          ctx!.fill()
        }

        // Recycle
        if (p.life >= p.maxLife || p.y < -20 || p.x < -20 || p.x > w + 20) {
          particles[i] = spawnParticle()
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
