import * as THREE from 'three'
import type { QualityTier } from './quality'
import { terrainHeights, type TerrainOptions } from './terrain'

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
const FLOW = 1.6

const SKY_Z = -150
const SKY_JITTER = 5
const SKY_HALF_WIDTH = 168
const SKY_BOTTOM = 10
const SKY_TOP = 105

const FALLBACK = {
  bg: '#F3DECD',
  'hero-terrain': '#EDBE95',
  'hero-wire': '#F8DFC8',
  'hero-star': '#C3B2A0',
  'hero-glow': '#F56F0D',
}

function readToken(name: keyof typeof FALLBACK): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--${name}`)
    .trim()
  return value || FALLBACK[name]
}

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

interface Built {
  renderer: THREE.WebGLRenderer
  render(time: number): void
  resize(width: number, height: number): void
  setPointer(x: number, y: number): void
  refreshTheme(): void
  animateTerrain: boolean
  dispose(): void
}

function build(target: HTMLCanvasElement, tier: QualityTier, pixelRatio: number): Built {
  const settings = TIERS[tier]
  const renderer = new THREE.WebGLRenderer({
    canvas: target,
    alpha: true,
    antialias: tier === 'high' && pixelRatio <= 1,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(pixelRatio)

  const scene = new THREE.Scene()
  const fog = new THREE.Fog(readToken('bg'), 55, 175)
  scene.fog = fog

  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200)
  camera.position.set(0, 8.5, 14)
  camera.lookAt(0, 14.1, -40)

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
  groundGeometry.rotateX(-Math.PI / 2)

  const groundPosition = groundGeometry.getAttribute('position') as THREE.BufferAttribute
  const groundArray = groundPosition.array as Float32Array
  let heights: Float32Array = new Float32Array(groundPosition.count)

  function applyHeights(offset: number) {
    heights = terrainHeights({ ...terrain, offset }, heights)
    for (let i = 0; i < heights.length; i += 1) {
      groundArray[i * 3 + 1] = heights[i]
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

  const glowMaterial = new THREE.SpriteMaterial({
    map: starTexture,
    color: new THREE.Color(readToken('hero-glow')),
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    fog: false,
  })

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
  sky.add(stars, ...glows)
  scene.add(sky)

  const pointer = { x: 0, y: 0 }

  return {
    renderer,
    animateTerrain: tier !== 'still',
    render(time: number) {
      if (tier !== 'still') applyHeights((time / 1000) * FLOW)
      camera.position.x = pointer.x * 1.1
      camera.position.y = 8.5 - pointer.y * 0.5
      camera.lookAt(0, 14.1, -40)
      renderer.render(scene, camera)
    },
    resize(width: number, height: number) {
      if (width === 0 || height === 0) return
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    },
    setPointer(x: number, y: number) {
      pointer.x = x
      pointer.y = y
    },
    refreshTheme() {
      surfaceMaterial.color.set(readToken('hero-terrain'))
      wireMaterial.color.set(readToken('hero-wire'))
      starMaterial.color.set(readToken('hero-star'))
      glowMaterial.color.set(readToken('hero-glow'))
      fog.color.set(readToken('bg'))
    },
    dispose() {
      groundGeometry.dispose()
      starGeometry.dispose()
      starTexture.dispose()
      surfaceMaterial.dispose()
      wireMaterial.dispose()
      starMaterial.dispose()
      glowMaterial.dispose()
      renderer.dispose()
    },
  }
}

export interface HeroScene {
  destroy(): void
  setPaused(paused: boolean): void
  refreshTheme(): void
}

function createStillScene(canvas: HTMLCanvasElement): HeroScene {
  let timer = 0
  let destroyed = false

  function paint() {
    if (destroyed) return
    const { clientWidth: w, clientHeight: h } = canvas
    if (w === 0 || h === 0) return

    const offscreen = document.createElement('canvas')
    let built: Built | null = null
    try {
      built = build(offscreen, 'still', Math.min(window.devicePixelRatio || 1, 1.5))
      built.resize(w, h)
      built.render(0)
      canvas.style.backgroundImage = `url(${offscreen.toDataURL('image/webp', 0.9)})`
      delete canvas.dataset.lost
    } catch {
      canvas.dataset.lost = 'true'
    } finally {
      if (built) {
        built.renderer.forceContextLoss()
        built.dispose()
      }
    }
  }

  const schedule = () => {
    window.clearTimeout(timer)
    timer = window.setTimeout(paint, 150)
  }

  paint()
  const observer = new ResizeObserver(schedule)
  observer.observe(canvas)

  return {
    setPaused() {},
    refreshTheme() {
      paint()
    },
    destroy() {
      destroyed = true
      window.clearTimeout(timer)
      observer.disconnect()
      canvas.style.backgroundImage = ''
    },
  }
}

function createLiveScene(canvas: HTMLCanvasElement, tier: QualityTier): HeroScene {
  const dpr = window.devicePixelRatio || 1
  const built = build(canvas, tier, Math.min(dpr, tier === 'high' ? 1.5 : 1))

  const onPointerMove = (event: PointerEvent) => {
    built.setPointer(
      (event.clientX / window.innerWidth - 0.5) * 2,
      (event.clientY / window.innerHeight - 0.5) * 2
    )
  }

  function resize() {
    built.resize(canvas.clientWidth, canvas.clientHeight)
  }

  resize()
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)

  let paused = false
  let frame = 0

  function loop(time: number) {
    built.render(time)
    frame = requestAnimationFrame(loop)
  }

  function start() {
    if (!paused && !frame && !canvas.dataset.lost) frame = requestAnimationFrame(loop)
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  const onContextLost = (event: Event) => {
    event.preventDefault()
    stop()
    canvas.dataset.lost = 'true'
  }
  const onContextRestored = () => {
    delete canvas.dataset.lost
    start()
  }
  canvas.addEventListener('webglcontextlost', onContextLost)
  canvas.addEventListener('webglcontextrestored', onContextRestored)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  start()

  return {
    setPaused(next: boolean) {
      if (next === paused) return
      paused = next
      if (paused) stop()
      else start()
    },
    refreshTheme() {
      built.refreshTheme()
    },
    destroy() {
      stop()
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
      built.dispose()
    },
  }
}

export function createHeroScene(canvas: HTMLCanvasElement, tier: QualityTier): HeroScene {
  return tier === 'still' ? createStillScene(canvas) : createLiveScene(canvas, tier)
}
