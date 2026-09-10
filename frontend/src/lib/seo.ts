import type { Profile } from '../data/types'

export function buildPersonJsonLd(profile: Profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: profile.siteUrl,
    sameAs: [profile.github, profile.linkedin],
    knowsLanguage: profile.languages.map((l) => l.name),
    alumniOf: profile.education.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.school,
    })),
  }
}

export function buildWebSiteJsonLd(profile: Profile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${profile.name} — ${profile.role}`,
    url: profile.siteUrl,
  }
}
