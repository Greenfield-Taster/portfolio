export interface ScrollProgressInput {
  /** The tracked element's top edge, relative to the viewport. */
  top: number
  height: number
  viewportHeight: number
  /**
   * Where on the screen the progress is measured from, as a fraction of the
   * viewport height: 0.5 is the middle, 0.8 is near the bottom. Defaults to
   * the middle.
   */
  anchor?: number
}

function clamp(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

/**
 * How far the reader has travelled through an element, 0 to 1, measured
 * against an anchor line across the viewport: 0 while the element's top is
 * still below the anchor, 1 once its bottom has risen past it.
 *
 * Measuring against one anchor is what keeps a drawn line and its markers in
 * step — the line's leading edge always lands exactly on the anchor, so a
 * marker is passed at the same moment the line reaches it.
 */
export function computeScrollProgress({
  top,
  height,
  viewportHeight,
  anchor = 0.5,
}: ScrollProgressInput): number {
  // A collapsed element has no distance to travel, and dividing by it would
  // report NaN rather than a progress.
  if (height <= 0) return 0

  return clamp((viewportHeight * anchor - top) / height)
}
