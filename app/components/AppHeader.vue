<template>
  <header class="sticky top-0 z-30 h-16 flex items-center px-4 gap-4 bg-surface border-b border-border backdrop-blur-sm">
    <!-- Hamburger (mobile only) -->
    <button
      class="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-surface-raised transition-colors"
      aria-label="Abrir menú"
      @click="$emit('toggle-sidebar')"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Brand -->
    <div class="flex items-center gap-2.5">
      <div class="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-sm leading-none select-none">
        ⚽
      </div>
      <span class="font-black text-lg tracking-tight hidden sm:block">
        <span class="text-gold">Mundial</span><span class="text-slate-100"> 2026</span>
      </span>
    </div>

    <!-- Page title (center) -->
    <div class="flex-1 flex justify-center">
      <span class="text-sm font-semibold text-slate-400">{{ pageTitle }}</span>
    </div>

    <!-- Date (right) -->
    <div class="hidden sm:block text-xs text-slate-500 capitalize text-right">
      {{ formattedDate }}
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()

const pageTitle = computed(() => {
  if (route.path === '/') return 'Partidos de hoy'
  if (route.path === '/calendario') return 'Calendario'
  return ''
})

const formattedDate = new Date().toLocaleDateString('es-MX', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
</script>
