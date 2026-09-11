import { handleFromUrl } from './handle'
import { profile } from '../data/profile'

describe('handleFromUrl', () => {
  it('takes the account name off the end of a profile link', () => {
    expect(handleFromUrl('https://github.com/Greenfield-Taster')).toBe('Greenfield-Taster')
  })

  it('ignores a trailing slash rather than reporting an empty handle', () => {
    expect(handleFromUrl('https://www.linkedin.com/in/anastasiia-horbachova/')).toBe(
      'anastasiia-horbachova'
    )
  })

  it('reads the real links in the profile data', () => {
    expect(handleFromUrl(profile.github)).toBe('Greenfield-Taster')
    expect(handleFromUrl(profile.linkedin)).toBe('anastasiia-horbachova')
  })

  it('hands back a bare handle unchanged', () => {
    expect(handleFromUrl('Greenfield-Taster')).toBe('Greenfield-Taster')
  })
})
