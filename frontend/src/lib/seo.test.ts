import { buildPersonJsonLd, buildWebSiteJsonLd } from './seo'
import { profile } from '../data/profile'

describe('buildPersonJsonLd', () => {
  const ld = buildPersonJsonLd(profile) as Record<string, unknown>
  it('declares itself a Person', () => {
    expect(ld['@type']).toBe('Person')
    expect(ld['@context']).toBe('https://schema.org')
  })

  it('carries the name and job title', () => {
    expect(ld.name).toBe('Anastasiia Horbachova')
    expect(ld.jobTitle).toBe('Full-stack developer')
  })

  it('lists the profiles a search engine can follow', () => {
    expect(ld.sameAs).toEqual([profile.github, profile.linkedin])
  })

  it('lists both schools under alumniOf as EducationalOrganization entries', () => {
    expect(ld.alumniOf).toEqual(
      profile.education.map((e) => ({
        '@type': 'EducationalOrganization',
        name: e.school,
      }))
    )
  })

  it('serialises without throwing', () => {
    expect(() => JSON.stringify(ld)).not.toThrow()
  })
})

describe('buildWebSiteJsonLd', () => {
  it('points at the canonical site URL', () => {
    const ld = buildWebSiteJsonLd(profile) as Record<string, unknown>
    expect(ld['@type']).toBe('WebSite')
    expect(ld.url).toBe('https://horbachova.com/')
  })
})
