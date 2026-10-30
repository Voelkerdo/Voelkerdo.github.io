import { ProgressIndicator, Text } from '@ui5/webcomponents-react'
import { useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { LEVEL_PERCENT, sortedSkills } from '../../data/skills.ts'
import { useBarFill } from '../../motion/useBarFill.ts'

const STAGGER_MS = 60
const skillList = sortedSkills()

export function SkillsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const filled = useBarFill(reduceMotion)

  return (
    <ul
      className={`skill-list${reduceMotion ? ' no-bar-animation' : ''}`}
      aria-label="Skills by level"
    >
      {skillList.map((skill, index) => {
        const delay = { '--bar-delay': `${index * STAGGER_MS}ms` } as CSSProperties
        return (
          <li key={skill.name} className="skill" data-skill={skill.name}>
            <Text className="skill-name">{skill.name}</Text>
            <ProgressIndicator
              className="skill-bar"
              style={delay}
              value={filled ? LEVEL_PERCENT[skill.level] : 0}
              displayValue={skill.level}
              accessibleName={`${skill.name}: ${skill.level}`}
              data-level={skill.level}
            />
          </li>
        )
      })}
    </ul>
  )
}
