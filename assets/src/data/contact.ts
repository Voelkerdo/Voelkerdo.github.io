import type { ContactChannel } from './types.ts'
import { profile } from './profile.ts'

export const contactChannels: ContactChannel[] = [
  { id: 'github', label: 'GitHub', url: profile.githubUrl, icon: 'source-code', primary: true },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/dominik-v%C3%B6lker-01714422b',
    icon: 'business-card',
    // The profile URL is too long for the card column
    description: profile.name,
  },
]
