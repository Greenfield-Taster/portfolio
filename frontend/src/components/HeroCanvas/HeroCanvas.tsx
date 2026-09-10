import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../hooks/useTheme'
import { resolveQualityTier } from '../../three/quality'
import './HeroCanvas.scss'

interface Scene {
  destroy(): void
  setPaused(paused: boolean): void
  refreshAccent(): void
}

// Cheap synchronous stand-in for the IntersectionObserver's first callback,
// which is always delivered a beat later. It lets the scene be created already
// knowing whether it is on screen.
function isOnScreen(el: HTMLElement): boolean {
  const r = el.getBoundingClientRect()
  return r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth
}

// requestIdleCallback is still missing in Safari; fall back to a macrotask,
// which at least gets the import out of the mount-effect's own turn.
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
      // The idle callback can land after unmount; nothing may be created then.
      if (cancelled || !canvas) return

      import('../../three/heroScene')
        .then(({ createHeroScene }) => {
          if (cancelled) return

          // The observer goes up before the scene, and the scene adopts the
          // current visibility as soon as it exists. Creating it the other way
          // round left the rAF loop running for the frames between the scene's
          // construction and the observer's first callback.
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
          // No WebGL, or the chunk failed to load. The hero reads fine without it.
        })
    }

    // three's parse and evaluation are not on the critical path — hold them
    // until the main thread is idle, with a 2s ceiling so the scene still
    // appears on a permanently busy page.
    const cancelIdle = whenIdle(start)

    return () => {
      cancelled = true
      cancelIdle()
      visibility?.disconnect()
      sceneRef.current?.destroy()
      sceneRef.current = null
    }
  }, [reduced])

  // The scene reads `--accent` off the document element, so it has to be told
  // when the theme changes. ThemeProvider stamps `data-theme` synchronously
  // from its setters, so by the time this effect runs the resolved value is
  // already the new one. On mount there is no scene yet (the import is
  // deferred to idle) and this is a no-op — the scene reads the accent itself
  // at construction.
  useEffect(() => {
    sceneRef.current?.refreshAccent()
  }, [theme])

  return (
    <canvas ref={canvasRef} className="hero-canvas" aria-hidden="true" data-testid="hero-canvas" />
  )
}
