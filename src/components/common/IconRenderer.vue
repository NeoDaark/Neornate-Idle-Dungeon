<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  /**
   * ID del icono (usado para construir la ruta del sprite custom)
   * Ej: 'mineria', 'tala', 'herreria'
   */
  iconId: string
  
  /**
   * Clase de FontAwesome como fallback
   * Ej: 'fa-solid fa-mountain'
   */
  faIcon: string
  
  /**
   * Clase CSS adicional para el contenedor
   */
  class?: string

  /**
   * Tamaño del icono: xs, sm, md, ls, lg, xl
   */
  size?: 'xs' | 'sm' | 'md' | 'ls' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'ls',
})

const imageLoadFailed = ref(false)

// Construir la ruta del sprite usando rutas relativas válidas para new URL()
const iconPath = computed(() => {
  if (!props.iconId) return ''
  // Desde src/components/common/ hacia src/assets/sprites/custom/ui/
  // son 2 niveles arriba para llegar a src/, luego assets/
  return new URL(
    `../../assets/sprites/custom/ui/${props.iconId}.png`,
    import.meta.url
  ).href
})

const handleImageError = () => {
  imageLoadFailed.value = true
}

const handleImageLoad = () => {
  imageLoadFailed.value = false
}
</script>

<template>
  <div :class="['icon-renderer', `icon-renderer--${props.size}`, props.class]">
    <!-- Custom icon (si existe) -->
    <img
      v-if="iconPath && !imageLoadFailed"
      :src="iconPath"
      :alt="`Icon: ${props.iconId}`"
      class="custom-icon"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- FontAwesome icon (fallback) -->
    <FaIcon
      v-if="imageLoadFailed || !iconPath"
      :icon="faIcon"
      class="fa-icon"
    />
  </div>
</template>

<style scoped>
.icon-renderer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Size variants */
.icon-renderer--xs {
  width: 16px;
  height: 16px;
  font-size: 16px;
  min-width: 16px;
  min-height: 16px;
}

.icon-renderer--sm {
  width: 24px;
  height: 24px;
  font-size: 24px;
  min-width: 24px;
  min-height: 24px;
}

.icon-renderer--md {
  width: 32px;
  height: 32px;
  font-size: 32px;
  min-width: 32px;
  min-height: 32px;
}

.icon-renderer--ls {
  width: 40px;
  height: 40px;
  font-size: 40px;
  min-width: 40px;
  min-height: 40px;
}

.icon-renderer--lg {
  width: 64px;
  height: 64px;
  font-size: 64px;
  min-width: 64px;
  min-height: 64px;
}

.icon-renderer--xl {
  width: 96px;
  height: 96px;
  font-size: 96px;
  min-width: 96px;
  min-height: 96px;
}

.custom-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.fa-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  width: 1em;
  height: 1em;
  font-size: inherit;
}
</style>
