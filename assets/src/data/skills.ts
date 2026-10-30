import type { Skill, SkillLevel } from './types.ts'

/** Bar length per level (AC-03.5) */
export const LEVEL_PERCENT: Record<SkillLevel, number> = {
  Expert: 100,
  Advanced: 75,
  Intermediate: 50,
  Familiar: 25,
}

// All skills from the intent, each once, with the levels provided by Dominik (AC-03.2, AC-03.7)
export const skills: Skill[] = [
  { name: 'ABAP', level: 'Advanced' },
  { name: 'Node.js', level: 'Intermediate' },
  { name: 'SAP UI5', level: 'Familiar' },
  { name: 'JavaScript', level: 'Familiar' },
  { name: 'HTML5', level: 'Advanced' },
  { name: 'ABAP RAP', level: 'Intermediate' },
  { name: 'ABAP Programming Model for Fiori', level: 'Advanced' },
  { name: 'SAP OData (SEGW)', level: 'Expert' },
  { name: 'SAP Adobe Forms', level: 'Expert' },
  { name: 'User & Authorization Management', level: 'Advanced' },
]

/** Highest level first; skills with the same level keep their order from the list above (AC-03.8). */
export function sortedSkills(list: Skill[] = skills): Skill[] {
  return [...list].sort((a, b) => LEVEL_PERCENT[b.level] - LEVEL_PERCENT[a.level])
}
