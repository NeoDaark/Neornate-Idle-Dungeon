<script setup lang="ts">
import { computed, ref } from 'vue'

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
}

const props = defineProps<Props>()

const imageLoadFailed = ref(false)

const iconPath = computed<string>(() => {
  try {
    // Usar new URL() para que Vite bundlee correctamente en dev y prod
    // Los iconos custom de skills están en: src/assets/sprites/custom/ui/
    const relativePath = `../../assets/sprites/custom/ui/${props.iconId}.png`
    const url = new URL(relativePath, import.meta.url).href
    return url
  } catch {
    return ''
  }
})

const handleImageError = () => {
  imageLoadFailed.value = true
}

const handleImageLoad = () => {
  imageLoadFailed.value = false
}
</script>

<template>
  <div class="icon-renderer" :class="props.class">
    <!-- Custom icon (si existe) -->
    <img
      v-if="iconPath && !imageLoadFailed"
      :src="iconPath"
      :alt="iconId"
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

.custom-icon {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.fa-icon {
  display: inline-block;
  font-style: normal;
}
</style>
