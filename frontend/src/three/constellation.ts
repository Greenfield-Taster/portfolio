export interface ConstellationOptions {
  /** Maximum distance between two stars for a line to be drawn. */
  radius: number
  /** Lines allowed to touch any one star, so clusters do not turn into a mesh. */
  maxPerPoint: number
}

/**
 * Pairs up nearby stars into the index pairs a LineSegments geometry wants.
 * Each pair is reported once, ordered low index first.
 */
export function constellationLinks(
  positions: Float32Array,
  { radius, maxPerPoint }: ConstellationOptions
): [number, number][] {
  const count = positions.length / 3
  const limit = radius * radius
  const used = new Int32Array(count)
  const links: [number, number][] = []

  for (let a = 0; a < count; a += 1) {
    if (used[a] >= maxPerPoint) continue

    for (let b = a + 1; b < count; b += 1) {
      if (used[a] >= maxPerPoint) break
      if (used[b] >= maxPerPoint) continue

      const dx = positions[a * 3] - positions[b * 3]
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1]
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2]

      if (dx * dx + dy * dy + dz * dz > limit) continue

      links.push([a, b])
      used[a] += 1
      used[b] += 1
    }
  }

  return links
}
