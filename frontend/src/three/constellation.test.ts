import { constellationLinks } from './constellation'

// A deliberate layout: a, b and c form a tight cluster; d sits far away.
const points = new Float32Array([
  0, 0, 0,
  1, 0, 0,
  0, 1, 0,
  40, 40, 0,
])

describe('constellationLinks', () => {
  it('links the stars that are close enough to each other', () => {
    const links = constellationLinks(points, { radius: 2, maxPerPoint: 4 })

    expect(links).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ])
  })

  it('leaves a lone star unlinked', () => {
    const links = constellationLinks(points, { radius: 2, maxPerPoint: 4 })

    expect(links.flat()).not.toContain(3)
  })

  it('links every pair once, never a star to itself', () => {
    const links = constellationLinks(points, { radius: 100, maxPerPoint: 8 })

    for (const [a, b] of links) expect(a).toBeLessThan(b)
    expect(new Set(links.map(String)).size).toBe(links.length)
  })

  it('caps how many lines leave one star, so dense clusters stay readable', () => {
    const links = constellationLinks(points, { radius: 100, maxPerPoint: 1 })

    const used = new Map<number, number>()
    for (const [a, b] of links) {
      used.set(a, (used.get(a) ?? 0) + 1)
      used.set(b, (used.get(b) ?? 0) + 1)
    }
    for (const count of used.values()) expect(count).toBeLessThanOrEqual(1)
  })
})
