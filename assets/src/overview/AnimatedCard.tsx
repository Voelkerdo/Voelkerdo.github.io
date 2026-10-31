import { Card, CardHeader, Icon } from '@ui5/webcomponents-react'
import { m, useReducedMotion } from 'motion/react'
import { useState, type ReactNode } from 'react'
import type { CardDef } from '../data/types.ts'
import { CardEntryContext } from '../motion/cardEntry.ts'
import { CardHeaderContext, type HeaderOverride } from './cardHeader.ts'
import {
  entryVariants,
  LIFT,
  liftTransition,
  reducedEntryVariants,
  REST,
} from '../motion/transitions.ts'

/**
 * True if the focus came from the keyboard. Follows the focus into shadow roots of UI5
 * components, because the event target is only the host element (AC-07.3, AC-06.5).
 */
function isKeyboardFocus(target: EventTarget): boolean {
  let el = target as Element
  while (el.shadowRoot?.activeElement) el = el.shadowRoot.activeElement
  try {
    return el.matches(':focus-visible')
  } catch {
    return true
  }
}

export function AnimatedCard({ def, children }: { def: CardDef; children?: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [entered, setEntered] = useState(false)
  // A card with several views shows the subtitle and KPI of the current view (AC-02.6)
  const [headerOverride, setHeaderOverride] = useState<HeaderOverride | null>(null)
  const active = hovered || focused

  return (
    <m.div
      className={`bento-cell bento-${def.id}`}
      data-card-id={def.id}
      variants={reduceMotion ? reducedEntryVariants : entryVariants}
      onAnimationComplete={(definition) => {
        if (definition === 'visible') setEntered(true)
      }}
    >
      {/* Separate element for hover/focus so its own animate prop does not break the parent stagger */}
      <m.div
        className="bento-card"
        data-active={active}
        animate={reduceMotion ? REST : active ? LIFT : REST}
        transition={liftTransition}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onFocusCapture={(event) => setFocused(isKeyboardFocus(event.target))}
        onBlurCapture={() => setFocused(false)}
      >
        <Card
          className="overview-card"
          accessibleName={def.title}
          header={
            <CardHeader
              titleText={def.title}
              subtitleText={headerOverride?.subtitle ?? def.subtitle}
              additionalText={headerOverride?.kpi ?? def.kpi}
              avatar={<Icon name={def.icon} />}
            />
          }
        >
          <CardHeaderContext.Provider value={setHeaderOverride}>
            <CardEntryContext.Provider value={entered}>{children}</CardEntryContext.Provider>
          </CardHeaderContext.Provider>
        </Card>
      </m.div>
    </m.div>
  )
}
