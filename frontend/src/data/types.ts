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
  projectId?: string
}

export type ProjectSource = 'cv' | 'github'
export type ProjectStatus = 'live' | 'demo' | 'archived'

export interface Project {
  id: string
  name: string
  tagline: string
  source: ProjectSource
  featured: boolean
  order: number
  year: string
  role: string
  summary: string
  highlights: string[]
  stack: string[]
  status: ProjectStatus
  links: { live?: string; repo?: string; npm?: string }
  cover?: { src: string; alt: string }
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
