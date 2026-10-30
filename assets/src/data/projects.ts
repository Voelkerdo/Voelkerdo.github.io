import type { Project } from './types.ts'
import { profile } from './profile.ts'

// TODO(content): replace placeholder projects with curated repositories (D-1)
export const projects: Project[] = [
  {
    id: 'portfolio-website',
    name: 'Portfolio Website',
    description:
      'This website – a Fiori overview page reimagined with React and SAP UI5 Web Components, built spec-driven.',
    technologies: ['React', 'TypeScript', 'SAP UI5 Web Components', 'Motion'],
    repoUrl: profile.siteRepoUrl,
  },
  {
    id: 'placeholder-project-2',
    name: 'Project Two',
    description: 'Placeholder – short description of the project.',
    technologies: ['ABAP', 'RAP'],
    repoUrl: profile.githubUrl,
  },
  {
    id: 'placeholder-project-3',
    name: 'Project Three',
    description: 'Placeholder – short description of the project.',
    technologies: ['Node.js', 'JavaScript'],
    repoUrl: profile.githubUrl,
  },
]
