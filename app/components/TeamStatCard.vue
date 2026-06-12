<template>
  <div class="bg-surface border border-border rounded-xl overflow-hidden">
    <div class="px-4 py-3 bg-surface-raised flex items-center gap-2">
      <span class="text-base">{{ icon }}</span>
      <h3 class="font-bold text-slate-100 text-sm">{{ title }}</h3>
    </div>

    <div v-if="teams.length === 0" class="px-4 py-6 text-center text-slate-500 text-xs">
      Sin datos aún
    </div>

    <div v-else class="divide-y divide-border/50">
      <div
        v-for="(team, idx) in teams"
        :key="team.team"
        class="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-raised transition-colors"
      >
        <!-- Position -->
        <span class="text-xs font-bold text-slate-600 w-4 text-center shrink-0">{{ idx + 1 }}</span>

        <!-- Flag + name -->
        <div class="flex items-center gap-1.5 flex-1 min-w-0">
          <span class="text-sm leading-none shrink-0">{{ getFlag(team.team) || '🏳️' }}</span>
          <span class="text-xs font-semibold text-slate-200 truncate">{{ team.team }}</span>
        </div>

        <!-- Bar + value -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="w-16 h-1.5 bg-surface-raised rounded-full overflow-hidden">
            <div
              :class="['h-full rounded-full transition-all', barColor]"
              :style="{ width: barWidth(team) }"
            />
          </div>
          <span class="text-xs font-black text-slate-100 w-4 text-right">{{ team[statKey] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TeamGoalStat } from '~/composables/useMatches'
import { FLAG_MAP } from '~/utils/flags'

const props = defineProps<{
  title: string
  icon: string
  teams: TeamGoalStat[]
  statKey: 'gf' | 'ga'
  statLabel: string
  barColor: string
}>()

function getFlag(team: string) { return FLAG_MAP[team] ?? '' }

const maxVal = computed(() => Math.max(...props.teams.map(t => t[props.statKey]), 1))

function barWidth(team: TeamGoalStat): string {
  const val = team[props.statKey]
  return `${(val / maxVal.value) * 100}%`
}
</script>
