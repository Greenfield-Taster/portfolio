import { useEffect, useRef } from 'react'
import type { Project } from '../../data/types'
import { Button } from '../Button/Button'
import './ProjectPanel.scss'

interface ProjectPanelProps {
  project: Project
  onClose: () => void
}

// This panel renders inline in the section's normal flow — it is not an
// overlay, and it does not trap focus or make the rest of the page inert.
// It is a labelled region, not a dialog.
export function ProjectPanel({ project, onClose }: ProjectPanelProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    ref.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <section
      className="panel"
      aria-labelledby="panel-title"
      tabIndex={-1}
      ref={ref}
      data-testid="project-panel"
    >
      <div className="panel__head">
        <div>
          <p className="u-label">{project.year} · {project.role}</p>
          <h3 id="panel-title" className="panel__title u-display">{project.name}</h3>
        </div>
        <button
          type="button"
          className="panel__close"
          onClick={onClose}
          aria-label="Close project details"
        >
          ✕
        </button>
      </div>

      <p className="panel__summary u-prose">{project.summary}</p>

      <ul className="panel__highlights">
        {project.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      <ul className="panel__stack">
        {project.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <div className="panel__links">
        {project.links.live && (
          <Button href={project.links.live}>Visit site</Button>
        )}
        {project.links.repo && (
          <Button variant="ghost" href={project.links.repo}>Source</Button>
        )}
        {project.links.npm && (
          <Button variant="ghost" href={project.links.npm}>npm</Button>
        )}
      </div>
    </section>
  )
}
