<template>
  <div class="market-view">
    <h1>{{ t('ui.menu.market') }}</h1>

    <!-- Sección de Herramientas -->
    <ToolMarketSection />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import ToolMarketSection from '@/components/tools/ToolMarketSection.vue'

const { t } = useI18n()
</script>

<style scoped>
.market-view {
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
</style>
