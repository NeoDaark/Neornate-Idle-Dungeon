<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  spriteId?: string
  fallbackEmoji?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'ls' | 'lg' | 'xl'
  useSprite?: boolean // si false, siempre muestra el emoji
}

const props = withDefaults(defineProps<Props>(), {
  fallbackEmoji: '❓',
  alt: 'Icono',
  size: 'ls',
  useSprite: true,
})

// Tamaños en píxeles (todos los sprites son 64x64 nativos)
const sizePixels = {
  xs: '16px',    // 1/4
  sm: '24px',    // 3/8
  md: '32px',    // 1/2
  ls: '40px',    // 5/8
  lg: '64px',    // 1:1 nativo
  xl: '96px',    // 1.5x
}

const spritePath = computed<string>(() => {
  if (!props.useSprite || !props.spriteId) return ''

  try {
    // Usar new URL() para que Vite bundlee correctamente en dev y prod
    // Todos los sprites están en: src/assets/sprites/custom/items/
    const relativePath = `../../assets/sprites/custom/items/${props.spriteId}.png`
    const url = new URL(relativePath, import.meta.url).href
    return url
  } catch {
    return ''
  }
})

const showSprite = computed(() => !!spritePath.value)
</script>

<template>
  <div :class="`inline-flex items-center justify-center`" :style="{ width: sizePixels[size], height: sizePixels[size] }">
    <!-- Mostrar sprite si está disponible -->
    <img
      v-if="showSprite && spritePath"
      :src="spritePath"
      :alt="alt"
      :style="{ width: sizePixels[size], height: sizePixels[size] }"
      class="object-contain"
    />
    <!-- Fallback a emoji -->
    <span v-else :class="`flex items-center justify-center text-center`" :style="{ width: sizePixels[size], height: sizePixels[size] }">
      {{ fallbackEmoji }}
    </span>
  </div>
</template>

<style scoped>
img {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}
</style>
