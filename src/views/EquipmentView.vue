<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from '@/composables/useI18n'
import EquipmentContent from '@/components/inventory/EquipmentContent.vue'

const { t } = useI18n()
const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="equipment-view">
    <!-- Header -->
    <div class="equipment-header">
      <button 
        class="back-btn"
        @click="goBack"
        :title="t('ui.menu.close')"
      >
        <FaIcon icon="fa-solid fa-chevron-left" />
        {{ t('labels.back') }}
      </button>
      <h1>⚔️ {{ t('labels.equipment') }}</h1>
    </div>

    <!-- Content -->
    <div class="equipment-content">
      <EquipmentContent />
    </div>
  </div>
</template>

<style scoped>
.equipment-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--bg-dark);
}

.equipment-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(255, 165, 0, 0.1);
  border: 1px solid rgba(255, 165, 0, 0.3);
  border-radius: 4px;
  color: var(--color-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  font-weight: 500;
}

.back-btn:hover {
  background: rgba(255, 165, 0, 0.2);
  border-color: var(--color-primary);
}

.back-btn:active {
  transform: scale(0.95);
}

.equipment-header h1 {
  margin: 0;
  font-size: 18px;
  color: var(--color-primary);
  flex: 1;
}

.equipment-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
</style>
