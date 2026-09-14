import { Section } from '../../components/Section/Section'
import { ProjectCard } from '../../components/ProjectCard/ProjectCard'
import { projects } from '../../data/projects'
import './Projects.scss'

export function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Side Projects"
      lede="Built on my own time — to use myself, or to learn something. The client work is in Experience."
    >
      <div className="projects">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  )
}
