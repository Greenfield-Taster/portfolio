export interface SkyStar {
  id: string
  /** Bayer designation, kept for anyone reading the data rather than the sky. */
  name: string
  /** Right ascension, in hours. */
  ra: number
  /** Declination, in degrees. */
  dec: number
  /** Apparent visual magnitude — smaller is brighter. */
  magnitude: number
}

/** The stars of the Taurus stick figure: the V of the Hyades, both horns, the neck. */
export const TAURUS_STARS: SkyStar[] = [
  { id: 'alpha', name: 'Aldebaran', ra: 4.5987, dec: 16.5093, magnitude: 0.85 },
  { id: 'beta', name: 'Elnath', ra: 5.4382, dec: 28.6075, magnitude: 1.65 },
  { id: 'zeta', name: 'Tianguan', ra: 5.6275, dec: 21.1425, magnitude: 3.0 },
  { id: 'gamma', name: 'Hyadum I', ra: 4.3297, dec: 15.6276, magnitude: 3.65 },
  { id: 'delta', name: 'Hyadum II', ra: 4.3822, dec: 17.5425, magnitude: 3.76 },
  { id: 'epsilon', name: 'Ain', ra: 4.4767, dec: 19.1804, magnitude: 3.53 },
  { id: 'theta', name: 'Chamukuy', ra: 4.4779, dec: 15.8707, magnitude: 3.4 },
  { id: 'lambda', name: 'Lambda Tauri', ra: 4.0114, dec: 12.4903, magnitude: 3.47 },
  { id: 'xi', name: 'Xi Tauri', ra: 3.4528, dec: 9.7328, magnitude: 3.74 },
  { id: 'omicron', name: 'Omicron Tauri', ra: 3.4136, dec: 9.0288, magnitude: 3.6 },
]

export const TAURUS_LINES: [string, string][] = [
  ['beta', 'epsilon'],
  ['epsilon', 'delta'],
  ['delta', 'gamma'],
  ['gamma', 'theta'],
  ['theta', 'alpha'],
  ['alpha', 'zeta'],
  ['gamma', 'lambda'],
  ['lambda', 'xi'],
  ['xi', 'omicron'],
]

export interface ProjectOptions {
  centreX: number
  centreY: number
  /** World units per degree of sky. */
  scale: number
  /** Dot size for the faintest and the brightest star, in that order. */
  sizeRange: [number, number]
}

export interface ProjectedConstellation {
  positions: Float32Array
  sizes: Float32Array
  linePositions: Float32Array
}

const HOURS_TO_DEGREES = 15

function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/**
 * Flattens the figure onto the sky plane. Right ascension runs east, which is
 * leftwards on a star chart, so it is negated; declination is scaled by the
 * cosine of the figure's own declination, the usual small-field correction that
 * keeps the bull from looking stretched sideways.
 */
export function projectTaurus({
  centreX,
  centreY,
  scale,
  sizeRange,
}: ProjectOptions): ProjectedConstellation {
  const raCentre = mean(TAURUS_STARS.map((star) => star.ra))
  const decCentre = mean(TAURUS_STARS.map((star) => star.dec))
  const squeeze = Math.cos((decCentre * Math.PI) / 180)

  const magnitudes = TAURUS_STARS.map((star) => star.magnitude)
  const brightest = Math.min(...magnitudes)
  const faintest = Math.max(...magnitudes)
  const [smallest, largest] = sizeRange

  const positions = new Float32Array(TAURUS_STARS.length * 3)
  const sizes = new Float32Array(TAURUS_STARS.length)
  const index = new Map<string, number>()

  TAURUS_STARS.forEach((star, i) => {
    index.set(star.id, i)
    positions[i * 3] = centreX + (raCentre - star.ra) * HOURS_TO_DEGREES * squeeze * scale
    positions[i * 3 + 1] = centreY + (star.dec - decCentre) * scale

    const brightness = (faintest - star.magnitude) / (faintest - brightest)
    sizes[i] = smallest + brightness * (largest - smallest)
  })

  const linePositions = new Float32Array(TAURUS_LINES.length * 6)
  TAURUS_LINES.forEach(([from, to], i) => {
    const a = index.get(from)!
    const b = index.get(to)!
    linePositions.set(positions.subarray(a * 3, a * 3 + 3), i * 6)
    linePositions.set(positions.subarray(b * 3, b * 3 + 3), i * 6 + 3)
  })

  return { positions, sizes, linePositions }
}
