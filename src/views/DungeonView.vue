<template>
  <div class="dungeon-view">
    <h1>{{ t('ui.menu.dungeon') }}</h1>
    <p>{{ t('ui.menu.dungeon') }} - Próximamente</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.dungeon-view {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

h1 {
  color: var(--color-primary);
  margin-bottom: 16px;
}

p {
  color: var(--text-secondary);
}
</style>
