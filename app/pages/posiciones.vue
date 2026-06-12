<template>
  <div class="p-4 md:p-8 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-black tracking-tight">
        <span class="text-gold">Posiciones</span> por Grupo
      </h1>
      <p class="text-slate-400 mt-1 text-sm">Fase de grupos · Mundial 2026</p>
    </div>

    <!-- Legend -->
    <div class="flex items-center gap-4 mb-6 text-xs text-slate-500">
      <div class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
        <span>Clasifican a Round of 32</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-2.5 h-2.5 rounded-sm bg-amber-500/60" />
        <span>Posible clasificación (mejor 3°)</span>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div v-for="i in 12" :key="i" class="h-48 bg-surface rounded-xl border border-border animate-pulse" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center">
      <p class="text-red-300 font-semibold">No se pudieron cargar los datos</p>
    </div>

    <!-- Groups grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      <div
        v-for="{ group, standings } in allStandings"
        :key="group"
        class="bg-surface border border-border rounded-xl overflow-hidden"
      >
        <!-- Group header -->
        <div class="px-4 py-2.5 bg-surface-raised flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-100">{{ group }}</h2>
          <span class="text-[10px] font-semibold text-slate-600 uppercase tracking-wide">
            {{ playedCount(standings) }}/6 jugados
          </span>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-slate-600 border-b border-border">
                <th class="w-6 py-1.5 px-2 text-center font-semibold">#</th>
                <th class="py-1.5 px-2 text-left font-semibold min-w-[110px]">Equipo</th>
                <th class="py-1.5 px-2 text-center font-semibold w-7">PJ</th>
                <th class="py-1.5 px-2 text-center font-semibold w-7">G</th>
                <th class="py-1.5 px-2 text-center font-semibold w-7">E</th>
                <th class="py-1.5 px-2 text-center font-semibold w-7">P</th>
                <th class="py-1.5 px-2 text-center font-semibold w-8">GF</th>
                <th class="py-1.5 px-2 text-center font-semibold w-8">GC</th>
                <th class="py-1.5 px-2 text-center font-semibold w-8">DG</th>
                <th class="py-1.5 px-2 text-center font-semibold w-8 text-gold">Pts</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(team, idx) in standings"
                :key="team.team"
                :class="[
                  'border-b border-border/50 last:border-0 transition-colors',
                  rowBg(idx),
                ]"
              >
                <!-- Position -->
                <td class="py-2 px-2 text-center">
                  <span :class="['inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold', posColor(idx)]">
                    {{ idx + 1 }}
                  </span>
                </td>

                <!-- Team -->
                <td class="py-2 px-2">
                  <div class="flex items-center gap-1.5 min-w-0">
                    <span class="text-sm leading-none shrink-0">{{ getFlag(team.team) || '🏳️' }}</span>
                    <span class="text-slate-100 font-semibold truncate">{{ team.team }}</span>
                  </div>
                </td>

                <!-- Stats -->
                <td class="py-2 px-2 text-center text-slate-400">{{ team.mp }}</td>
                <td class="py-2 px-2 text-center text-slate-400">{{ team.w }}</td>
                <td class="py-2 px-2 text-center text-slate-400">{{ team.d }}</td>
                <td class="py-2 px-2 text-center text-slate-400">{{ team.l }}</td>
                <td class="py-2 px-2 text-center text-slate-400">{{ team.gf }}</td>
                <td class="py-2 px-2 text-center text-slate-400">{{ team.ga }}</td>
                <td class="py-2 px-2 text-center" :class="gdColor(team.gd)">
                  {{ team.gd > 0 ? '+' : '' }}{{ team.gd }}
                </td>
                <td class="py-2 px-2 text-center font-black" :class="team.pts > 0 ? 'text-gold' : 'text-slate-500'">
                  {{ team.pts }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TeamStanding } from '~/composables/useMatches'

useHead({ title: 'Posiciones — Mundial 2026' })

const { allStandings, pending, error, getFlag } = useMatches()

function playedCount(standings: TeamStanding[]): number {
  // Each match counts for 2 teams, total games = sum(mp) / 2
  return standings.reduce((sum, t) => sum + t.mp, 0) / 2
}

function rowBg(idx: number): string {
  if (idx < 2) return 'bg-emerald-950/20 hover:bg-emerald-950/40'
  if (idx === 2) return 'bg-amber-950/20 hover:bg-amber-950/40'
  return 'hover:bg-surface-raised'
}

function posColor(idx: number): string {
  if (idx < 2) return 'text-emerald-400'
  if (idx === 2) return 'text-amber-400'
  return 'text-slate-600'
}

function gdColor(gd: number): string {
  if (gd > 0) return 'text-emerald-400'
  if (gd < 0) return 'text-red-400'
  return 'text-slate-500'
}
</script>
