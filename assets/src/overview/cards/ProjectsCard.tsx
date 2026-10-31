import {
  Button,
  Icon,
  Link,
  List,
  ListItemCustom,
  SegmentedButton,
  SegmentedButtonItem,
  Tag,
  Text,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/shipping-status.js'
import { motion, useReducedMotion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { projects, VISIBLE_PROJECTS } from '../../data/projects.ts'
import { buildStats, transports } from '../../data/transports.ts'
import type { Project, Transport } from '../../data/types.ts'
import { useCardHeader } from '../cardHeader.ts'
import { useDesktop } from '../useDesktop.ts'

type View = 'repositories' | 'transports'

// Repositories and Transport Log show the same number of entries before "Show all" (AC-02.9)
const VISIBLE_ENTRIES = VISIBLE_PROJECTS

const STATS: { label: string; value: number }[] = [
  { label: 'Change Requests', value: buildStats.changeRequests },
  { label: 'Tasks', value: buildStats.tasks },
  { label: 'Tests', value: buildStats.tests },
  { label: 'Commits', value: buildStats.commits },
]

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

// Compact like a line in the transport organizer: number, date and status above the text
function TransportItem({ transport }: { transport: Transport }) {
  const imported = transport.status === 'Imported'
  return (
    <ListItemCustom
      type="Inactive"
      data-transport={transport.number}
      accessibleName={`${transport.number}, ${transport.text}, ${transport.date}, ${transport.status}`}
    >
      <div className="transport">
        <Icon name="shipping-status" className="transport-icon" />
        <span className="transport-number">{transport.number}</span>
        <span className="transport-date">{transport.date}</span>
        <span className="transport-status" data-status={transport.status}>
          {imported ? '✓ Imported' : 'Released'}
        </span>
        <span className="transport-text">{transport.text}</span>
      </div>
    </ListItemCustom>
  )
}

/**
 * The first entries in one list, the rest in a second list that opens like the extra skills;
 * on desktop only (AC-02.5, AC-02.9)
 */
function ShowAllList<T>({
  items,
  render,
  name,
  id,
}: {
  items: T[]
  render: (item: T) => ReactNode
  name: string
  id: Lowercase<string>
}) {
  const desktop = useDesktop()
  const [showAll, setShowAll] = useState(false)
  const top = items.slice(0, VISIBLE_ENTRIES)
  const more = items.slice(VISIBLE_ENTRIES)
  const collapsible = desktop && more.length > 0
  const open = !collapsible || showAll
  const moreId = `${id}-more` as const

  return (
    <>
      <List className="projects-list" separators="Inner" accessibleName={name}>
        {top.map(render)}
      </List>
      {more.length > 0 && (
        <div id={moreId} className="project-more" data-open={open} inert={!open}>
          <List
            className="projects-list project-more-list"
            separators="Inner"
            accessibleName={`More ${name.toLowerCase()}`}
          >
            {more.map(render)}
          </List>
        </div>
      )}
      {collapsible && (
        <Button
          design="Transparent"
          className="projects-toggle"
          data-testid={`${id}-toggle`}
          accessibilityAttributes={{ expanded: showAll, controls: moreId }}
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? 'Show less' : `Show all (${items.length})`}
        </Button>
      )}
    </>
  )
}

function RepositoriesView() {
  useCardHeader({ subtitle: 'Selected repositories', kpi: String(projects.length) })
  return (
    <ShowAllList
      items={projects}
      render={(project) => <ProjectItem key={project.id} project={project} />}
      name="Projects"
      id="projects"
    />
  )
}

// The site's change requests as SAP transports (AC-02.7, AC-02.8)
function TransportLogView() {
  useCardHeader({ subtitle: 'Built spec-driven', kpi: String(transports.length) })
  return (
    <>
      <dl className="build-stats" data-testid="build-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="build-stat">
            <dd className="build-stat-value">{stat.value}</dd>
            <dt className="build-stat-label">{stat.label}</dt>
          </div>
        ))}
      </dl>
      <ShowAllList
        items={transports}
        render={(transport) => <TransportItem key={transport.number} transport={transport} />}
        name="Transports"
        id="transports"
      />
    </>
  )
}

export function ProjectsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const [view, setView] = useState<View>('repositories')

  return (
    <div className={`projects${reduceMotion ? ' no-collapse-animation' : ''}`}>
      <SegmentedButton
        className="projects-views"
        accessibleName="Project views"
        data-testid="projects-views"
        onSelectionChange={(event) => {
          const selected = event.detail.selectedItems[0]?.dataset.view as View | undefined
          if (selected) setView(selected)
        }}
      >
        <SegmentedButtonItem data-view="repositories" selected={view === 'repositories'}>
          Repositories
        </SegmentedButtonItem>
        <SegmentedButtonItem data-view="transports" selected={view === 'transports'}>
          Transport Log
        </SegmentedButtonItem>
      </SegmentedButton>
      {/* Cross-fade between the views; without animation on reduced motion (AC-02.6) */}
      <motion.div
        key={view}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        data-active-view={view}
      >
        {view === 'repositories' ? <RepositoriesView /> : <TransportLogView />}
      </motion.div>
    </div>
  )
}
