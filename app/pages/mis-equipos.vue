<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight">
        Mis <span class="text-gold">Equipos</span>
      </h1>
      <p class="text-slate-400 mt-1 text-sm">
        Selecciona las selecciones que quieres seguir
      </p>
    </div>

    <!-- Team selector -->
    <div class="bg-surface rounded-xl border border-border p-5 mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Selecciones disponibles
        </h2>
        <div class="flex items-center gap-3">
          <span v-if="myTeams.length" class="text-xs text-gold font-bold">
            {{ myTeams.length }} seguido{{ myTeams.length !== 1 ? 's' : '' }}
          </span>
          <button
            v-if="myTeams.length"
            class="text-[11px] text-slate-500 hover:text-red-400 transition-colors underline"
            @click="clearAll"
          >
            Limpiar todo
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="flex flex-wrap gap-2">
        <div v-for="i in 16" :key="i" class="h-8 w-24 bg-surface-raised rounded-full animate-pulse" />
      </div>

      <!-- All teams -->
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="team in allTeams"
          :key="team"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
            isSelected(team)
              ? 'bg-gold/15 text-gold border-gold/50'
              : 'bg-surface-raised text-slate-400 border-border hover:border-slate-500 hover:text-slate-200',
          ]"
          @click="onToggleTeam(team)"
        >
          <span class="text-sm leading-none">{{ getFlag(team) || '🏳️' }}</span>
          <span>{{ team }}</span>
          <span v-if="isSelected(team)" class="text-[10px]">✓</span>
        </button>
      </div>
    </div>

    <!-- Matches section -->
    <div>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-base font-black text-slate-100">Partidos de tus equipos</h2>
        <span v-if="activeTeam && activeMatches.length" class="text-xs text-slate-600">
          {{ activeMatches.length }} partido{{ activeMatches.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- No teams followed yet -->
      <div v-if="myTeams.length === 0" class="py-14 text-center">
        <div class="text-5xl mb-3 select-none">⭐</div>
        <p class="text-slate-400 font-semibold">Aún no sigues ningún equipo</p>
        <p class="text-slate-600 text-sm mt-1">Selecciona alguno arriba para verlo aquí.</p>
      </div>

      <template v-else>
        <!-- Followed teams as filter chips -->
        <div class="flex flex-wrap gap-2 mb-6">
          <button
            v-for="team in myTeams"
            :key="team"
            :class="[
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all duration-150',
              activeTeam === team
                ? 'bg-gold text-black border-gold shadow-md shadow-gold/20 scale-105'
                : 'bg-surface text-slate-300 border-border hover:border-border-light hover:text-slate-100',
            ]"
            @click="setActive(team)"
          >
            <span class="text-base leading-none">{{ getFlag(team) || '🏳️' }}</span>
            <span>{{ team }}</span>
          </button>
        </div>

        <!-- Prompt: no team selected yet -->
        <div v-if="!activeTeam" class="py-12 text-center">
          <div class="text-4xl mb-3 select-none">👆</div>
          <p class="text-slate-400 font-semibold">Selecciona un equipo arriba</p>
          <p class="text-slate-600 text-sm mt-1">para ver sus partidos.</p>
        </div>

        <!-- Matches for active team -->
        <template v-else>
          <div v-if="activeMatches.length === 0" class="py-10 text-center">
            <p class="text-slate-500 text-sm">No hay partidos para {{ activeTeam }}</p>
          </div>

          <div v-else class="space-y-4">
            <template v-for="(group, date) in activeMatchesByDate" :key="date">
              <div class="flex items-center gap-3 mt-6 first:mt-0">
                <p class="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
                  {{ formatDate(date) }}
                </p>
                <span
                  v-if="date === todayStr"
                  class="text-[10px] bg-gold/15 text-gold px-2 py-0.5 rounded-full font-bold border border-gold/30"
                >Hoy</span>
                <span
                  v-else-if="isPast(date)"
                  class="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold"
                >Finalizado</span>
              </div>
              <MatchCard v-for="(match, i) in group" :key="i" :match="match" />
            </template>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Mis Equipos — Mundial 2026' })

const { allTeams, matchesForTeams, getFlag, formatDate, todayStr, isPast, pending } = useMatches()
const { myTeams, toggleTeam, isSelected, clearAll } = useMyTeams()

// Which followed team is currently being viewed
const activeTeam = ref<string | null>(null)

// When a team is unfollowed, clear it from active if needed
watch(myTeams, (teams) => {
  if (activeTeam.value && !teams.includes(activeTeam.value)) {
    activeTeam.value = teams[0] ?? null
  }
})

function onToggleTeam(team: string) {
  toggleTeam(team)
  // Auto-select the team when first followed
  if (!activeTeam.value && myTeams.value.includes(team)) {
    activeTeam.value = team
  }
}

function setActive(team: string) {
  activeTeam.value = activeTeam.value === team ? null : team
}

const activeMatches = computed(() =>
  activeTeam.value ? matchesForTeams([activeTeam.value]) : [],
)

const activeMatchesByDate = computed(() => {
  const map: Record<string, ReturnType<typeof matchesForTeams>> = {}
  for (const m of activeMatches.value) {
    ;(map[m.date] ??= []).push(m)
  }
  return map
})
</script>
