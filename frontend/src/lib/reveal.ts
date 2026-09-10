export function shouldReveal(
  rect: { top: number },
  viewportHeight: number,
  reducedMotion: boolean
): boolean {
  if (reducedMotion) return false
  return rect.top > viewportHeight
}
