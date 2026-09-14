import { ProjectArt } from '../ProjectArt/ProjectArt'
import type { Project, ProjectStatus } from '../../data/types'
import './ProjectCard.scss'

// Plain words for where a project stands, rather than the data's own keys.
const STATUS: Record<ProjectStatus, string> = {
  live: 'Live',
  published: 'On npm',
  concept: 'Design concept',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="pc" data-testid="project-card" data-reveal>
      <div className="pc__art" aria-hidden="true" data-testid="project-art">
        <ProjectArt kind={project.art} />
      </div>

      <div className="pc__body">
        <p className="pc__meta">
          <span className="pc__year">{project.year}</span>
          <span className={`pc__status pc__status--${project.status}`}>
            {STATUS[project.status]}
          </span>
        </p>

        <h3 className="pc__name">{project.name}</h3>
        <p className="pc__tagline">{project.tagline}</p>
        <p className="pc__summary u-prose">{project.summary}</p>

        <ul className="pc__highlights">
          {project.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <footer className="pc__foot">
          <ul className="pc__stack">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <p className="pc__links">
            {project.links.live && (
              <a href={project.links.live} target="_blank" rel="noreferrer">
                Live site
              </a>
            )}
            {project.links.repo && (
              <a href={project.links.repo} target="_blank" rel="noreferrer">
                GitHub
              </a>
            )}
            {project.links.npm && (
              <a href={project.links.npm} target="_blank" rel="noreferrer">
                npm
              </a>
            )}
          </p>
        </footer>
      </div>
    </article>
  )
}
