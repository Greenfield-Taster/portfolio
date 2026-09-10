import { Fragment, useCallback } from 'react'
import { Section } from '../../components/Section/Section'
import { ProjectCard } from '../../components/ProjectCard/ProjectCard'
import { ProjectPanel } from '../../components/ProjectPanel/ProjectPanel'
import { useHashPanel } from '../../hooks/useHashPanel'
import { featuredProjects, compactProjects, findProject } from '../../data/select'
import type { Project } from '../../data/types'
import './Work.scss'

export function Work() {
  const { openId, open, close } = useHashPanel('work')
  const openProject = openId ? findProject(openId) : undefined

  // Return focus to the card that opened the panel, so closing it (via the
  // close button or Escape) doesn't strand keyboard focus on <body>.
  const handleClose = useCallback(() => {
    const closingId = openId
    close()
    if (closingId) {
      document.getElementById(`work-card-${closingId}`)?.focus()
    }
  }, [openId, close])

  // The panel mounts inside the grid, immediately after the card that opened
  // it, so the card really does expand in place. Single-column on a phone that
  // puts it directly under the tapped card; on a multi-column desktop grid
  // `grid-column: 1 / -1` (see Work.scss) spans it across the full row beneath.
  //
  // Ids are unique across both grids, so at most one card in one grid ever
  // matches: there is never more than one panel in the DOM, and none is
  // rendered-then-hidden.
  const renderCard = (project: Project, variant: 'featured' | 'compact') => (
    <Fragment key={project.id}>
      <ProjectCard project={project} variant={variant} onOpen={open} />
      {openProject?.id === project.id ? (
        <ProjectPanel project={openProject} onClose={handleClose} />
      ) : null}
    </Fragment>
  )

  return (
    <Section
      id="work"
      eyebrow="Work"
      title="Selected work"
      lede="Commercial projects first, then things I built on my own. Open any card for the detail."
    >
      <div className="work__featured">
        {featuredProjects().map((project) => renderCard(project, 'featured'))}
      </div>

      <div className="work__compact" data-testid="compact-grid">
        {compactProjects().map((project) => renderCard(project, 'compact'))}
      </div>
    </Section>
  )
}
