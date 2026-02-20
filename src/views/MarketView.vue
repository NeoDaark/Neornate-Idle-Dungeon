<template>
  <div class="market-view">
    <div class="market-header">
      <h1>{{ t('ui.menu.market') }}</h1>
      <div class="gold-display">
        <span class="gold-amount">{{ formatGold(playerStore.player.gold) }}</span>
        <span class="gold-icon">💰</span>
      </div>
    </div>

    <!-- Sección de Herramientas -->
    <ToolMarketSection />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'
import { usePlayerStore } from '@/stores/playerStore'
import { formatGold } from '@/utils/formatEffect'
import ToolMarketSection from '@/components/tools/ToolMarketSection.vue'

const { t } = useI18n()
const playerStore = usePlayerStore()
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

.market-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  color: var(--color-primary);
  margin: 0;
}

.gold-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid var(--color-primary);
  border-radius: 6px;
}

.gold-label {
  color: var(--text-secondary);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.gold-amount {
  color: var(--color-primary);
  font-size: 16px;
  font-weight: 600;
}

.gold-icon {
  font-size: 18px;
}
</style>
