import { useEffect, useRef } from 'react'

export default function AbstractBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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

    // Initial setup
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    window.addEventListener('resize', resize)

    let time = 0
    const speed = prefersReducedMotion ? 0.0005 : 0.002

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight

      // Pitch-black base
      ctx!.fillStyle = '#030711'
      ctx!.fillRect(0, 0, w, h)

      time += speed

      // Subtle warm wash at center for depth — the only ambient glow
      const centerGlow = ctx!.createRadialGradient(
        w * 0.5, h * 0.45, 0,
        w * 0.5, h * 0.45, Math.min(w, h) * 0.5
      )
      centerGlow.addColorStop(0, `rgba(240, 193, 75, ${0.03 + Math.sin(time * 0.3) * 0.01})`)
      centerGlow.addColorStop(0.5, `rgba(240, 193, 75, ${0.01 + Math.sin(time * 0.3) * 0.005})`)
      centerGlow.addColorStop(1, 'rgba(240, 193, 75, 0)')
      ctx!.fillStyle = centerGlow
      ctx!.fillRect(0, 0, w, h)

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
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
