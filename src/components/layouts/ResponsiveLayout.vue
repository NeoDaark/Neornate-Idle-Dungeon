<template>
  <div class="responsive-layout">
    <!-- Layout móvil (pantallas pequeñas) -->
    <MobileMenuLayout v-if="isMobile" />

    <!-- Layout desktop (pantallas grandes) -->
    <DesktopSidebarLayout v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import MobileMenuLayout from './mobile/MobileMenuLayout.vue'
import DesktopSidebarLayout from './desktop/DesktopSidebarLayout.vue'

const isMobile = ref(false)

// Breakpoint: 1100px (tamaño mínimo para sidebar lateral)
//const BREAKPOINT = 1100
const BREAKPOINT = 720

const checkWidth = () => {
  isMobile.value = window.innerWidth < BREAKPOINT
}

onMounted(() => {
  checkWidth()
  window.addEventListener('resize', checkWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkWidth)
})
</script>

<style scoped>
.responsive-layout {
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
