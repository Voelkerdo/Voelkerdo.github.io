import { describe, expect, it } from 'vitest'
import { notifications } from '../../src/data/notifications.ts'

describe('notifications', () => {
  it('AC-10.2 contains the three notifications in order with title, text and time', () => {
    expect(notifications.map(({ title, text, time }) => ({ title, text, time }))).toEqual([
      {
        title: 'Transport imported',
        text: 'Transport DVK900001 "Portfolio Website" was imported successfully into production.',
        time: 'Just now',
      },
      {
        title: 'Quality gate passed',
        text: 'npm run verify: all tests green – built spec-driven.',
        time: '2 min ago',
      },
      {
        title: 'New follower request',
        text: "You're not following Voelkerdo on GitHub yet. Fix that?",
        time: 'Today',
      },
    ])
  })

  it('AC-10.2 / AC-10.4 only the follower request is important and links to GitHub', () => {
    expect(notifications.filter((n) => n.importance === 'High').map((n) => n.id)).toEqual([
      'follower',
    ])
    expect(notifications.filter((n) => n.href).map((n) => [n.id, n.href])).toEqual([
      ['follower', 'https://github.com/Voelkerdo'],
    ])
  })
})
