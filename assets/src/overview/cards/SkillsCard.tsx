import { Button, ProgressIndicator, Text } from '@ui5/webcomponents-react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'
import { useRef, useState, type CSSProperties } from 'react'
import { LEVEL_PERCENT, sortedSkills, VISIBLE_SKILLS } from '../../data/skills.ts'
import type { Skill } from '../../data/types.ts'
import { useCardEntered } from '../../motion/cardEntry.ts'
import { useBarFill } from '../../motion/useBarFill.ts'

const STAGGER_MS = 60
const skillList = sortedSkills()
const topSkills = skillList.slice(0, VISIBLE_SKILLS)
const moreSkills = skillList.slice(VISIBLE_SKILLS)
const LIST_ID = 'skill-list'

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
    <>
      <Text className="skill-name">{skill.name}</Text>
      <ProgressIndicator
        className="skill-bar"
        style={delay}
        value={filled ? LEVEL_PERCENT[skill.level] : 0}
        displayValue={skill.level}
        accessibleName={`${skill.name}: ${skill.level}`}
        data-level={skill.level}
      />
    </>
  )
}

/** Extra row that fills its bar once it has finished expanding (AC-03.9) */
function ExpandingSkillRow({ skill, delayIndex }: { skill: Skill; delayIndex: number }) {
  const reduceMotion = useReducedMotion() ?? false
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.li
      className="skill"
      data-skill={skill.name}
      initial={reduceMotion ? false : { height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onAnimationComplete={() => setExpanded(true)}
    >
      <SkillRow skill={skill} delayIndex={delayIndex} start={expanded} />
    </motion.li>
  )
}

export function SkillsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const listRef = useRef<HTMLUListElement>(null)
  const entered = useCardEntered()
  const inView = useInView(listRef, { once: true, amount: 0.3 })
  const [showAll, setShowAll] = useState(false)
  // Start only when visitors can actually see the bars (AC-03.6)
  const start = entered && inView

  return (
    <div className={`skills${reduceMotion ? ' no-bar-animation' : ''}`}>
      <ul ref={listRef} id={LIST_ID} className="skill-list" aria-label="Skills by level">
        {topSkills.map((skill, index) => (
          <li key={skill.name} className="skill" data-skill={skill.name}>
            <SkillRow skill={skill} delayIndex={index} start={start} />
          </li>
        ))}
        <AnimatePresence initial={false}>
          {showAll &&
            moreSkills.map((skill, index) => (
              <ExpandingSkillRow key={skill.name} skill={skill} delayIndex={index} />
            ))}
        </AnimatePresence>
      </ul>
      {moreSkills.length > 0 && (
        <Button
          design="Transparent"
          className="skills-toggle"
          data-testid="skills-toggle"
          accessibilityAttributes={{ expanded: showAll, controls: LIST_ID }}
          onClick={() => setShowAll((value) => !value)}
        >
          {showAll ? 'Show less' : `Show all (${skillList.length})`}
        </Button>
      )}
    </div>
  )
}
