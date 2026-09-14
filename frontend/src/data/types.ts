export interface Role {
  id: string
  company: string
  context: string
  title: string
  location: string
  start: string          // 'YYYY-MM'
  end: string | null     // null means present
  summary: string
  highlights: string[]
  stack: string[]
}

/** What a project's cover is drawn as; each is a small piece of generated art. */
export type ProjectArt = 'marker' | 'puzzle' | 'terminal'

/** Where a project stands: on a live site, published as a package, or a design concept. */
export type ProjectStatus = 'live' | 'published' | 'concept'

export interface Project {
  id: string
  name: string
  tagline: string
  art: ProjectArt
  year: string
  role: string
  summary: string
  highlights: string[]
  stack: string[]
  status: ProjectStatus
  links: { live?: string; repo?: string; npm?: string }
}

/** How well a group of tools is known. Ways of working carry no level. */
export type StackLevel = 'expert' | 'advanced'

/** The small drawing that stands for a group of tools. */
export type StackGlyph = 'layout' | 'server' | 'braces' | 'database' | 'sparkles' | 'compass'

export interface StackGroup {
  id: string
  title: string
  glyph: StackGlyph
  level?: StackLevel
  items: string[]
}

export interface Profile {
  name: string
  role: string
  /** Titles cycled under the name in the hero; the first one is shown at rest. */
  roles: string[]
  /** Short line typed out in the hero terminal chip. */
  tagline: string
  availability: string
  workAuthorization: string
  /** One line under the About title; the lede is the paragraph that follows. */
  intro: string
  lede: string
  email: string
  linkedin: string
  github: string
  cvPath: string
  siteUrl: string
  education: { school: string; degree: string; years: string }[]
  languages: { name: string; level: string }[]
  years: string
  companies: number
  clients: number
  npmPackages: number
}
