import * as THREE from 'three'
import { constellationLinks } from './constellation'
import type { QualityTier } from './quality'
import { terrainHeights, type TerrainOptions } from './terrain'
import { TAURUS_STARS, projectTaurus } from './taurus'

interface TierSettings {
  segmentsX: number
  segmentsZ: number
  stars: number
}

const TIERS: Record<QualityTier, TierSettings> = {
  high: { segmentsX: 116, segmentsZ: 104, stars: 230 },
  low: { segmentsX: 62, segmentsZ: 56, stars: 120 },
  still: { segmentsX: 62, segmentsZ: 56, stars: 120 },
}

const TERRAIN_WIDTH = 210
const TERRAIN_DEPTH = 200
const AMPLITUDE = 6.4
const FREQUENCY = 0.16
const SEED = 20260910
/** Grid rows the landscape travels per second. */
const FLOW = 1.6

// The sky sits on one shallow slab rather than filling the depth of the scene.
// Spread through depth, perspective made near stars large and far ones specks,
// and the links between them stretched clear across the screen; at one depth
// every dot is the same size and every link is the same short hop.
//
// That slab has to sit beyond the far end of the landscape. Closer in, the
// stars share the depth range of the hills and their links get drawn across
// the ground. Everything up here is therefore sized for SKY_Z, and SKY_BOTTOM
// keeps the whole field above the horizon, which sits at the camera's own
// height however far away it is.
const SKY_Z = -150
const SKY_JITTER = 5
const SKY_HALF_WIDTH = 168
const SKY_BOTTOM = 10
const SKY_TOP = 105
/** World units at SKY_Z, roughly 85px on a desktop viewport. */
const LINK_RADIUS = 16

const FALLBACK = {
  bg: '#F3F5F2',
  'hero-terrain': '#A9C7B4',
  'hero-wire': '#7CA189',
  'hero-star': '#BCC9C0',
  'hero-line': '#D3DFD7',
  'hero-figure': '#8FA89A',
}

function readToken(name: keyof typeof FALLBACK): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
  return value || FALLBACK[name]
}

/**
 * A soft round dot. Points render as squares by default, which reads as pixel
 * dust rather than stars; a radial falloff is what makes them look like light.
 */
function createStarTexture(): THREE.Texture {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const context = canvas.getContext('2d')
  if (context) {
    const centre = size / 2
    const glow = context.createRadialGradient(centre, centre, 0, centre, centre, centre)
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.75)')
    glow.addColorStop(0.65, 'rgba(255, 255, 255, 0.18)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    context.fillStyle = glow
    context.fillRect(0, 0, size, size)
  }

  return new THREE.CanvasTexture(canvas)
}

export function createHeroScene(canvas: HTMLCanvasElement, tier: QualityTier) {
  const settings = TIERS[tier]
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: tier === 'high' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier === 'high' ? 2 : 1))

  const scene = new THREE.Scene()
  // Fog in the page's own background colour is what dissolves the far edge of
  // the landscape into the sky, so no hard rectangle edge is ever visible.
  const fog = new THREE.Fog(readToken('bg'), 55, 175)
  scene.fog = fog

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
  camera.position.set(0, 8.5, 14)
  camera.lookAt(0, 14.1, -40)

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
  })
  const surface = new THREE.Mesh(groundGeometry, surfaceMaterial)
  surface.position.z = -72
  surface.position.y = -2

  const wireMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(readToken('hero-wire')),
    wireframe: true,
    transparent: true,
    opacity: 0.32,
  })
  const wire = new THREE.Mesh(groundGeometry, wireMaterial)
  wire.position.z = -72
  wire.position.y = -1.95

  scene.add(surface, wire)

  // --- Scattered stars -----------------------------------------------------
  const starTexture = createStarTexture()

  const starPositions = new Float32Array(settings.stars * 3)
  for (let i = 0; i < settings.stars; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * SKY_HALF_WIDTH * 2
    starPositions[i * 3 + 1] = SKY_BOTTOM + Math.random() * (SKY_TOP - SKY_BOTTOM)
    starPositions[i * 3 + 2] = SKY_Z + (Math.random() - 0.5) * SKY_JITTER
  }

  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({
    color: new THREE.Color(readToken('hero-star')),
    map: starTexture,
    size: 1.36,
    transparent: true,
    opacity: 0.75,
    depthWrite: false,
    sizeAttenuation: true,
    fog: false,
  })
  const stars = new THREE.Points(starGeometry, starMaterial)

  const links = constellationLinks(starPositions, { radius: LINK_RADIUS, maxPerPoint: 3 })
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
    opacity: 0.55,
    fog: false,
  })
  const constellation = new THREE.LineSegments(linkGeometry, linkMaterial)

  // --- Taurus --------------------------------------------------------------
  // A real figure among the scattered stars, rather than one more random mesh.
  const taurus = projectTaurus({
    centreX: -92,
    centreY: 55,
    scale: 2.8,
    sizeRange: [1.45, 5],
  })

  const figureMaterial = new THREE.SpriteMaterial({
    map: starTexture,
    color: new THREE.Color(readToken('hero-figure')),
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    fog: false,
  })

  // Sprites rather than Points: PointsMaterial carries one size for the whole
  // cloud, and Aldebaran has to outshine the faint stars of the Hyades.
  const figureStars = TAURUS_STARS.map((_, i) => {
    const sprite = new THREE.Sprite(figureMaterial)
    sprite.position.set(taurus.positions[i * 3], taurus.positions[i * 3 + 1], SKY_Z + 2)
    sprite.scale.setScalar(taurus.sizes[i])
    return sprite
  })

  const figureLinePositions = new Float32Array(taurus.linePositions.length)
  for (let i = 0; i < taurus.linePositions.length; i += 3) {
    figureLinePositions[i] = taurus.linePositions[i]
    figureLinePositions[i + 1] = taurus.linePositions[i + 1]
    figureLinePositions[i + 2] = SKY_Z + 2
  }
  const figureLineGeometry = new THREE.BufferGeometry()
  figureLineGeometry.setAttribute('position', new THREE.BufferAttribute(figureLinePositions, 3))
  const figureLineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(readToken('hero-figure')),
    transparent: true,
    opacity: 0.62,
    fog: false,
  })
  const figureLines = new THREE.LineSegments(figureLineGeometry, figureLineMaterial)

  const glowMaterial = new THREE.SpriteMaterial({
    map: starTexture,
    color: new THREE.Color(readToken('hero-figure')),
    transparent: true,
    opacity: 0.14,
    depthWrite: false,
    fog: false,
  })

  // A handful of out-of-focus lights. They read as depth rather than as stars,
  // which is what stops the sky looking like a flat sheet of dots.
  const glows = Array.from({ length: 9 }, () => {
    const sprite = new THREE.Sprite(glowMaterial)
    sprite.position.set(
      (Math.random() - 0.5) * SKY_HALF_WIDTH * 2,
      SKY_BOTTOM + Math.random() * (SKY_TOP - SKY_BOTTOM),
      SKY_Z + 4
    )
    sprite.scale.setScalar(9 + Math.random() * 16)
    return sprite
  })

  const sky = new THREE.Group()
  sky.add(stars, constellation, figureLines, ...figureStars, ...glows)
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
    }

    // A shallow drift, not a swivel: the horizon has to stay level.
    camera.position.x = pointer.x * 1.1
    camera.position.y = 8.5 - pointer.y * 0.5
    camera.lookAt(0, 14.1, -40)

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
      figureMaterial.color.set(readToken('hero-figure'))
      glowMaterial.color.set(readToken('hero-figure'))
      figureLineMaterial.color.set(readToken('hero-figure'))
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
      figureLineGeometry.dispose()
      starTexture.dispose()
      surfaceMaterial.dispose()
      wireMaterial.dispose()
      starMaterial.dispose()
      linkMaterial.dispose()
      figureMaterial.dispose()
      glowMaterial.dispose()
      figureLineMaterial.dispose()
      renderer.dispose()
    },
  }
}
