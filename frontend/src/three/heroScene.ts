import * as THREE from 'three'
import type { QualityTier } from './quality'

const COUNT: Record<QualityTier, number> = { high: 1400, low: 500, still: 500 }

// One place to read the live accent colour — used both at construction and
// whenever the theme changes, so the lookup never drifts out of sync.
function readAccent(): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#14563C'
  )
}

export function createHeroScene(canvas: HTMLCanvasElement, tier: QualityTier) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: tier === 'high' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 2 : 1))

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
  camera.position.z = 14

  const accent = readAccent()

  const count = COUNT[tier]
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * 32
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: new THREE.Color(accent),
    size: 0.055,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  })

  const points = new THREE.Points(geometry, material)
  scene.add(points)

  const pointer = { x: 0, y: 0 }
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth - 0.5) * 2
    pointer.y = (event.clientY / window.innerHeight - 0.5) * 2
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas
    if (w === 0 || h === 0) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  let paused = false
  let frame = 0
  let lastTime = 0

  function render(time: number) {
    lastTime = time
    points.rotation.y = time * 0.00004 + pointer.x * 0.12
    points.rotation.x = pointer.y * 0.08
    renderer.render(scene, camera)
  }

  // The loop reschedules itself only while running. Pausing cancels the
  // pending frame and stops rescheduling entirely — an off-screen hero
  // must not keep a requestAnimationFrame chain alive in the background.
  function loop(time: number) {
    render(time)
    frame = requestAnimationFrame(loop)
  }

  if (tier === 'still') {
    render(0)
  } else {
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    frame = requestAnimationFrame(loop)
  }

  return {
    setPaused(next: boolean) {
      if (tier === 'still' || next === paused) return
      paused = next
      if (paused) {
        cancelAnimationFrame(frame)
        frame = 0
      } else {
        frame = requestAnimationFrame(loop)
      }
    },
    refreshAccent() {
      material.color.set(readAccent())
      // The running loop (high/low) picks up the new colour on its next
      // frame automatically, since it re-renders every tick regardless.
      // The still tier never loops — it rendered exactly one frame at
      // construction and nothing since — so without an explicit redraw
      // here the new colour would be set on the material but never
      // actually reach the screen.
      if (tier === 'still') render(lastTime)
    },
    destroy() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    },
  }
}
