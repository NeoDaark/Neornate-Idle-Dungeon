<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useSkillsStore } from '@/stores/skillsStore'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useI18n } from '@/composables/useI18n'
import { SKILL_CONFIGS } from '@/types/Game'
import IconRenderer from '@/components/common/IconRenderer.vue'

const skillsStore = useSkillsStore()
const inventoryStore = useInventoryStore()
const { t } = useI18n()

// Forzar actualización periódica
const now = ref(Date.now())
let updateInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  updateInterval = setInterval(() => {
    now.value = Date.now()
  }, 100) // Actualizar cada 100ms
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})

// Skill activo actual
const activeSkill = computed(() => {
  return skillsStore.activeSkills[0] || null
})

const skillConfig = computed(() => {
  if (!activeSkill.value) return null
  return SKILL_CONFIGS[activeSkill.value.skill]
})

const skillName = computed(() => {
  if (!skillConfig.value) return ''
  return t(`skills.${skillConfig.value.name}.name`)
})

const skillLevel = computed(() => {
  return activeSkill.value?.level || 0
})

// Nombre del producto siendo farmeado
const productName = computed(() => {
  if (!activeSkill.value?.currentProduct) return ''
  return t(activeSkill.value.currentProduct.i18nKey)
})

// Cantidad actual del item en el inventario
const productQuantity = computed(() => {
  if (!activeSkill.value?.currentProduct) return 0
  return inventoryStore.getItemQuantity(activeSkill.value.currentProduct.item.id)
})
</script>

<template>
  <!-- Solo mostrar el trabajo activo, el nivel y XP lo maneja el header de desktop -->
  <div v-if="skillConfig" class="active-work">
    <IconRenderer
      :icon-id="skillConfig.icon"
      :fa-icon="skillConfig.faIcon"
      class="work-icon"
    />
    <div class="work-content">
      <div class="work-title">
        <span class="work-name">{{ skillName }}</span>
        <span class="work-level">Lvl {{ skillLevel }}</span>
      </div>
      <div v-if="productName" class="work-product">
        <span class="separator"><FaIcon :icon="'fas fa-caret-left'" /></span> 
        <span class="product-qty">{{ productQuantity }}</span>
        <span class="separator"><FaIcon :icon="'fas fa-caret-right'" /></span>
        <span class="product-name">{{ productName }}</span>
        
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ===== ACTIVE WORK SECTION ===== */
.active-work {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: rgba(85, 255, 85, 0.12);
  border-radius: 3px;
  padding: 2px 4px 1px 4px;
  flex: 1;
  position: relative;
  overflow: visible;
}

.work-icon {
  font-size: 1.3rem;
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
  flex-shrink: 0;
  min-width: 24px;
  text-align: center;
  margin-top: 1px;
}

.work-content {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.work-title {
  display: flex;
  align-items: center;
  gap: 5px;
  line-height: 1;
}

.work-name {
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 600;
}

.work-level {
  color: var(--text-muted);
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1px 3px;
  border-radius: 2px;
  flex-shrink: 0;
}

.work-product {
  display: flex;
  align-items: center;
  gap: 3px;
  line-height: 1;
}

.product-name {
  color: var(--text-primary);
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
}

.separator {
  color: var(--text-muted);
  font-size: 0.65rem;
}

.product-qty {
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.65rem;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.75;
    transform: scale(1.08);
  }
}
</style>
