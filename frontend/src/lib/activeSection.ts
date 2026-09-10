export interface SectionTop {
  id: string
  /** Section top edge, relative to the viewport. */
  top: number
}

export interface ActiveSectionInput {
  sections: SectionTop[]
  /** Distance from the viewport top where a section counts as "the one being read". */
  probeY: number
  atBottom: boolean
}

export function pickActiveSection({
  sections,
  probeY,
  atBottom,
}: ActiveSectionInput): string | null {
  if (sections.length === 0) return null
  if (atBottom) return sections[sections.length - 1].id

  let active = sections[0].id
  for (const section of sections) {
    if (section.top <= probeY) active = section.id
  }
  return active
}
