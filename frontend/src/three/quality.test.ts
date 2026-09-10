import { resolveQualityTier } from './quality'

const desktop = { reducedMotion: false, width: 1440, deviceMemory: 8, hardwareConcurrency: 8 }

describe('resolveQualityTier', () => {
  it('gives a capable desktop the full scene', () => {
    expect(resolveQualityTier(desktop)).toBe('high')
  })

  it('honours reduced motion above everything else', () => {
    expect(resolveQualityTier({ ...desktop, reducedMotion: true })).toBe('still')
  })

  it('drops to low on a narrow viewport', () => {
    expect(resolveQualityTier({ ...desktop, width: 640 })).toBe('low')
  })

  it('drops to low on a device with little memory', () => {
    expect(resolveQualityTier({ ...desktop, deviceMemory: 2 })).toBe('low')
  })

  it('drops to low on a device with few cores', () => {
    expect(resolveQualityTier({ ...desktop, hardwareConcurrency: 2 })).toBe('low')
  })

  it('assumes capable hardware when the browser will not say', () => {
    expect(
      resolveQualityTier({ reducedMotion: false, width: 1440 })
    ).toBe('high')
  })

  it('stops animating on a coarse pointer, which never emits pointermove', () => {
    expect(resolveQualityTier({ ...desktop, coarsePointer: true })).toBe('still')
  })

  it('stops animating on a coarse pointer even on a wide, capable device', () => {
    expect(
      resolveQualityTier({
        reducedMotion: false,
        coarsePointer: true,
        width: 2560,
        deviceMemory: 16,
        hardwareConcurrency: 16,
      })
    ).toBe('still')
  })

  it('keeps reduced motion ahead of the coarse-pointer rule', () => {
    expect(
      resolveQualityTier({ ...desktop, reducedMotion: true, coarsePointer: true })
    ).toBe('still')
  })

  it('leaves a fine-pointer desktop exactly as it was', () => {
    expect(resolveQualityTier({ ...desktop, coarsePointer: false })).toBe('high')
    expect(resolveQualityTier({ ...desktop, coarsePointer: false, width: 640 })).toBe('low')
  })
})
