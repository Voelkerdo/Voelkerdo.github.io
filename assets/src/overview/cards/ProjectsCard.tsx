import { Button, Icon, Link, List, ListItemCustom, Tag, Text } from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/shipping-status.js'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { projects, VISIBLE_PROJECTS } from '../../data/projects.ts'
import { buildStats, transports } from '../../data/transports.ts'
import type { Project, Transport } from '../../data/types.ts'
import { useCardHeader } from '../cardHeader.ts'
import { useDesktop } from '../useDesktop.ts'

type View = 'repositories' | 'transports'

const PAGES: { view: View; label: string }[] = [
  { view: 'repositories', label: 'Repositories' },
  { view: 'transports', label: 'Transport Log' },
]

// Automatic page change (AC-02.11)
const ROTATE_MS = 8000

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
  onExpand,
}: {
  items: T[]
  render: (item: T) => ReactNode
  name: string
  id: Lowercase<string>
  onExpand: () => void
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
          onClick={() => {
            if (!showAll) onExpand()
            setShowAll(!showAll)
          }}
        >
          {showAll ? 'Show less' : `Show all (${items.length})`}
        </Button>
      )}
    </>
  )
}

function RepositoriesView({ onExpand }: { onExpand: () => void }) {
  useCardHeader({ subtitle: 'Selected repositories', kpi: String(projects.length) })
  return (
    <ShowAllList
      items={projects}
      render={(project) => <ProjectItem key={project.id} project={project} />}
      name="Projects"
      id="projects"
      onExpand={onExpand}
    />
  )
}

// The site's change requests as SAP transports (AC-02.7, AC-02.8)
function TransportLogView({ onExpand }: { onExpand: () => void }) {
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
        onExpand={onExpand}
      />
    </>
  )
}

/** Pauses while the pointer or focus is in the card or the tab is hidden (AC-02.11) */
function useRotationPaused(ref: React.RefObject<HTMLElement | null>): boolean {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(() => document.visibilityState !== 'visible')

  useEffect(() => {
    const card = ref.current?.closest('[ui5-card]')
    if (!card) return
    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    const focusIn = () => setFocused(true)
    // Focus may move within the card (also into shadow roots): check where it ended up
    const focusOut = () => setTimeout(() => setFocused(card.matches(':focus-within')))
    const visibility = () => setHidden(document.visibilityState !== 'visible')
    card.addEventListener('pointerenter', enter)
    card.addEventListener('pointerleave', leave)
    card.addEventListener('focusin', focusIn)
    card.addEventListener('focusout', focusOut)
    document.addEventListener('visibilitychange', visibility)
    return () => {
      card.removeEventListener('pointerenter', enter)
      card.removeEventListener('pointerleave', leave)
      card.removeEventListener('focusin', focusIn)
      card.removeEventListener('focusout', focusOut)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [ref])

  return hovered || focused || hidden
}

export function ProjectsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const rootRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('repositories')
  // Choosing a page or expanding a list ends the rotation until reload (AC-02.11)
  const [stopped, setStopped] = useState(false)
  const paused = useRotationPaused(rootRef)
  const stop = () => setStopped(true)

  // Restarts on every page change and after every pause, so each page shows a full 8 s
  useEffect(() => {
    if (stopped || paused || reduceMotion) return
    const timer = setTimeout(() => {
      setView((current) => (current === 'repositories' ? 'transports' : 'repositories'))
    }, ROTATE_MS)
    return () => clearTimeout(timer)
  }, [view, stopped, paused, reduceMotion])

  return (
    <div ref={rootRef} className={`projects${reduceMotion ? ' no-collapse-animation' : ''}`}>
      {/* Cross-fade between the pages; without animation on reduced motion (AC-02.10) */}
      <motion.div
        key={view}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        data-active-view={view}
      >
        {view === 'repositories' ? (
          <RepositoriesView onExpand={stop} />
        ) : (
          <TransportLogView onExpand={stop} />
        )}
      </motion.div>
      {/* Page dots at the bottom of the card; the active page is filled (AC-02.10) */}
      <div className="page-dots" role="group" aria-label="Project pages" data-testid="page-dots">
        {PAGES.map((page) => (
          <button
            key={page.view}
            type="button"
            className="page-dot"
            data-page={page.view}
            aria-label={page.label}
            aria-current={page.view === view ? 'true' : undefined}
            onClick={() => {
              setView(page.view)
              stop()
            }}
          />
        ))}
      </div>
    </div>
  )
}
