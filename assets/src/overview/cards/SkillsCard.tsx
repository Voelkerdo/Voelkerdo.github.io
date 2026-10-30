import { Button, ProgressIndicator, Text } from '@ui5/webcomponents-react'
import { useInView, useReducedMotion } from 'motion/react'
import { useRef, useState, type CSSProperties, type TransitionEvent } from 'react'
import { LEVEL_PERCENT, sortedSkills, VISIBLE_SKILLS } from '../../data/skills.ts'
import type { Skill } from '../../data/types.ts'
import { useCardEntered } from '../../motion/cardEntry.ts'
import { useBarFill } from '../../motion/useBarFill.ts'

const STAGGER_MS = 60
const skillList = sortedSkills()
const topSkills = skillList.slice(0, VISIBLE_SKILLS)
const moreSkills = skillList.slice(VISIBLE_SKILLS)
const MORE_ID = 'skill-list-more'

function SkillRow({
  skill,
  delayIndex,
  start,
}: {
  skill: Skill
  delayIndex: number
  start: boolean
}) {
  const reduceMotion = useReducedMotion() ?? false
  const filled = useBarFill(reduceMotion, start)
  const delay = { '--bar-delay': `${delayIndex * STAGGER_MS}ms` } as CSSProperties

  return (
    <li className="skill" data-skill={skill.name}>
      <Text className="skill-name">{skill.name}</Text>
      <ProgressIndicator
        className="skill-bar"
        style={delay}
        // Empty while not started, so the bar animates again on every expand (AC-03.9);
        // with reduced motion always at its value (AC-08.3)
        value={filled && (start || reduceMotion) ? LEVEL_PERCENT[skill.level] : 0}
        displayValue={skill.level}
        accessibleName={`${skill.name}: ${skill.level}`}
        data-level={skill.level}
      />
    </li>
  )
}

export function SkillsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const listRef = useRef<HTMLUListElement>(null)
  const entered = useCardEntered()
  const inView = useInView(listRef, { once: true, amount: 0.3 })
  const [showAll, setShowAll] = useState(false)
  const [expanded, setExpanded] = useState(false)
  // Start only when visitors can actually see the bars (AC-03.6)
  const start = entered && inView

  const toggle = () => {
    setShowAll((value) => !value)
    setExpanded(false)
  }

  // The extra rows are always rendered; only their wrapper animates open (AC-03.9)
  const onMoreTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && showAll) setExpanded(true)
  }

  return (
    <div className={`skills${reduceMotion ? ' no-bar-animation' : ''}`}>
      <ul ref={listRef} className="skill-list" aria-label="Top skills by level">
        {topSkills.map((skill, index) => (
          <SkillRow key={skill.name} skill={skill} delayIndex={index} start={start} />
        ))}
      </ul>
      {moreSkills.length > 0 && (
        <>
          <div
            id={MORE_ID}
            className="skill-more"
            data-open={showAll}
            inert={!showAll}
            onTransitionEnd={onMoreTransitionEnd}
          >
            <ul className="skill-list skill-more-list" aria-label="More skills">
              {moreSkills.map((skill, index) => (
                <SkillRow
                  key={skill.name}
                  skill={skill}
                  delayIndex={index}
                  start={showAll && (reduceMotion || expanded)}
                />
              ))}
            </ul>
          </div>
          <Button
            design="Transparent"
            className="skills-toggle"
            data-testid="skills-toggle"
            accessibilityAttributes={{ expanded: showAll, controls: MORE_ID }}
            onClick={toggle}
          >
            {showAll ? 'Show less' : `Show all (${skillList.length})`}
          </Button>
        </>
      )}
    </div>
  )
}
