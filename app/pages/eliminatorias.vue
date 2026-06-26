<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto">

    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight">
        <span class="text-gold">Eliminatorias</span>
      </h1>
      <p class="text-slate-400 mt-1 text-sm">Bracket del torneo · Mundial 2026</p>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-xs text-slate-500">
      <div class="flex items-center gap-1.5">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        Clasificado
      </div>
      <div class="flex items-center gap-1.5">
        <span class="inline-block w-2 h-2 rounded-full bg-amber-500" />
        Grupo en progreso
      </div>
      <div class="flex items-center gap-1.5">
        <span class="inline-block w-2 h-2 rounded-full bg-slate-600" />
        Por definir
      </div>
    </div>

    <!-- Phase filter -->
    <div v-if="!pending && !error" class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="phase in resolvedPhases"
        :key="phase.round"
        class="px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors"
        :class="selectedRound === phase.round
          ? 'bg-gold/20 text-gold border-gold/50'
          : 'text-slate-400 border-border hover:text-slate-100 hover:border-border-light'"
        @click="selectedRound = phase.round"
      >
        {{ phase.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="i in 16" :key="i" class="h-28 bg-surface rounded-xl border border-border animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center">
      <p class="text-red-300 font-semibold">No se pudieron cargar los datos</p>
    </div>

    <!-- Bracket phases -->
    <div v-else class="space-y-10">
      <section v-for="phase in resolvedPhases" :key="phase.round" v-show="selectedRound === phase.round">
        <div class="flex items-center gap-3 mb-4">
          <h2 class="text-lg font-black text-slate-100">{{ phase.label }}</h2>
          <div class="flex-1 h-px bg-border" />
          <span class="text-xs text-slate-600">
            {{ phase.matches.length }} partido{{ phase.matches.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <div
          class="grid gap-3"
          :class="phase.matches.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 md:grid-cols-2'"
        >
          <article
            v-for="m in phase.matches"
            :key="m.num ?? m.date + m.team1"
            class="bg-surface border border-border rounded-xl overflow-hidden"
          >
            <!-- Card header -->
            <div class="px-4 py-2 bg-surface-raised flex items-center justify-between text-xs text-slate-500">
              <span>{{ m.num ? `Partido ${m.num}` : phase.label }}</span>
              <span class="truncate max-w-[150px] hidden sm:block">📍 {{ m.ground }}</span>
              <span class="font-medium">{{ formatDateShort(m.date) }}</span>
            </div>

            <!-- Teams + score -->
            <div class="px-4 py-4 flex items-center gap-2">

              <!-- Team 1 -->
              <div class="flex-1 flex flex-col items-center gap-1 text-center min-w-0">
                <span class="text-3xl leading-none select-none">{{ m.t1.flag || '🏳️' }}</span>
                <span
                  class="text-[11px] font-extrabold uppercase tracking-wider leading-tight w-full truncate"
                  :class="m.t1.resolved
                    ? (m.score && m.score.ft[0] > m.score.ft[1] ? 'text-gold' : 'text-slate-100')
                    : 'text-slate-500'"
                >
                  {{ m.t1.name }}
                </span>
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="m.t1.resolved ? 'bg-emerald-500' : m.t1.type === 'third' ? 'bg-slate-600' : 'bg-amber-500'"
                />
              </div>

              <!-- Score / VS -->
              <div class="shrink-0 flex flex-col items-center min-w-[72px]">
                <template v-if="m.score">
                  <div class="flex items-center gap-1.5">
                    <span
                      class="text-2xl font-black"
                      :class="m.score.ft[0] > m.score.ft[1] ? 'text-gold' : 'text-slate-300'"
                    >
                      {{ m.score.ft[0] }}
                    </span>
                    <span class="text-slate-600 text-base">—</span>
                    <span
                      class="text-2xl font-black"
                      :class="m.score.ft[1] > m.score.ft[0] ? 'text-gold' : 'text-slate-300'"
                    >
                      {{ m.score.ft[1] }}
                    </span>
                  </div>
                  <span class="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Final</span>
                </template>
                <template v-else>
                  <span class="text-lg font-black text-slate-600">vs</span>
                  <span class="text-[11px] font-bold text-gold mt-0.5">{{ getUTC6Time(m.time) }}h</span>
                  <span class="text-[9px] text-slate-600">UTC-6</span>
                </template>
              </div>

              <!-- Team 2 -->
              <div class="flex-1 flex flex-col items-center gap-1 text-center min-w-0">
                <span class="text-3xl leading-none select-none">{{ m.t2.flag || '🏳️' }}</span>
                <span
                  class="text-[11px] font-extrabold uppercase tracking-wider leading-tight w-full truncate"
                  :class="m.t2.resolved
                    ? (m.score && m.score.ft[1] > m.score.ft[0] ? 'text-gold' : 'text-slate-100')
                    : 'text-slate-500'"
                >
                  {{ m.t2.name }}
                </span>
                <span
                  class="w-1.5 h-1.5 rounded-full"
                  :class="m.t2.resolved ? 'bg-emerald-500' : m.t2.type === 'third' ? 'bg-slate-600' : 'bg-amber-500'"
                />
              </div>

            </div>
          </article>
        </div>
      </section>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Match } from '~/composables/useMatches'
import { FLAG_MAP } from '~/utils/flags'

useHead({ title: 'Eliminatorias — Mundial 2026' })

const { matches, allStandings, pending, error, getUTC6Time, formatDateShort } = useMatches()

const ROUND_LABELS: Record<string, string> = {
  'Round of 32': '16vos de Final',
  'Round of 16': 'Octavos de Final',
  'Quarterfinal': 'Cuartos de Final',
  'Quarterfinals': 'Cuartos de Final',
  'Quarter-final': 'Cuartos de Final',
  'Semifinal': 'Semifinales',
  'Semifinals': 'Semifinales',
  'Semi-final': 'Semifinales',
  'Final': 'Final',
}

interface ResolvedTeam {
  name: string
  flag: string
  resolved: boolean
  type: 'real' | 'group' | 'match' | 'third'
}

interface ResolvedMatch extends Match {
  t1: ResolvedTeam
  t2: ResolvedTeam
}

function isRealTeam(name: string): boolean {
  return name === 'USA' || /[a-z]/.test(name)
}

function isGroupComplete(group: string): boolean {
  const gm = matches.value.filter(m => m.group === group)
  return gm.length > 0 && gm.every(m => !!m.score)
}

function resolveTeam(raw: string): ResolvedTeam {
  if (isRealTeam(raw)) {
    return { name: raw, flag: FLAG_MAP[raw] ?? '', resolved: true, type: 'real' }
  }

  // Winner/Loser of a knockout match: W73, L74
  const matchRef = raw.match(/^([WL])(\d+)$/)
  if (matchRef) {
    const isWinner = matchRef[1] === 'W'
    const num = parseInt(matchRef[2])
    const ref = matches.value.find(m => m.num === num)
    if (ref?.score) {
      const [g1, g2] = ref.score.ft
      const team = isWinner ? (g1 >= g2 ? ref.team1 : ref.team2) : (g1 <= g2 ? ref.team1 : ref.team2)
      if (isRealTeam(team)) return { name: team, flag: FLAG_MAP[team] ?? '', resolved: true, type: 'match' }
      return resolveTeam(team)
    }
    return { name: `${isWinner ? 'Gan.' : 'Per.'} P${num}`, flag: '', resolved: false, type: 'match' }
  }

  // Single group position: 1A, 2B, 3C
  const gp = raw.match(/^([123])([A-L])$/)
  if (gp) {
    const pos = parseInt(gp[1]) - 1
    const group = gp[2]
    if (isGroupComplete(group)) {
      const standing = allStandings.value.find(s => s.group === group)
      const team = standing?.standings[pos]?.team
      if (team) return { name: team, flag: FLAG_MAP[team] ?? '', resolved: true, type: 'group' }
    }
    const posLabel = ['1°', '2°', '3°'][pos] ?? `${pos + 1}°`
    return { name: `${posLabel} Grupo ${group}`, flag: '', resolved: false, type: 'group' }
  }

  // Third-place combination: 3A/B/C/D/F
  if (/^3[A-L](\/[A-L])+$/.test(raw)) {
    const groups = raw.slice(1).split('/')
    return { name: `Mejor 3° (${groups.join('/')})`, flag: '', resolved: false, type: 'third' }
  }

  return { name: raw, flag: '', resolved: false, type: 'third' }
}

const resolvedPhases = computed(() => {
  const seen = new Set<string>()
  const order: string[] = []
  for (const m of matches.value) {
    if (!m.group && m.round && !seen.has(m.round)) {
      seen.add(m.round)
      order.push(m.round)
    }
  }
  return order.map(round => ({
    round,
    label: ROUND_LABELS[round] ?? round,
    matches: matches.value
      .filter(m => m.round === round)
      .map((m): ResolvedMatch => ({ ...m, t1: resolveTeam(m.team1), t2: resolveTeam(m.team2) })),
  }))
})

const selectedRound = ref('Round of 32')

watch(resolvedPhases, phases => {
  if (phases.length && !phases.find(p => p.round === selectedRound.value)) {
    selectedRound.value = phases[0].round
  }
}, { immediate: true })
</script>
