<template>
  <div class="market-view">
    <h1>{{ t('ui.menu.market') }}</h1>
    <p>{{ t('ui.menu.market') }} - Próximamente</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.market-view {
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
