<template>
  <div class="skills-view">
    <h1>{{ t('ui.menu.skills') }}</h1>
    <p>{{ t('ui.menu.skills') }} - Próximamente</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.skills-view {
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
