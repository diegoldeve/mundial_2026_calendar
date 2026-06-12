<template>
  <div class="p-4 md:p-8 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight">
        <span class="text-gold">Estadísticas</span>
      </h1>
      <p class="text-slate-400 mt-1 text-sm">Mundial 2026 · Se actualiza con cada partido</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div class="h-52 bg-surface rounded-xl border border-border animate-pulse" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="h-48 bg-surface rounded-xl border border-border animate-pulse" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center">
      <p class="text-red-300 font-semibold">No se pudieron cargar los datos</p>
    </div>

    <template v-else>
      <!-- Empty state -->
      <div v-if="topScorers.length === 0 && teamGoalStats.length === 0" class="py-20 text-center">
        <div class="text-6xl mb-4 select-none">📊</div>
        <p class="text-lg font-semibold text-slate-300">Aún no hay partidos jugados</p>
        <p class="text-slate-500 text-sm mt-1">Las estadísticas aparecerán cuando inicien los partidos.</p>
      </div>

      <template v-else>
        <!-- Top 5 Goleadores -->
        <section class="bg-surface border border-border rounded-xl overflow-hidden mb-6">
          <div class="px-5 py-3 bg-surface-raised flex items-center gap-2">
            <span class="text-lg">⚽</span>
            <h2 class="font-bold text-slate-100">Top 5 Goleadores</h2>
          </div>
          <div v-if="topScorers.length === 0" class="px-5 py-8 text-center text-slate-500 text-sm">
            Sin goles registrados aún
          </div>
          <div v-else class="divide-y divide-border">
            <div
              v-for="(scorer, idx) in topScorers"
              :key="scorer.name"
              class="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-raised transition-colors"
            >
              <!-- Position medal -->
              <span class="text-lg leading-none w-6 text-center select-none">
                {{ idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.` }}
              </span>

              <!-- Player info -->
              <div class="flex-1 min-w-0">
                <p class="font-bold text-slate-100 truncate">{{ scorer.name }}</p>
                <p class="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <span>{{ getFlag(scorer.team) }}</span>
                  <span>{{ scorer.team }}</span>
                </p>
              </div>

              <!-- Goal dots + count -->
              <div class="flex items-center gap-2 shrink-0">
                <div class="flex gap-0.5">
                  <span
                    v-for="i in scorer.goals"
                    :key="i"
                    class="text-xs leading-none"
                  >⚽</span>
                </div>
                <span class="text-xl font-black text-gold w-5 text-right">{{ scorer.goals }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Team stats grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Más goleadores -->
          <TeamStatCard
            title="Más goleadores"
            icon="🔥"
            :teams="mostScoring"
            stat-key="gf"
            stat-label="goles"
            bar-color="bg-gold"
          />

          <!-- Menos goleadores -->
          <TeamStatCard
            title="Menos goleadores"
            icon="😶"
            :teams="leastScoring"
            stat-key="gf"
            stat-label="goles"
            bar-color="bg-slate-500"
          />

          <!-- Más goleados -->
          <TeamStatCard
            title="Más goleados"
            icon="😬"
            :teams="mostConceding"
            stat-key="ga"
            stat-label="en contra"
            bar-color="bg-red-500"
          />

          <!-- Menos goleados -->
          <TeamStatCard
            title="Menos goleados"
            icon="🛡️"
            :teams="leastConceding"
            stat-key="ga"
            stat-label="en contra"
            bar-color="bg-emerald-500"
          />
        </div>

        <!-- Summary numbers -->
        <div class="mt-6 grid grid-cols-3 gap-3">
          <div class="bg-surface border border-border rounded-xl p-4 text-center">
            <p class="text-3xl font-black text-gold">{{ totalGoals }}</p>
            <p class="text-xs text-slate-500 mt-1">Goles totales</p>
          </div>
          <div class="bg-surface border border-border rounded-xl p-4 text-center">
            <p class="text-3xl font-black text-slate-100">{{ matchesPlayed }}</p>
            <p class="text-xs text-slate-500 mt-1">Partidos jugados</p>
          </div>
          <div class="bg-surface border border-border rounded-xl p-4 text-center">
            <p class="text-3xl font-black text-slate-100">{{ goalsPerMatch }}</p>
            <p class="text-xs text-slate-500 mt-1">Goles por partido</p>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Estadísticas — Mundial 2026' })

const { topScorers, teamGoalStats, pending, error, getFlag, matches } = useMatches()

const played = computed(() => teamGoalStats.value.filter(t => t.mp > 0))

const mostScoring  = computed(() => [...played.value].sort((a, b) => b.gf - a.gf || a.team.localeCompare(b.team)).slice(0, 5))
const leastScoring = computed(() => [...played.value].sort((a, b) => a.gf - b.gf || a.team.localeCompare(b.team)).slice(0, 5))
const mostConceding  = computed(() => [...played.value].sort((a, b) => b.ga - a.ga || a.team.localeCompare(b.team)).slice(0, 5))
const leastConceding = computed(() => [...played.value].sort((a, b) => a.ga - b.ga || a.team.localeCompare(b.team)).slice(0, 5))

const matchesPlayed = computed(() => matches.value.filter(m => m.score).length)
const totalGoals    = computed(() => matches.value.reduce((sum, m) => sum + (m.score ? m.score.ft[0] + m.score.ft[1] : 0), 0))
const goalsPerMatch = computed(() => matchesPlayed.value ? (totalGoals.value / matchesPlayed.value).toFixed(2) : '0.00')
</script>
