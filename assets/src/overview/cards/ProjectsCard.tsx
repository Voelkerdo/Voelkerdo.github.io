import { Button, Link, List, ListItemCustom, Tag, Text } from '@ui5/webcomponents-react'
import { useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { projects, VISIBLE_PROJECTS } from '../../data/projects.ts'
import type { Project } from '../../data/types.ts'
import { useDesktop } from '../useDesktop.ts'

const topProjects = projects.slice(0, VISIBLE_PROJECTS)
const moreProjects = projects.slice(VISIBLE_PROJECTS)
const MORE_ID = 'project-list-more'

function ProjectItem({ project }: { project: Project }) {
  return (
    <ListItemCustom type="Inactive" data-project-id={project.id}>
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
  )
}

export function ProjectsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const desktop = useDesktop()
  const [showAll, setShowAll] = useState(false)
  // Below desktop all projects are shown, without toggle (AC-02.5)
  const collapsible = desktop && moreProjects.length > 0
  const open = !collapsible || showAll

  return (
    <div className={`projects${reduceMotion ? ' no-collapse-animation' : ''}`}>
      <List className="projects-list" separators="Inner" accessibleName="Projects">
        {topProjects.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </List>
      {moreProjects.length > 0 && (
        // Always rendered; only the wrapper animates open, like the extra skills (AC-03.9)
        <div id={MORE_ID} className="project-more" data-open={open} inert={!open}>
          <List
            className="projects-list project-more-list"
            separators="Inner"
            accessibleName="More projects"
          >
            {moreProjects.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </List>
        </div>
      )}
      {collapsible && (
        <Button
          design="Transparent"
          className="projects-toggle"
          data-testid="projects-toggle"
          accessibilityAttributes={{ expanded: showAll, controls: MORE_ID }}
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? 'Show less' : `Show all (${projects.length})`}
        </Button>
      )}
    </div>
  )
}
