export interface ScrollProgressInput {
  top: number
  height: number
  viewportHeight: number
  anchor?: number
}

function clamp(value: number): number {
  if (value < 0) return 0
  if (value > 1) return 1
  return value
}

export function computeScrollProgress({
  top,
  height,
  viewportHeight,
  anchor = 0.5,
}: ScrollProgressInput): number {
  if (height <= 0) return 0

  return clamp((viewportHeight * anchor - top) / height)
}
