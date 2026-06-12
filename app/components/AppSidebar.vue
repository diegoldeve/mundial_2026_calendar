<template>
  <aside
    :class="[
      'fixed top-16 left-0 z-20 flex flex-col',
      'w-64 h-[calc(100vh-4rem)]',
      'bg-surface border-r border-border',
      'transform transition-transform duration-300 ease-in-out',
      open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <div class="px-4 pt-5 pb-3">
      <p class="text-[10px] font-bold uppercase tracking-widest text-slate-600">FIFA</p>
      <p class="text-xs font-semibold text-slate-500">World Cup 2026</p>
    </div>

    <div class="h-px bg-border mx-4 mb-3" />

    <nav class="flex-1 px-3 space-y-1 overflow-y-auto">
      <NuxtLink to="/" :class="navClass($route.path === '/')" @click="$emit('close')">
        <span class="text-lg leading-none">⚽</span>
        <span>Partidos de hoy</span>
      </NuxtLink>

      <NuxtLink to="/calendario" :class="navClass($route.path === '/calendario')" @click="$emit('close')">
        <span class="text-lg leading-none">📅</span>
        <span>Calendario</span>
      </NuxtLink>

      <NuxtLink to="/posiciones" :class="navClass($route.path === '/posiciones')" @click="$emit('close')">
        <span class="text-lg leading-none">🏆</span>
        <span>Posiciones</span>
      </NuxtLink>

      <NuxtLink to="/estadisticas" :class="navClass($route.path === '/estadisticas')" @click="$emit('close')">
        <span class="text-lg leading-none">📊</span>
        <span>Estadísticas</span>
      </NuxtLink>

      <NuxtLink to="/mis-equipos" :class="navClass($route.path === '/mis-equipos')" @click="$emit('close')">
        <span class="text-lg leading-none">⭐</span>
        <div class="flex-1 flex items-center justify-between">
          <span>Mis equipos</span>
          <span
            v-if="myTeams.length"
            class="text-[10px] font-bold bg-gold/20 text-gold px-1.5 py-0.5 rounded-full border border-gold/30"
          >
            {{ myTeams.length }}
          </span>
        </div>
      </NuxtLink>
    </nav>

    <div class="px-4 py-4 border-t border-border">
      <p class="text-[11px] text-slate-600">Datos: openfootball/worldcup.json</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
defineEmits<{ close: [] }>()

const { myTeams } = useMyTeams()

function navClass(active: boolean): string {
  const base = 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors border-l-2'
  return active
    ? `${base} bg-surface-raised text-gold border-gold`
    : `${base} text-slate-400 hover:text-slate-100 hover:bg-surface-raised border-transparent`
}
</script>
