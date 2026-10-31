import {
  Button,
  type ButtonDomRef,
  Icon,
  Link,
  List,
  ListItemCustom,
  Tag,
  Text,
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/accept.js'
import '@ui5/webcomponents-icons/dist/shipping-status.js'
import '@ui5/webcomponents-icons/dist/slim-arrow-left.js'
import '@ui5/webcomponents-icons/dist/slim-arrow-right.js'
import { renderFinished } from '@ui5/webcomponents-base/dist/Render.js'
import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { projects, VISIBLE_PROJECTS } from '../../data/projects.ts'
import { buildStats, transports } from '../../data/transports.ts'
import type { Project, Transport } from '../../data/types.ts'
import { useCardHeader } from '../cardHeader.ts'

type View = 'repositories' | 'transports'

// Header subtitle and KPI follow the active page (AC-01.3, AC-02.10)
const PAGES: { view: View; label: string; subtitle: string; kpi: string }[] = [
  {
    view: 'repositories',
    label: 'Repositories',
    subtitle: 'Selected repositories',
    kpi: String(projects.length),
  },
  {
    view: 'transports',
    label: 'Transport Log',
    subtitle: 'Built spec-driven',
    kpi: String(transports.length),
  },
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
          {/* An icon instead of "✓": the character would load the large "72full" font (AC-08.2) */}
          {imported && <Icon name="accept" className="transport-status-icon" />}
          {transport.status}
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
  const [showAll, setShowAll] = useState(false)
  const top = items.slice(0, VISIBLE_ENTRIES)
  const more = items.slice(VISIBLE_ENTRIES)
  // On every screen width, so both pages keep about the same height (AC-02.5, AC-02.9, D-23)
  const collapsible = more.length > 0
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
  const prevRef = useRef<ButtonDomRef>(null)
  const nextRef = useRef<ButtonDomRef>(null)
  const [view, setView] = useState<View>('repositories')
  // Choosing a page or expanding a list ends the rotation until reload (AC-02.11)
  const [stopped, setStopped] = useState(false)
  const paused = useRotationPaused(rootRef)
  const stop = () => setStopped(true)
  const pageIndex = PAGES.findIndex((page) => page.view === view)
  useCardHeader({ subtitle: PAGES[pageIndex].subtitle, kpi: PAGES[pageIndex].kpi })
  const isFirst = pageIndex === 0
  const isLast = pageIndex === PAGES.length - 1

  // Choosing a page by dot or arrow ends the rotation (AC-02.11)
  const choose = (target: View) => {
    setView(target)
    stop()
  }

  // The arrow that gets disabled at the end loses the focus: hand it to the other arrow once
  // React and UI5 have rendered the new page (AC-02.10)
  const step = (direction: 1 | -1) => {
    const target = pageIndex + direction
    const [arrow, other] = direction === 1 ? [nextRef, prevRef] : [prevRef, nextRef]
    const reachesEnd = target === 0 || target === PAGES.length - 1
    if (reachesEnd && arrow.current?.matches(':focus-within')) {
      setTimeout(() => void renderFinished().then(() => other.current?.focus()))
    }
    choose(PAGES[target].view)
  }

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
      {/* Both pages stacked in one grid cell: the card is as high as the higher page and
          the pages cross-fade (AC-02.12, D-23) */}
      <div className="project-pages" data-active-view={view}>
        {PAGES.map((page) => {
          const active = page.view === view
          return (
            <div
              key={page.view}
              className="project-page"
              data-page-view={page.view}
              data-active={active}
              inert={!active}
            >
              {page.view === 'repositories' ? (
                <RepositoriesView onExpand={stop} />
              ) : (
                <TransportLogView onExpand={stop} />
              )}
            </div>
          )
        })}
      </div>
      {/* Page dots at the bottom of the card; the active page is filled (AC-02.10) */}
      <div className="page-dots" role="group" aria-label="Project pages" data-testid="page-dots">
        <Button
          ref={prevRef}
          design="Transparent"
          icon="slim-arrow-left"
          accessibleName="Previous page"
          tooltip="Previous page"
          className="page-arrow"
          data-testid="page-prev"
          disabled={isFirst}
          onClick={() => step(-1)}
        />
        {PAGES.map((page) => (
          <button
            key={page.view}
            type="button"
            className="page-dot"
            data-page={page.view}
            aria-label={page.label}
            aria-current={page.view === view ? 'true' : undefined}
            onClick={() => choose(page.view)}
          />
        ))}
        <Button
          ref={nextRef}
          design="Transparent"
          icon="slim-arrow-right"
          accessibleName="Next page"
          tooltip="Next page"
          className="page-arrow"
          data-testid="page-next"
          disabled={isLast}
          onClick={() => step(1)}
        />
      </div>
    </div>
  )
}
