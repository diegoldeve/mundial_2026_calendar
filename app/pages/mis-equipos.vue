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

    <!-- Team selector card -->
    <div class="bg-surface rounded-xl border border-border p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-bold text-slate-300 uppercase tracking-wide">
          Selecciones disponibles
        </h2>
        <div class="flex items-center gap-2">
          <span v-if="myTeams.length" class="text-xs text-gold font-bold">
            {{ myTeams.length }} seleccionado{{ myTeams.length !== 1 ? 's' : '' }}
          </span>
          <button
            v-if="myTeams.length"
            class="text-[11px] text-slate-500 hover:text-red-400 transition-colors underline"
            @click="clearAll"
          >
            Limpiar
          </button>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="pending" class="flex flex-wrap gap-2">
        <div v-for="i in 12" :key="i" class="h-8 w-24 bg-surface-raised rounded-full animate-pulse" />
      </div>

      <!-- Team chips -->
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="team in allTeams"
          :key="team"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
            isSelected(team)
              ? 'bg-gold/15 text-gold border-gold/50 shadow-sm shadow-gold/10'
              : 'bg-surface-raised text-slate-400 border-border hover:border-slate-500 hover:text-slate-200',
          ]"
          @click="toggleTeam(team)"
        >
          <span class="text-sm leading-none">{{ getFlag(team) || '🏳️' }}</span>
          <span>{{ team }}</span>
          <span v-if="isSelected(team)" class="text-gold text-[10px] leading-none">✓</span>
        </button>
      </div>
    </div>

    <!-- Matches section -->
    <template v-if="myTeams.length === 0">
      <div class="py-16 text-center">
        <div class="text-6xl mb-4 select-none">⭐</div>
        <p class="text-lg font-semibold text-slate-300">Sin equipos seleccionados</p>
        <p class="text-slate-500 text-sm mt-1">
          Selecciona tus selecciones favoritas arriba para ver sus partidos aquí.
        </p>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-bold uppercase tracking-widest text-slate-600">
          Partidos de tus equipos
        </h2>
        <span class="text-xs text-slate-600">{{ teamMatches.length }} partido{{ teamMatches.length !== 1 ? 's' : '' }}</span>
      </div>

      <div v-if="teamMatches.length" class="space-y-4">
        <!-- Date label before each new date -->
        <template v-for="(group, date) in matchesBySelectedDate" :key="date">
          <div class="flex items-center gap-3 mt-6 first:mt-0">
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider capitalize">
              {{ formatDate(date) }}
            </p>
            <span
              v-if="date === todayStr"
              class="text-[10px] bg-gold/15 text-gold px-2 py-0.5 rounded-full font-bold border border-gold/30"
            >
              Hoy
            </span>
            <span
              v-else-if="isPast(date)"
              class="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-semibold"
            >
              Finalizado
            </span>
          </div>
          <MatchCard v-for="(match, i) in group" :key="i" :match="match" />
        </template>
      </div>

      <div v-else class="py-12 text-center">
        <p class="text-slate-500">No se encontraron partidos para tus equipos</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Mis Equipos — Mundial 2026' })

const { allTeams, matchesForTeams, getFlag, formatDate, todayStr, isPast, pending } = useMatches()
const { myTeams, toggleTeam, isSelected, clearAll } = useMyTeams()

const teamMatches = computed(() => matchesForTeams(myTeams.value))

const matchesBySelectedDate = computed(() => {
  const map: Record<string, typeof teamMatches.value> = {}
  for (const m of teamMatches.value) {
    ;(map[m.date] ??= []).push(m)
  }
  return map
})
</script>
