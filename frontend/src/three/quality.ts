export type QualityTier = 'high' | 'low' | 'still'

export interface QualityInput {
  reducedMotion: boolean
  width: number
  /** `matchMedia('(pointer: coarse)').matches` — omitted when unknown. */
  coarsePointer?: boolean
  deviceMemory?: number
  hardwareConcurrency?: number
}

const NARROW = 768
const MIN_MEMORY_GB = 4
const MIN_CORES = 4

export function resolveQualityTier(input: QualityInput): QualityTier {
  // Reduced motion outranks everything else, including the coarse-pointer
  // rule below — both land on 'still', but the ordering has to stay explicit.
  if (input.reducedMotion) return 'still'
  // A coarse pointer never emits `pointermove`, and pointer parallax is the
  // scene's only visible motion: the time term drifts about 0.0004 rad over
  // ten seconds, which nobody can see. On a touch device an animated tier
  // would spend a full render per frame redrawing an identical image, so
  // render one frame and stop.
  if (input.coarsePointer) return 'still'
  if (input.width < NARROW) return 'low'
  if (input.deviceMemory !== undefined && input.deviceMemory < MIN_MEMORY_GB) return 'low'
  if (input.hardwareConcurrency !== undefined && input.hardwareConcurrency < MIN_CORES) {
    return 'low'
  }
  return 'high'
}
