<template>
  <article class="bg-surface rounded-xl border border-border overflow-hidden hover:border-border-light transition-all duration-200">
    <!-- Card header -->
    <div class="px-4 py-2.5 bg-surface-raised flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 text-xs text-slate-400">
        <span v-if="match.group" class="font-bold text-slate-300">{{ match.group }}</span>
        <span v-if="match.group" class="text-slate-600">·</span>
        <span>{{ match.round }}</span>
      </div>
      <span class="text-xs text-slate-500 truncate max-w-[160px]">📍 {{ match.ground }}</span>
    </div>

    <!-- Teams + Score/Time -->
    <div class="px-5 py-6">
      <div class="flex items-center justify-between gap-4">
        <!-- Team 1 -->
        <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
          <span class="text-4xl leading-none select-none">{{ getFlag(match.team1) || '🏳️' }}</span>
          <span
            class="text-xs font-extrabold uppercase tracking-wider leading-tight w-full truncate"
            :class="isWinner(0) ? 'text-gold' : 'text-slate-100'"
          >
            {{ match.team1 }}
          </span>
        </div>

        <!-- Score / VS -->
        <div class="flex flex-col items-center gap-1 shrink-0 min-w-[120px]">
          <template v-if="match.score">
            <div class="flex items-center gap-3">
              <span class="text-4xl font-black leading-none" :class="isWinner(0) ? 'text-gold' : 'text-slate-100'">
                {{ match.score.ft[0] }}
              </span>
              <span class="text-slate-600 text-xl">—</span>
              <span class="text-4xl font-black leading-none" :class="isWinner(1) ? 'text-gold' : 'text-slate-100'">
                {{ match.score.ft[1] }}
              </span>
            </div>
            <span class="text-[10px] font-bold tracking-widest text-slate-600 uppercase mt-0.5">Final</span>
          </template>
          <template v-else>
            <span class="text-2xl font-black text-slate-600">vs</span>
            <div class="flex items-center gap-1.5 mt-1">
              <span class="text-sm">🕐</span>
              <span class="text-sm font-bold text-gold">{{ utc6Time }}h</span>
            </div>
            <span class="text-[10px] text-slate-600 font-medium">UTC-6</span>
          </template>
        </div>

        <!-- Team 2 -->
        <div class="flex-1 flex flex-col items-center gap-2 text-center min-w-0">
          <span class="text-4xl leading-none select-none">{{ getFlag(match.team2) || '🏳️' }}</span>
          <span
            class="text-xs font-extrabold uppercase tracking-wider leading-tight w-full truncate"
            :class="isWinner(1) ? 'text-gold' : 'text-slate-100'"
          >
            {{ match.team2 }}
          </span>
        </div>
      </div>

      <!-- Scorers -->
      <div
        v-if="match.score && hasGoals"
        class="mt-4 pt-4 border-t border-border flex justify-between gap-4 text-xs text-slate-500"
      >
        <div class="space-y-1 min-w-0">
          <p v-for="g in match.goals1" :key="`g1-${g.minute}-${g.name}`" class="truncate">
            ⚽ <span class="text-slate-400">{{ g.name }}</span> {{ g.minute }}'
          </p>
        </div>
        <div class="space-y-1 text-right min-w-0">
          <p v-for="g in match.goals2" :key="`g2-${g.minute}-${g.name}`" class="truncate">
            <span class="text-slate-400">{{ g.name }}</span> {{ g.minute }}' ⚽
          </p>
        </div>
      </div>

      <!-- Half-time -->
      <p v-if="match.score?.ht" class="mt-2 text-center text-[11px] text-slate-600">
        ({{ match.score.ht[0] }}–{{ match.score.ht[1] }} al descanso)
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Match } from '~/composables/useMatches'
import { FLAG_MAP } from '~/utils/flags'
import { convertToUTC6 } from '~/utils/time'

const props = defineProps<{ match: Match }>()

function getFlag(team: string) {
  return FLAG_MAP[team] ?? ''
}

function isWinner(side: 0 | 1): boolean {
  if (!props.match.score) return false
  const [s0, s1] = props.match.score.ft
  if (s0 === s1) return false
  return side === 0 ? s0 > s1 : s1 > s0
}

const utc6Time = computed(() => convertToUTC6(props.match.time))

const hasGoals = computed(() =>
  (props.match.goals1?.length ?? 0) > 0 || (props.match.goals2?.length ?? 0) > 0,
)
</script>
