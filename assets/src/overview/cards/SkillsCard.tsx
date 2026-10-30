import { Label, ProgressIndicator, Text } from '@ui5/webcomponents-react'
import { useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { LEVEL_PERCENT, skillGroups } from '../../data/skills.ts'
import { useBarFill } from '../../motion/useBarFill.ts'

const STAGGER_MS = 60

export function SkillsCard() {
  const reduceMotion = useReducedMotion() ?? false
  const filled = useBarFill(reduceMotion)
  let index = 0

  return (
    <div className={`skills-groups${reduceMotion ? ' no-bar-animation' : ''}`}>
      {skillGroups.map((group) => (
        <section key={group.id} className="skill-group" data-skill-group={group.id}>
          <Label id={`skill-group-${group.id}`} className="skill-group-title" showColon={false}>
            {group.title}
          </Label>
          <ul className="skill-list" aria-labelledby={`skill-group-${group.id}`}>
            {group.skills.map((skill) => {
              const delay = { '--bar-delay': `${index++ * STAGGER_MS}ms` } as CSSProperties
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
        </section>
      ))}
    </div>
  )
}
