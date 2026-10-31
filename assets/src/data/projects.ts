import type { Project } from './types.ts'
import { profile } from './profile.ts'

const repo = (name: string) => `${profile.githubUrl}/${name}`

/** Projects visible on desktop before "Show all" (AC-02.5) */
export const VISIBLE_PROJECTS = 3

// Curated by Dominik, SAP projects first (D-1, AC-02.3)
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
    id: 'abap-programming-model-fiori',
    name: 'ABAP Programming Model for SAP Fiori',
    description: 'Sample app built with the ABAP Programming Model for SAP Fiori on CDS views.',
    technologies: ['ABAP', 'CDS', 'SAP Fiori'],
    repoUrl: repo('SAP-ABAP-Programming-Model-with-SAP-Fiori'),
  },
  {
    id: 'simple-odata-service',
    name: 'Simple OData Service',
    description: 'Sample OData service built with SAP Gateway (SEGW).',
    technologies: ['ABAP', 'OData', 'SEGW'],
    repoUrl: repo('abap_simple_odata_service'),
  },
  {
    id: 'quote-api',
    name: 'Quote API',
    description: 'A simple quote REST API with Node.js and Express.',
    technologies: ['Node.js', 'Express', 'JavaScript'],
    repoUrl: repo('codecademy-quote-api'),
  },
  {
    id: 'message-mixer',
    name: 'Message Mixer',
    description: 'Generates random message strings on the Node.js console.',
    technologies: ['Node.js', 'JavaScript'],
    repoUrl: repo('codecadmey-message-mixer'),
  },
]
