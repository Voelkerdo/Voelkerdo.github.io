// Pure parsing for the Transport Log; vite.config.ts feeds it git and spec data (TD-16)
import type { BuildStats, Transport } from './types.ts'

/** One commit as printed by `git log --reverse --format=%ad%x09%s --date=short` */
export interface CommitLine {
  date: string
  subject: string
}

const CR_SPEC = /^docs\(cr-(\d+)\): (.+)$/

export function parseCommits(log: string): CommitLine[] {
  return log
    .split('\n')
    .filter((line) => line.includes('\t'))
    .map((line) => {
      const [date, ...subject] = line.split('\t')
      return { date, subject: subject.join('\t') }
    })
}

/** DVK900001 is the initial release, CR-N is DVK9000(N+1) (AC-02.7) */
export function transportNumber(cr: number | undefined): string {
  return `DVK9${String((cr ?? 0) + 1).padStart(5, '0')}`
}

/** "add theme time travel … [REQ-11, D-15]" → "Add theme time travel …" */
function describe(text: string): string {
  const plain = text.replace(/\s*\[[^\]]*\]\s*$/, '').trim()
  return plain.charAt(0).toUpperCase() + plain.slice(1)
}

/** IDs a commit uses for a CR: "CR-N" plus the decisions (D-/TD-) of its spec commit */
function crIds(cr: number, specText: string): string[] {
  const refs = /\[([^\]]*)\]\s*$/.exec(specText)?.[1].split(',') ?? []
  return [`CR-${cr}`, ...refs.map((ref) => ref.trim()).filter((ref) => /^T?D-\d+$/.test(ref))]
}

/**
 * Newest first. A CR is imported once a later feat/fix commit names it or one of its decisions;
 * early implementation commits only name the decision (AC-02.7).
 */
export function buildTransports(commits: CommitLine[]): Transport[] {
  if (commits.length === 0) return []
  const importedAfter = (index: number, ids: string[]) =>
    commits
      .slice(index + 1)
      .some(
        ({ subject }) =>
          /^(feat|fix)\(/.test(subject) &&
          ids.some((id) => new RegExp(`\\b${id}(?!\\d)`).test(subject)),
      )
  const seen = new Set<number>()
  const changes: Transport[] = []
  commits.forEach(({ date, subject }, index) => {
    const match = CR_SPEC.exec(subject)
    if (!match) return
    const cr = Number(match[1])
    if (seen.has(cr)) return
    seen.add(cr)
    changes.push({
      number: transportNumber(cr),
      cr,
      text: `CR-${cr} ${describe(match[2])}`,
      date,
      status: importedAfter(index, crIds(cr, match[2])) ? 'Imported' : 'Released',
    })
  })
  const initial: Transport = {
    number: transportNumber(undefined),
    text: 'Initial release',
    date: commits[0].date,
    status: 'Imported',
  }
  return [...changes.sort((a, b) => b.cr! - a.cr!), initial]
}

/** Done tasks in the overview table of specs/03-tasks.md */
export function countDoneTasks(tasksSpec: string): number {
  return tasksSpec.split('\n').filter((line) => /^\| T-\d+ \|.*\| \[x\] \|$/.test(line)).length
}

/** Test cases defined in the test sources (`it(` / `test(`) */
export function countTests(sources: string[]): number {
  return sources.reduce((sum, source) => sum + (source.match(/^\s*(it|test)\(/gm)?.length ?? 0), 0)
}

export function buildStats(
  transports: Transport[],
  tasksSpec: string,
  testSources: string[],
  commits: number,
): BuildStats {
  return {
    changeRequests: transports.filter((t) => t.cr !== undefined).length,
    tasks: countDoneTasks(tasksSpec),
    tests: countTests(testSources),
    commits,
  }
}
