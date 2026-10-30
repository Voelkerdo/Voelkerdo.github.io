import type { Profile } from './types.ts'

const githubUsername = 'Voelkerdo'

export const profile: Profile = {
  name: 'Dominik Völker',
  // TODO(content): sharpen positioning (see specs/00-intent.md)
  tagline: 'Fullstack Developer – from ABAP to UI5',
  githubUsername,
  githubUrl: `https://github.com/${githubUsername}`,
  // TODO(content): add avatar image
  avatarUrl: undefined,
  // TODO(content): confirm repository name once this site is pushed to GitHub
  siteRepoUrl: `https://github.com/${githubUsername}/portfolio-website`,
}
