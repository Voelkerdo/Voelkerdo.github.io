import type { SkillGroup, SkillLevel } from './types.ts'

/** Bar length per level (AC-03.5) */
export const LEVEL_PERCENT: Record<SkillLevel, number> = {
  Expert: 100,
  Advanced: 75,
  Intermediate: 50,
  Familiar: 25,
}

// Levels as provided by Dominik (AC-03.7)
export const skillGroups: SkillGroup[] = [
  {
    id: 'backend',
    title: 'Backend',
    skills: [
      { name: 'ABAP', level: 'Advanced' },
      { name: 'Node.js', level: 'Intermediate' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    skills: [
      { name: 'SAP UI5', level: 'Familiar' },
      { name: 'JavaScript', level: 'Familiar' },
      { name: 'HTML5', level: 'Advanced' },
    ],
  },
  {
    id: 'frameworks',
    title: 'Frameworks',
    skills: [
      { name: 'SAP UI5', level: 'Familiar' },
      { name: 'ABAP RAP', level: 'Intermediate' },
      { name: 'ABAP Programming Model for Fiori', level: 'Advanced' },
      { name: 'SAP OData (SEGW)', level: 'Expert' },
      { name: 'SAP Adobe Forms', level: 'Expert' },
    ],
  },
  {
    id: 'sap',
    title: 'Further SAP Experience',
    skills: [{ name: 'User & Authorization Management', level: 'Advanced' }],
  },
]
