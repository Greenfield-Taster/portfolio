import * as THREE from 'three'
import { constellationLinks } from './constellation'
import type { QualityTier } from './quality'
import { terrainHeights, type TerrainOptions } from './terrain'

interface TierSettings {
  segmentsX: number
  segmentsZ: number
  stars: number
}

const TIERS: Record<QualityTier, TierSettings> = {
  high: { segmentsX: 96, segmentsZ: 64, stars: 260 },
  low: { segmentsX: 48, segmentsZ: 32, stars: 130 },
  still: { segmentsX: 48, segmentsZ: 32, stars: 130 },
}

const TERRAIN_WIDTH = 90
const TERRAIN_DEPTH = 70
const AMPLITUDE = 2.6
const FREQUENCY = 0.09
const SEED = 20260910
/** Grid rows the landscape travels per second. */
const FLOW = 1.6

const FALLBACK = {
  bg: '#F3F5F2',
  'hero-terrain': '#A9C7B4',
  'hero-wire': '#7CA189',
  'hero-star': '#BCC9C0',
  'hero-line': '#D3DFD7',
}

function readToken(name: keyof typeof FALLBACK): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
  return value || FALLBACK[name]
}

export function createHeroScene(canvas: HTMLCanvasElement, tier: QualityTier) {
  const settings = TIERS[tier]
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: tier === 'high' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 2 : 1))

  const scene = new THREE.Scene()
  // Fog in the page's own background colour is what dissolves the far edge of
  // the landscape into the sky, so no hard rectangle edge is ever visible.
  const fog = new THREE.Fog(readToken('bg'), 26, 68)
  scene.fog = fog

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
  camera.position.set(0, 3.2, 15)
  camera.lookAt(0, -1.1, -16)


  // --- Landscape -----------------------------------------------------------
  const terrain: TerrainOptions = {
    segmentsX: settings.segmentsX,
    segmentsZ: settings.segmentsZ,
    amplitude: AMPLITUDE,
    frequency: FREQUENCY,
    seed: SEED,
    offset: 0,
  }

  const groundGeometry = new THREE.PlaneGeometry(
    TERRAIN_WIDTH,
    TERRAIN_DEPTH,
    settings.segmentsX,
    settings.segmentsZ
  )
  // Bake the rotation into the vertices so displacement is plainly along Y and
  // the buffer order still matches the terrain grid, row by row.
  groundGeometry.rotateX(-Math.PI / 2)

  const groundPosition = groundGeometry.getAttribute('position') as THREE.BufferAttribute

  function applyHeights(offset: number) {
    const heights = terrainHeights({ ...terrain, offset })
    for (let i = 0; i < heights.length; i += 1) {
      groundPosition.setY(i, heights[i])
    }
    groundPosition.needsUpdate = true
  }

  applyHeights(0)

  const surfaceMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(readToken('hero-terrain')),
    transparent: true,
    opacity: 0.78,
  })
  const surface = new THREE.Mesh(groundGeometry, surfaceMaterial)
  surface.position.y = -8.7

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(readToken('hero-wire')),
    wireframe: true,
    transparent: true,
    opacity: 0.32,
  })
  const wire = new THREE.Mesh(groundGeometry, wireMaterial)
  wire.position.y = -8.65

  scene.add(surface, wire)

  // --- Sky -----------------------------------------------------------------
  const starPositions = new Float32Array(settings.stars * 3)
  for (let i = 0; i < settings.stars; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * 80
    starPositions[i * 3 + 1] = 2 + Math.random() * 24
    starPositions[i * 3 + 2] = -40 + Math.random() * 34
  }

  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(readToken('hero-star')),
    size: 0.13,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    fog: false,
  })
  const stars = new THREE.Points(starGeometry, starMaterial)

  const links = constellationLinks(starPositions, { radius: 9, maxPerPoint: 2 })
  const linkPositions = new Float32Array(links.length * 6)
  links.forEach(([a, b], i) => {
    linkPositions.set(starPositions.subarray(a * 3, a * 3 + 3), i * 6)
    linkPositions.set(starPositions.subarray(b * 3, b * 3 + 3), i * 6 + 3)
  })

  const linkGeometry = new THREE.BufferGeometry()
  linkGeometry.setAttribute('position', new THREE.BufferAttribute(linkPositions, 3))
  const linkMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(readToken('hero-line')),
    transparent: true,
    opacity: 0.9,
    fog: false,
  })
  const constellation = new THREE.LineSegments(linkGeometry, linkMaterial)

  const sky = new THREE.Group()
  sky.add(stars, constellation)
  scene.add(sky)

  // --- Interaction ---------------------------------------------------------
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
    const seconds = time / 1000

    if (tier !== 'still') {
      applyHeights(seconds * FLOW)
      sky.rotation.z = Math.sin(seconds * 0.04) * 0.02
    }

    // A shallow drift, not a swivel: the horizon has to stay level.
    camera.position.x = pointer.x * 1.1
    camera.position.y = 3.2 - pointer.y * 0.5
    camera.lookAt(0, -1.1, -16)

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
    refreshTheme() {
      surfaceMaterial.color.set(readToken('hero-terrain'))
      wireMaterial.color.set(readToken('hero-wire'))
      starMaterial.color.set(readToken('hero-star'))
      linkMaterial.color.set(readToken('hero-line'))
      fog.color.set(readToken('bg'))

      // The running loop redraws every tick and picks this up on its own. The
      // still tier rendered exactly one frame at construction and nothing
      // since, so without an explicit redraw the new colours would be set on
      // the materials but never reach the screen.
      if (tier === 'still') render(lastTime)
    },
    destroy() {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      groundGeometry.dispose()
      starGeometry.dispose()
      linkGeometry.dispose()
      surfaceMaterial.dispose()
      wireMaterial.dispose()
      starMaterial.dispose()
      linkMaterial.dispose()
      renderer.dispose()
    },
  }
}
