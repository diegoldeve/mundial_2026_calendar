<template>
  <div class="p-4 md:p-8 max-w-3xl mx-auto">
    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight">
        <span class="text-gold">Calendario</span> de Partidos
      </h1>
      <p class="text-slate-400 mt-1 text-sm">Mundial 2026 · Todos los encuentros</p>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div class="h-24 bg-surface rounded-xl border border-border animate-pulse" />
      <div v-for="i in 3" :key="i" class="h-40 bg-surface rounded-xl border border-border animate-pulse" />
    </div>

    <template v-else-if="!error">
      <!-- Horizontal date strip -->
      <div class="relative mb-6 -mx-4 md:mx-0">
        <!-- Fade left -->
        <div class="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-pitch to-transparent md:hidden" />
        <!-- Fade right -->
        <div class="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-pitch to-transparent md:hidden" />

        <div ref="stripRef" class="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 no-scrollbar snap-x snap-mandatory">
          <button
            v-for="d in allDates"
            :key="d"
            :ref="el => setDateRef(d, el as HTMLElement)"
            :class="[
              'snap-start flex-shrink-0 flex flex-col items-center justify-center',
              'w-14 py-3 rounded-xl border text-center transition-all duration-150',
              selectedDate === d
                ? 'bg-gold text-black border-gold shadow-lg shadow-gold/20 scale-105'
                : d === todayStr
                  ? 'bg-surface-raised text-gold border-gold/40 hover:border-gold/70'
                  : 'bg-surface text-slate-400 border-border hover:border-border-light hover:text-slate-200',
            ]"
            @click="selectedDate = d"
          >
            <span class="text-[9px] uppercase font-bold tracking-wide opacity-70 leading-none mb-0.5">
              {{ getMonthShort(d) }}
            </span>
            <span class="text-xl font-black leading-tight">{{ getDayNum(d) }}</span>
            <span
              v-if="d === todayStr"
              :class="['text-[8px] font-bold uppercase tracking-wider leading-none mt-0.5', selectedDate === d ? 'text-black/60' : 'text-gold']"
            >
              HOY
            </span>
            <span v-else class="text-[9px] leading-none mt-0.5 opacity-50">
              {{ getDayOfWeek(d) }}
            </span>
          </button>
        </div>
      </div>

      <!-- Selected date info -->
      <div class="mb-5 flex items-center gap-3">
        <h2 class="text-base font-bold text-slate-100 capitalize">
          {{ formatDate(selectedDate) }}
        </h2>
        <span
          v-if="selectedDate === todayStr"
          class="text-[11px] bg-gold/15 text-gold px-2 py-0.5 rounded-full font-bold border border-gold/30"
        >Hoy</span>
        <span
          v-else-if="isPast(selectedDate)"
          class="text-[11px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold"
        >Finalizado</span>
        <span
          v-else
          class="text-[11px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-900"
        >Próximo</span>
        <span class="text-xs text-slate-600 ml-auto">
          {{ selectedMatches.length }} partido{{ selectedMatches.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Match cards -->
      <div v-if="selectedMatches.length" class="space-y-4">
        <MatchCard
          v-for="(match, i) in selectedMatches"
          :key="i"
          :match="match"
        />
      </div>
      <div v-else class="py-12 text-center">
        <p class="text-slate-500">No hay partidos para esta fecha</p>
      </div>
    </template>

    <div v-else class="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center">
      <p class="text-red-300 font-semibold">No se pudieron cargar los datos</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({ title: 'Calendario — Mundial 2026' })

const { allDates, matchesByDate, pending, error, todayStr, formatDate, isPast } = useMatches()

const selectedDate = ref(todayStr)
const dateRefs = ref<Record<string, HTMLElement>>({})

function setDateRef(d: string, el: HTMLElement | null) {
  if (el) dateRefs.value[d] = el
}

watchEffect(() => {
  if (!pending.value && allDates.value.length && !allDates.value.includes(selectedDate.value)) {
    selectedDate.value = allDates.value[0]
  }
})

watch(selectedDate, (d) => {
  nextTick(() => {
    dateRefs.value[d]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  })
})

onMounted(() => {
  nextTick(() => {
    dateRefs.value[todayStr]?.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'center' })
  })
})

const selectedMatches = computed(() => matchesByDate.value[selectedDate.value] ?? [])

function getDayNum(dateStr: string): string {
  return dateStr.split('-')[2]!
}

function getMonthShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { month: 'short' })
}

function getDayOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('es-MX', { weekday: 'short' })
}
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
