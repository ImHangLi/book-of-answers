import { useEffect, useRef } from 'react'

const BLOB_COUNT = 3

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hue: number
  saturation: number
  lightness: number
  opacity: number
  phase: number
}

function createBlob(width: number, height: number, index: number): Blob {
  // Warm gold/amber only
  const configs = [
    { hue: 40, sat: 70, light: 22, op: 0.55 },   // warm gold
    { hue: 35, sat: 65, light: 18, op: 0.45 },   // deep gold
    { hue: 25, sat: 80, light: 12, op: 0.35 },   // amber ember
  ]
  const cfg = configs[index % configs.length]
  const minDim = Math.min(width, height)

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    radius: minDim * (0.3 + Math.random() * 0.25),
    hue: cfg.hue + (Math.random() - 0.5) * 8,
    saturation: cfg.sat + (Math.random() - 0.5) * 10,
    lightness: cfg.light + (Math.random() - 0.5) * 4,
    opacity: cfg.op,
    phase: Math.random() * Math.PI * 2,
  }
}

export default function AbstractBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const blobsRef = useRef<Blob[]>([])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768

    // Debounced resize to avoid thrashing on mobile orientation changes
    let resizeTimer: number
    function resize() {
      clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        // Cap DPR on mobile for performance
        const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
        canvas!.width = window.innerWidth * dpr
        canvas!.height = window.innerHeight * dpr
        canvas!.style.width = `${window.innerWidth}px`
        canvas!.style.height = `${window.innerHeight}px`
        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)

        blobsRef.current = Array.from({ length: BLOB_COUNT }, (_, i) =>
          createBlob(window.innerWidth, window.innerHeight, i)
        )
      }, 100)
    }

    // Initial resize without debounce
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2)
    canvas.width = window.innerWidth * dpr
    canvas.height = window.innerHeight * dpr
    canvas.style.width = `${window.innerWidth}px`
    canvas.style.height = `${window.innerHeight}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    blobsRef.current = Array.from({ length: BLOB_COUNT }, (_, i) =>
      createBlob(window.innerWidth, window.innerHeight, i)
    )

    window.addEventListener('resize', resize)

    let time = 0
    const speed = prefersReducedMotion ? 0.0005 : 0.002

    function animate() {
      const w = window.innerWidth
      const h = window.innerHeight

      // Pitch-black base for maximum contrast
      ctx!.fillStyle = '#030711'
      ctx!.fillRect(0, 0, w, h)

      time += speed

      // Composite blobs with screen blend for richer color mixing
      ctx!.globalCompositeOperation = 'screen'

      for (const blob of blobsRef.current) {
        if (!prefersReducedMotion) {
          blob.x += blob.vx + Math.sin(time * 0.7 + blob.phase) * 0.3
          blob.y += blob.vy + Math.cos(time * 0.5 + blob.phase) * 0.3

          if (blob.x < -blob.radius * 0.5) blob.x = w + blob.radius * 0.3
          if (blob.x > w + blob.radius * 0.5) blob.x = -blob.radius * 0.3
          if (blob.y < -blob.radius * 0.5) blob.y = h + blob.radius * 0.3
          if (blob.y > h + blob.radius * 0.5) blob.y = -blob.radius * 0.3
        }

        // Breathing radius
        const breathe = Math.sin(time * 0.4 + blob.phase) * 30
        const r = blob.radius + breathe

        const gradient = ctx!.createRadialGradient(
          blob.x, blob.y, 0,
          blob.x, blob.y, r
        )

        const bh = blob.hue
        const bs = blob.saturation
        const bl = blob.lightness

        // Richer gradient stops — bright core, soft falloff
        gradient.addColorStop(0, `hsla(${bh}, ${bs}%, ${bl + 8}%, ${blob.opacity})`)
        gradient.addColorStop(0.3, `hsla(${bh}, ${bs}%, ${bl + 3}%, ${blob.opacity * 0.7})`)
        gradient.addColorStop(0.6, `hsla(${bh}, ${bs - 5}%, ${bl}%, ${blob.opacity * 0.35})`)
        gradient.addColorStop(1, `hsla(${bh}, ${bs - 10}%, ${bl - 2}%, 0)`)

        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, w, h)
      }

      // Reset composite
      ctx!.globalCompositeOperation = 'source-over'

      // Subtle warm wash at center for depth
      const centerGlow = ctx!.createRadialGradient(
        w * 0.5, h * 0.45, 0,
        w * 0.5, h * 0.45, Math.min(w, h) * 0.4
      )
      centerGlow.addColorStop(0, `rgba(240, 193, 75, ${0.025 + Math.sin(time * 0.3) * 0.008})`)
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
