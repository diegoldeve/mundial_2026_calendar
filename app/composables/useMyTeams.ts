const STORAGE_KEY = 'mundial2026-my-teams'
let _loaded = false

export function useMyTeams() {
  const myTeams = useState<string[]>('my-teams', () => [])

  // Load from localStorage once per client session
  if (import.meta.client && !_loaded) {
    _loaded = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) myTeams.value = JSON.parse(stored) as string[]
    } catch {}
  }

  function toggleTeam(team: string) {
    if (myTeams.value.includes(team)) {
      myTeams.value = myTeams.value.filter(t => t !== team)
    } else {
      myTeams.value = [...myTeams.value, team]
    }
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myTeams.value))
    }
  }

  function isSelected(team: string): boolean {
    return myTeams.value.includes(team)
  }

  function clearAll() {
    myTeams.value = []
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  return { myTeams, toggleTeam, isSelected, clearAll }
}
