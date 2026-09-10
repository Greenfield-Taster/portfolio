import { TAURUS_LINES, TAURUS_STARS, projectTaurus } from './taurus'

const options = { centreX: 0, centreY: 0, scale: 1, sizeRange: [0.2, 0.5] as [number, number] }

function distance(positions: Float32Array, a: number, b: number): number {
  const dx = positions[a * 3] - positions[b * 3]
  const dy = positions[a * 3 + 1] - positions[b * 3 + 1]
  return Math.hypot(dx, dy)
}

describe('Taurus', () => {
  it('draws every line between stars that exist', () => {
    const ids = new Set(TAURUS_STARS.map((star) => star.id))

    for (const [from, to] of TAURUS_LINES) {
      expect(ids).toContain(from)
      expect(ids).toContain(to)
    }
  })

  it('leaves no star out of the figure', () => {
    const linked = new Set(TAURUS_LINES.flat())

    for (const star of TAURUS_STARS) {
      expect(linked).toContain(star.id)
    }
  })

  it('places every star and both ends of every line', () => {
    const sky = projectTaurus(options)

    expect(sky.positions).toHaveLength(TAURUS_STARS.length * 3)
    expect(sky.sizes).toHaveLength(TAURUS_STARS.length)
    expect(sky.linePositions).toHaveLength(TAURUS_LINES.length * 6)
  })

  it('keeps the shape when the figure is scaled', () => {
    const small = projectTaurus(options)
    const large = projectTaurus({ ...options, scale: 3 })

    // Aldebaran to Elnath — the long diagonal across the bull's face and horn.
    const a = TAURUS_STARS.findIndex((s) => s.id === 'alpha')
    const b = TAURUS_STARS.findIndex((s) => s.id === 'beta')

    expect(distance(large.positions, a, b)).toBeCloseTo(distance(small.positions, a, b) * 3, 4)
  })

  it('centres the figure where it is asked to', () => {
    const sky = projectTaurus({ ...options, centreX: 12, centreY: -4 })

    const xs = Array.from({ length: TAURUS_STARS.length }, (_, i) => sky.positions[i * 3])
    const ys = Array.from({ length: TAURUS_STARS.length }, (_, i) => sky.positions[i * 3 + 1])
    const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length

    expect(mean(xs)).toBeCloseTo(12, 4)
    expect(mean(ys)).toBeCloseTo(-4, 4)
  })

  it('draws the brighter stars bigger', () => {
    const sky = projectTaurus(options)
    const aldebaran = TAURUS_STARS.findIndex((s) => s.id === 'alpha')
    const faintest = TAURUS_STARS.reduce(
      (dimmest, star, i) => (star.magnitude > TAURUS_STARS[dimmest].magnitude ? i : dimmest),
      0
    )

    // Aldebaran is the brightest star in Taurus, so it has to be the largest dot.
    expect(sky.sizes[aldebaran]).toBeGreaterThan(sky.sizes[faintest])
    expect(Math.min(...sky.sizes)).toBeGreaterThanOrEqual(options.sizeRange[0])
    expect(Math.max(...sky.sizes)).toBeLessThanOrEqual(options.sizeRange[1])
  })
})
