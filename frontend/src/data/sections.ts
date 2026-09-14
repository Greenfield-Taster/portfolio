/**
 * The order the page puts its sections in. The navigation lists them from
 * here and every section head numbers itself from here, so the running order
 * lives in one place instead of drifting between two hand-written lists.
 */
export const SECTIONS = [
  { id: 'top', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const

/** Sections that carry a number. The hero opens the page rather than taking a place in the count. */
const NUMBERED = SECTIONS.filter((section) => section.id !== 'top')

/**
 * The two-digit mark a section head shows — '02' for Experience. Returns null
 * for a section outside the running order, which is what the hero is.
 */
export function sectionNumber(id: string): string | null {
  const index = NUMBERED.findIndex((section) => section.id === id)
  return index === -1 ? null : String(index + 1).padStart(2, '0')
}
