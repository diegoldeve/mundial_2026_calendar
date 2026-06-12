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

  // Teams: filter out knockout placeholders (W73, L101, 1A, 2B, etc.)
  const allTeams = computed(() => {
    const names = new Set<string>()
    for (const m of matches.value) {
      if (isRealTeam(m.team1)) names.add(m.team1)
      if (isRealTeam(m.team2)) names.add(m.team2)
    }
    return [...names].sort((a, b) => a.localeCompare(b, 'es'))
  })

  function isRealTeam(name: string): boolean {
    return name === 'USA' || /[a-z]/.test(name)
  }

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

  function getFlag(team: string): string {
    return FLAG_MAP[team] ?? ''
  }

  function getMatchTime(timeStr: string): string {
    return timeStr.split(' ')[0]
  }

  function getTimezone(timeStr: string): string {
    return timeStr.match(/(UTC[+-]?\d+)/)?.[1] ?? 'UTC'
  }

  function getUTC6Time(timeStr: string): string {
    return convertToUTC6(timeStr)
  }

  function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  function formatDateShort(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
    })
  }

  function isPast(dateStr: string): boolean {
    return dateStr < todayStr
  }

  return {
    data,
    matches,
    pending,
    error,
    todayStr,
    todayMatches,
    allDates,
    allTeams,
    matchesByDate,
    matchesForDate,
    matchesForTeams,
    getFlag,
    getMatchTime,
    getTimezone,
    getUTC6Time,
    formatDate,
    formatDateShort,
    isPast,
  }
}
