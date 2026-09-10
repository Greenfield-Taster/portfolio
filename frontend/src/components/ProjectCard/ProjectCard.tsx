import type { Project } from '../../data/types'
import './ProjectCard.scss'

interface ProjectCardProps {
  project: Project
  variant: 'featured' | 'compact'
  onOpen: (id: string) => void
}

export function ProjectCard({ project, variant, onOpen }: ProjectCardProps) {
  return (
    <article className={`card card--${variant}`} data-testid="project-card" data-reveal>
      <button
        type="button"
        id={`work-card-${project.id}`}
        className="card__hit"
        onClick={() => onOpen(project.id)}
        aria-label={`Open details for ${project.name}`}
      >
        {variant === 'featured' && (
          <div className="card__media" aria-hidden="true">
            {project.cover ? (
              <img src={project.cover.src} alt="" loading="lazy" />
            ) : (
              <span className="card__placeholder">{project.name}</span>
            )}
          </div>
        )}

        <div className="card__body">
          <div className="card__meta">
            <span className="card__year">{project.year}</span>
            <span className={`card__status card__status--${project.status}`}>
              {project.status}
            </span>
          </div>
          <h3 className="card__name">{project.name}</h3>
          <p className="card__tagline">{project.tagline}</p>
          <ul className="card__stack">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </button>
    </article>
  )
}
