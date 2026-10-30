import { profile } from './profile.ts'
import type { NotificationDef } from './types.ts'

// Tongue-in-cheek Fiori notifications for the SAP community (AC-10.2)
export const notifications: NotificationDef[] = [
  {
    id: 'transport',
    title: 'Transport imported',
    text: 'Transport DVK900001 "Portfolio Website" was imported successfully into production.',
    time: 'Just now',
  },
  {
    id: 'quality-gate',
    title: 'Quality gate passed',
    text: 'npm run verify: all tests green – built spec-driven.',
    time: '2 min ago',
  },
  {
    id: 'follower',
    title: 'New follower request',
    text: `You're not following ${profile.githubUsername} on GitHub yet. Fix that?`,
    time: 'Today',
    importance: 'High',
    href: profile.githubUrl,
  },
]
