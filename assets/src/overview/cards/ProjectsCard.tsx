import { Link, List, ListItemCustom, Tag, Text } from '@ui5/webcomponents-react'
import { projects } from '../../data/projects.ts'

export function ProjectsCard() {
  return (
    <List className="projects-list" separators="Inner" accessibleName="Projects">
      {projects.map((project) => (
        <ListItemCustom key={project.id} type="Inactive" data-project-id={project.id}>
          <div className="project-item">
            {/* UI5 Link adds rel="noreferrer noopener" for target _blank (AC-02.2) */}
            <Link href={project.repoUrl} target="_blank" className="project-name">
              {project.name}
            </Link>
            <Text className="project-description">{project.description}</Text>
            <div className="project-tags">
              {project.technologies.map((tech) => (
                <Tag key={tech} design="Neutral" size="S" hideStateIcon>
                  {tech}
                </Tag>
              ))}
            </div>
          </div>
        </ListItemCustom>
      ))}
    </List>
  )
}
