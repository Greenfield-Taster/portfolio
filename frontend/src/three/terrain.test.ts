import { terrainHeights, type TerrainOptions } from './terrain'

const base: TerrainOptions = {
  segmentsX: 24,
  segmentsZ: 16,
  amplitude: 3,
  frequency: 0.18,
  seed: 7,
  offset: 0,
}

const vertexCount = (o: TerrainOptions) => (o.segmentsX + 1) * (o.segmentsZ + 1)

describe('terrainHeights', () => {
  it('gives every vertex of the grid a height', () => {
    expect(terrainHeights(base)).toHaveLength(vertexCount(base))
  })

  it('keeps every height inside the amplitude', () => {
    for (const h of terrainHeights(base)) {
      expect(Math.abs(h)).toBeLessThanOrEqual(base.amplitude)
    }
  })

  it('is a landscape, not static: neighbours stay close together', () => {
    const heights = terrainHeights(base)
    const row = base.segmentsX + 1
    let worst = 0

    for (let z = 0; z <= base.segmentsZ; z += 1) {
      for (let x = 0; x < base.segmentsX; x += 1) {
        const here = heights[z * row + x]
        const right = heights[z * row + x + 1]
        worst = Math.max(worst, Math.abs(here - right))
      }
    }

    expect(worst).toBeLessThan(base.amplitude * 0.67)
  })

  it('repeats exactly for the same seed', () => {
    expect(Array.from(terrainHeights(base))).toEqual(Array.from(terrainHeights(base)))
  })

  it('gives a different landscape for a different seed', () => {
    const other = terrainHeights({ ...base, seed: 8 })
    expect(Array.from(terrainHeights(base))).not.toEqual(Array.from(other))
  })

  it('scrolls by whole rows, so the animation has no seam', () => {
    const still = terrainHeights(base)
    const movedOne = terrainHeights({ ...base, offset: 1 })
    const row = base.segmentsX + 1

    for (let x = 0; x <= base.segmentsX; x += 1) {
      expect(movedOne[x]).toBeCloseTo(still[row + x], 5)
    }
  })
})
