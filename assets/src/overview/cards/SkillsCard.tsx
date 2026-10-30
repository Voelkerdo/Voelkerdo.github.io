import { Label, Tag } from '@ui5/webcomponents-react'
import { skillGroups } from '../../data/skills.ts'

export function SkillsCard() {
  return (
    <div className="skills-groups">
      {skillGroups.map((group) => (
        <section key={group.id} className="skill-group" data-skill-group={group.id}>
          <Label id={`skill-group-${group.id}`} className="skill-group-title" showColon={false}>
            {group.title}
          </Label>
          <ul className="skill-tags" aria-labelledby={`skill-group-${group.id}`}>
            {group.skills.map((skill) => (
              <li key={skill}>
                <Tag design="Neutral" size="S" hideStateIcon>
                  {skill}
                </Tag>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
