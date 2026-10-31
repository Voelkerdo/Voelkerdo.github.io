import type { Profile } from './types.ts'

const githubUsername = 'Voelkerdo'

export const profile: Profile = {
  name: 'Dominik Völker',
  tagline: 'Fullstack Developer – ABAP, RAP, Linux & UI5',
  currentlyBuilding: 'this portfolio – spec-driven with React & SAP UI5',
  githubUsername,
  githubUrl: `https://github.com/${githubUsername}`,
  // Initials instead of a photo, re-colored by every theme (T-31)
  avatarUrl: undefined,
  siteRepoUrl: `https://github.com/${githubUsername}/${githubUsername}.github.io`,
}
