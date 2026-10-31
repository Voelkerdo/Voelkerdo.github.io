import { describe, expect, it } from 'vitest'
import {
  buildStats,
  buildTransports,
  countDoneTasks,
  countTests,
  parseCommits,
  transportNumber,
} from '../../src/data/transportLog.ts'
import { buildStats as realStats, transports as realTransports } from '../../src/data/transports.ts'

// Oldest first, as printed by `git log --reverse --format=%ad%x09%s --date=short`
const LOG = [
  '2026-10-30\tdocs(intent): add initial intent',
  '2026-10-30\tdocs(cr-1): switch from tiles to cards [D-7, D-8]',
  '2026-10-30\tfeat(T-15): rebuild shell [REQ-01, CR-1]',
  '2026-10-31\tdocs(cr-2): remove hero [D-9]',
  '2026-10-31\tdocs(cr-10): fit the page [D-17]',
  '2026-10-31\tfix(T-33): keep the edge clean [AC-04.3, CR-10]',
].join('\n')

describe('transport log', () => {
  it('AC-02.7 numbers: DVK900001 is the initial release, CR-N is DVK9000(N+1)', () => {
    expect(transportNumber(undefined)).toBe('DVK900001')
    expect(transportNumber(1)).toBe('DVK900002')
    expect(transportNumber(13)).toBe('DVK900014')
  })

  it('AC-02.7 builds transports newest first with text, date and status', () => {
    expect(buildTransports(parseCommits(LOG))).toEqual([
      {
        number: 'DVK900011',
        cr: 10,
        text: 'CR-10 Fit the page',
        date: '2026-10-31',
        status: 'Imported',
      },
      {
        number: 'DVK900003',
        cr: 2,
        text: 'CR-2 Remove hero',
        date: '2026-10-31',
        // Implemented by no later commit naming CR-2 or D-9
        status: 'Released',
      },
      {
        number: 'DVK900002',
        cr: 1,
        text: 'CR-1 Switch from tiles to cards',
        date: '2026-10-30',
        status: 'Imported',
      },
      { number: 'DVK900001', text: 'Initial release', date: '2026-10-30', status: 'Imported' },
    ])
  })

  it('AC-02.7 a commit naming CR-10 does not import CR-1', () => {
    const log = '2026-10-30\tdocs(cr-1): one\n2026-10-31\tfeat(T-1): two [CR-10]'
    expect(buildTransports(parseCommits(log))[0].status).toBe('Released')
  })

  it('AC-02.7 a later commit naming a decision of the CR imports it, REQ IDs do not', () => {
    const log = [
      '2026-10-30\tfeat(T-9): earlier work [D-9]',
      '2026-10-30\tdocs(cr-2): remove hero [REQ-01, D-9]',
      '2026-10-30\tfeat(T-10): unrelated [REQ-01]',
    ].join('\n')
    expect(buildTransports(parseCommits(log))[0].status).toBe('Released')
    const implemented = `${log}\n2026-10-31\tfeat(T-21): add profile card [REQ-01, D-9]`
    expect(buildTransports(parseCommits(implemented))[0].status).toBe('Imported')
  })

  it('AC-02.7 without git there are no transports', () => {
    expect(buildTransports(parseCommits(''))).toEqual([])
  })

  it('AC-02.8 counts done tasks and defined test cases', () => {
    const tasks = [
      '| T-01 | Setup | TD-1 | [x] |',
      '| T-02 | Tests | TD-2 | [~] |',
      '| ~~T-06~~ | ~~Tile~~ | entfällt | – |',
      '| T-03 | Data | AC-01.3 | [x] |',
    ].join('\n')
    expect(countDoneTasks(tasks)).toBe(2)
    const tests =
      "describe('x', () => {\n  it('a', () => {})\n  test('b', async () => {})\n  test.describe('c', () => {})\n})"
    expect(countTests([tests, tests])).toBe(4)
    expect(buildStats(buildTransports(parseCommits(LOG)), tasks, [tests], 42)).toEqual({
      changeRequests: 3,
      tasks: 2,
      tests: 2,
      commits: 42,
    })
  })

  it('AC-02.7 / AC-02.8 the real data starts with DVK900001 and has at least 13 CRs', () => {
    expect(realTransports.at(-1)).toMatchObject({ number: 'DVK900001', text: 'Initial release' })
    // CR-1 to CR-12 are implemented; CR-2's implementation only names D-9
    expect(realTransports.filter((t) => t.cr && t.cr <= 12).map((t) => t.status)).toEqual(
      Array(12).fill('Imported'),
    )
    expect(realTransports[0].cr).toBeGreaterThanOrEqual(13)
    expect(realStats.changeRequests).toBeGreaterThanOrEqual(13)
    expect(realStats.tasks).toBeGreaterThan(20)
    expect(realStats.tests).toBeGreaterThan(100)
    expect(realStats.commits).toBeGreaterThan(50)
  })
})
