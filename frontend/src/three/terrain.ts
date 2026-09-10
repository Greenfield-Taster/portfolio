export interface TerrainOptions {
  segmentsX: number
  segmentsZ: number
  /** Highest peak and deepest trough, in world units. */
  amplitude: number
  /** Lattice cells per grid step — lower means broader, smoother hills. */
  frequency: number
  seed: number
  /** Rows the landscape has slid through the grid; fractional values are fine. */
  offset: number
}

const OCTAVES = 3

/**
 * Deterministic hash of a lattice corner. Integer mixing rather than a seeded
 * PRNG, so any corner can be sampled directly without generating the ones
 * before it — which is what lets the field scroll without regenerating.
 */
function corner(ix: number, iz: number, seed: number): number {
  let h = ix * 374761393 + iz * 668265263 + seed * 1274126177
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h = h ^ (h >>> 16)
  // >>> 0 lifts the sign bit out, giving an unsigned 32-bit value to scale.
  return (h >>> 0) / 4294967296
}

function fade(t: number): number {
  return t * t * (3 - 2 * t)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Value noise over a unit lattice, smoothed so neighbours never jump. */
function noise(x: number, z: number, seed: number): number {
  const ix = Math.floor(x)
  const iz = Math.floor(z)
  const fx = fade(x - ix)
  const fz = fade(z - iz)

  const top = lerp(corner(ix, iz, seed), corner(ix + 1, iz, seed), fx)
  const bottom = lerp(corner(ix, iz + 1, seed), corner(ix + 1, iz + 1, seed), fx)
  return lerp(top, bottom, fz)
}

/** Stacked octaves: broad hills carrying progressively finer detail. */
function ridges(x: number, z: number, seed: number): number {
  let value = 0
  let amplitude = 1
  let total = 0
  let scale = 1

  for (let octave = 0; octave < OCTAVES; octave += 1) {
    value += noise(x * scale, z * scale, seed + octave) * amplitude
    total += amplitude
    amplitude *= 0.5
    scale *= 2
  }

  return value / total
}

export function terrainHeights({
  segmentsX,
  segmentsZ,
  amplitude,
  frequency,
  seed,
  offset,
}: TerrainOptions): Float32Array {
  const row = segmentsX + 1
  const heights = new Float32Array(row * (segmentsZ + 1))

  for (let z = 0; z <= segmentsZ; z += 1) {
    for (let x = 0; x < row; x += 1) {
      const n = ridges(x * frequency, (z + offset) * frequency, seed)
      heights[z * row + x] = (n * 2 - 1) * amplitude
    }
  }

  return heights
}
