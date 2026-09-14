export type QualityTier = 'high' | 'low' | 'still'

export interface QualityInput {
  reducedMotion: boolean
  width: number
  coarsePointer?: boolean
  deviceMemory?: number
  hardwareConcurrency?: number
}

const NARROW = 768
const MIN_MEMORY_GB = 4
const MIN_CORES = 4

export function resolveQualityTier(input: QualityInput): QualityTier {
  if (input.reducedMotion) return 'still'
  if (input.coarsePointer) return 'still'
  if (input.width < NARROW) return 'low'
  if (input.deviceMemory !== undefined && input.deviceMemory < MIN_MEMORY_GB) return 'low'
  if (input.hardwareConcurrency !== undefined && input.hardwareConcurrency < MIN_CORES) {
    return 'low'
  }
  return 'high'
}
