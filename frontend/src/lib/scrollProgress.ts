export interface ScrollProgressInput {
  /** The tracked element's top edge, relative to the viewport. */
  top: number
  height: number
  viewportHeight: number
}

function clamp(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * How far the reader has travelled through an element, 0 to 1, measured
 * against the middle of the viewport: 0 while the element's top is still
 * below the middle, 1 once its bottom has risen past it.
 *
 * Anchoring on the middle rather than on the top is what keeps the drawn line
 * and the markers in step — the line's leading edge always lands exactly on
 * the anchor, so a marker is passed at the same moment the line reaches it.
 */
export function computeScrollProgress({
  top,
  height,
  viewportHeight,
}: ScrollProgressInput): number {
  // A collapsed element has no distance to travel, and dividing by it would
  // report NaN rather than a progress.
  if (height <= 0) return 0

  const anchor = viewportHeight / 2
  return clamp((anchor - top) / height)
}
