<template>
  <div class="min-h-screen bg-pitch text-slate-100 flex flex-col">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

    <div class="flex flex-1 relative">
      <!-- Mobile backdrop -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 bg-black/60 z-20 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false" />

      <main class="flex-1 min-w-0 lg:ml-64 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const route = useRoute()

watch(() => route.path, () => {
  sidebarOpen.value = false
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
