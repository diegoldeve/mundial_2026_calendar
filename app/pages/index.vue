<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-black tracking-tight">
        Partidos de <span class="text-gold">Hoy</span>
      </h1>
      <p class="text-slate-400 mt-1 text-sm capitalize">{{ formattedDate }}</p>
    </div>

    <!-- Loading skeletons -->
    <div v-if="pending" class="space-y-4">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-surface rounded-xl h-40 border border-border animate-pulse"
      />
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center"
    >
      <p class="text-red-300 font-semibold">No se pudieron cargar los datos</p>
      <p class="text-red-500 text-sm mt-1">{{ error.message }}</p>
    </div>

    <!-- No matches today -->
    <div v-else-if="todayMatches.length === 0" class="py-20 text-center">
      <div class="text-7xl mb-5 select-none">🌙</div>
      <p class="text-xl font-bold text-slate-300">Sin partidos hoy</p>
      <p class="text-slate-500 text-sm mt-2">No hay encuentros programados para hoy.</p>
      <NuxtLink
        to="/calendario"
        class="mt-6 inline-flex items-center gap-2 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 px-5 py-2.5 rounded-lg text-sm font-bold transition-colors"
      >
        Ver Calendario
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </NuxtLink>
    </div>

    <!-- Matches -->
    <div v-else class="space-y-4">
      <p class="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2">
        {{ todayMatches.length }} partido{{ todayMatches.length !== 1 ? 's' : '' }}
      </p>
      <MatchCard
        v-for="(match, i) in todayMatches"
        :key="i"
        :match="match"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { todayMatches, pending, error } = useMatches()

const formattedDate = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

useHead({ title: 'Partidos de Hoy — Mundial 2026' })
</script>
