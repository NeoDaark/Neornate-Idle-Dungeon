<template>
  <div class="inventory-view">
    <h1>{{ t('ui.menu.inventory') }}</h1>
    <p>{{ t('ui.menu.inventory') }} - Próximamente</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.inventory-view {
  padding: 24px;
}

h1 {
  color: var(--color-primary);
  margin-bottom: 16px;
}

p {
  color: var(--text-secondary);
}
</style>
