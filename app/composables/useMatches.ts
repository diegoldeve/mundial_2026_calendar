import { FLAG_MAP } from '~/utils/flags'
import { convertToUTC6 } from '~/utils/time'

export interface Score {
  ft: [number, number]
  ht?: [number, number]
}

export interface Goal {
  name: string
  minute: string
}

export interface Match {
  round: string
  num?: number
  date: string
  time: string
  team1: string
  team2: string
  score?: Score
  goals1?: Goal[]
  goals2?: Goal[]
  group?: string
  ground: string
}

export interface WorldCupData {
  name: string
  matches: Match[]
}

export interface TeamStanding {
  team: string
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export interface GroupStanding {
  group: string
  standings: TeamStanding[]
}

const DATA_URL = 'https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json'
let _fetchStarted = false

export function useMatches() {
  const data = useState<WorldCupData | null>('worldcup-data', () => null)
  const pending = useState<boolean>('worldcup-pending', () => true)
  const error = useState<Error | null>('worldcup-error', () => null)

  if (import.meta.client && !data.value && !error.value && !_fetchStarted) {
    _fetchStarted = true
    fetch(DATA_URL)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<WorldCupData>
      })
      .then(d => { data.value = d })
      .catch(e => { error.value = e as Error })
      .finally(() => { pending.value = false })
  }

  const matches = computed(() => data.value?.matches ?? [])

  function getTodayStr(): string {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  const todayStr = getTodayStr()

  // ── Standings ──────────────────────────────────────────────

  function groupStandings(groupName: string): TeamStanding[] {
    const groupMatches = matches.value.filter(m => m.group === groupName)
    const map = new Map<string, TeamStanding>()

    // Initialize all teams (including those with no results yet)
    for (const m of groupMatches) {
      if (!map.has(m.team1)) map.set(m.team1, { team: m.team1, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
      if (!map.has(m.team2)) map.set(m.team2, { team: m.team2, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 })
    }

    // Accumulate stats from completed matches
    for (const m of groupMatches) {
      if (!m.score) continue
      const [g1, g2] = m.score.ft
      const t1 = map.get(m.team1)!
      const t2 = map.get(m.team2)!

      t1.mp++; t2.mp++
      t1.gf += g1; t1.ga += g2
      t2.gf += g2; t2.ga += g1

      if (g1 > g2) { t1.w++; t1.pts += 3; t2.l++ }
      else if (g2 > g1) { t2.w++; t2.pts += 3; t1.l++ }
      else { t1.d++; t1.pts++; t2.d++; t2.pts++ }
    }

    for (const s of map.values()) s.gd = s.gf - s.ga

    return [...map.values()].sort((a, b) =>
      b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team, 'es'),
    )
  }

  const allGroups = computed(() => {
    const set = new Set<string>()
    for (const m of matches.value) {
      if (m.group) set.add(m.group)
    }
    return [...set].sort()
  })

  const allStandings = computed<GroupStanding[]>(() =>
    allGroups.value.map(group => ({ group, standings: groupStandings(group) })),
  )

  // ── Teams ──────────────────────────────────────────────────

  function isRealTeam(name: string): boolean {
    return name === 'USA' || /[a-z]/.test(name)
  }

  const allTeams = computed(() => {
    const names = new Set<string>()
    for (const m of matches.value) {
      if (isRealTeam(m.team1)) names.add(m.team1)
      if (isRealTeam(m.team2)) names.add(m.team2)
    }
    return [...names].sort((a, b) => a.localeCompare(b, 'es'))
  })

  // ── Filters ────────────────────────────────────────────────

  function matchesForDate(dateStr: string): Match[] {
    return matches.value.filter(m => m.date === dateStr)
  }

  function matchesForTeams(teams: string[]): Match[] {
    if (!teams.length) return []
    const set = new Set(teams)
    return matches.value.filter(m => set.has(m.team1) || set.has(m.team2))
  }

  const todayMatches = computed(() => matchesForDate(todayStr))

  const allDates = computed(() => {
    const set = new Set(matches.value.map(m => m.date))
    return [...set].sort()
  })

  const matchesByDate = computed(() => {
    const map: Record<string, Match[]> = {}
    for (const m of matches.value) {
      ;(map[m.date] ??= []).push(m)
    }
    return map
  })

  // ── Helpers ────────────────────────────────────────────────

  function getFlag(team: string): string { return FLAG_MAP[team] ?? '' }
  function getMatchTime(timeStr: string): string { return timeStr.split(' ')[0] }
  function getTimezone(timeStr: string): string { return timeStr.match(/(UTC[+-]?\d+)/)?.[1] ?? 'UTC' }
  function getUTC6Time(timeStr: string): string { return convertToUTC6(timeStr) }

  function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  function formatDateShort(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })
  }

  function isPast(dateStr: string): boolean { return dateStr < todayStr }

  return {
    data, matches, pending, error,
    todayStr, todayMatches,
    allDates, matchesByDate, matchesForDate, matchesForTeams,
    allTeams, allGroups, allStandings,
    getFlag, getMatchTime, getTimezone, getUTC6Time,
    formatDate, formatDateShort, isPast,
  }
}
