import type { ContactChannel } from './types.ts'
import { profile } from './profile.ts'

export const contactChannels: ContactChannel[] = [
  { id: 'github', label: 'GitHub', url: profile.githubUrl, icon: 'source-code', primary: true },
  // TODO(content): add real LinkedIn profile URL (D-4)
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'business-card' },
]
