import type { SkillGroup } from './types.ts'

export const skillGroups: SkillGroup[] = [
  { id: 'backend', title: 'Backend', skills: ['ABAP', 'Node.js'] },
  { id: 'frontend', title: 'Frontend', skills: ['SAP UI5', 'JavaScript', 'HTML5'] },
  {
    id: 'frameworks',
    title: 'Frameworks',
    skills: [
      'SAP UI5',
      'ABAP RAP',
      'ABAP Programming Model for Fiori',
      'SAP OData (SEGW)',
      'SAP Adobe Forms',
    ],
  },
  { id: 'sap', title: 'Further SAP Experience', skills: ['User & Authorization Management'] },
]
