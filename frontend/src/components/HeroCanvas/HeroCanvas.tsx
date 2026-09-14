import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../hooks/useTheme'
import { resolveQualityTier } from '../../three/quality'
import './HeroCanvas.scss'

interface Scene {
  destroy(): void
  setPaused(paused: boolean): void
  refreshTheme(): void
}

function isOnScreen(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
}

function whenIdle(run: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(run, { timeout: 2000 })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = window.setTimeout(run, 0)
  return () => window.clearTimeout(handle)
}

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<Scene | null>(null)
  const reduced = useReducedMotion()
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let visibility: IntersectionObserver | null = null
    let cancelled = false

    const nav = navigator as Navigator & { deviceMemory?: number }
    const tier = resolveQualityTier({
      reducedMotion: reduced,
      coarsePointer: window.matchMedia?.('(pointer: coarse)').matches ?? false,
      width: window.innerWidth,
      deviceMemory: nav.deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency,
    })

    function start() {
      if (cancelled || !canvas) return

      import('../../three/heroScene')
        .then(({ createHeroScene }) => {
          if (cancelled) return

          let visible = isOnScreen(canvas)
          visibility = new IntersectionObserver(
            ([entry]) => {
              visible = entry.isIntersecting
              sceneRef.current?.setPaused(!visible)
            },
            { threshold: 0 }
          )
          visibility.observe(canvas)

          const scene = createHeroScene(canvas, tier)
          sceneRef.current = scene
          scene.setPaused(!visible)
        })
        .catch(() => {
          canvas.dataset.lost = 'true'
        })
    }

    const cancelIdle = whenIdle(start)

    return () => {
      cancelled = true
      cancelIdle()
      visibility?.disconnect()
      sceneRef.current?.destroy()
      sceneRef.current = null
    }
  }, [reduced])

  useEffect(() => {
    sceneRef.current?.refreshTheme()
  }, [theme])

  return (
    <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" data-testid="hero-canvas" />
  )
}
