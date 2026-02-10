<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { SkillProduct } from '@/types/Skill'
import type { Skill } from '@/types/Game'
import { SKILL_CONFIGS } from '@/types/Game'

interface Props {
  products: SkillProduct[]
  currentProduct?: SkillProduct
  playerLevel: number
  skill: Skill
  isActive?: boolean
  onSelect?: (product: SkillProduct) => void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const { t } = useI18n()

const showConfirmation = ref(false)
const pendingProduct = ref<SkillProduct | undefined>()

const skillAction = computed((): string => {
  return t(`skills.${SKILL_CONFIGS[props.skill].name}.action`)
})

const unlockedProducts = computed((): SkillProduct[] => {
  return props.products.filter(p => p.level <= props.playerLevel)
})

const lockedProducts = computed((): SkillProduct[] => {
  return props.products.filter(p => p.level > props.playerLevel)
})

const selectProduct = (product: SkillProduct) => {
  // Si no hay farmeo activo, cambiar directamente
  if (!props.isActive || !props.currentProduct) {
    props.onSelect?.(product)
    return
  }

  // Si es el mismo producto, no hacer nada
  if (props.currentProduct.id === product.id) {
    return
  }

  // Mostrar confirmación si hay un farmeo activo y es diferente
  pendingProduct.value = product
  showConfirmation.value = true
}

const confirmSwitch = () => {
  if (pendingProduct.value) {
    props.onSelect?.(pendingProduct.value)
  }
  closeConfirmation()
}

const cancelSwitch = () => {
  closeConfirmation()
}

const closeConfirmation = () => {
  showConfirmation.value = false
  pendingProduct.value = undefined
}
</script>

<template>
  <div class="product-selector">
    <h3>{{ t('ui.m_available') }}</h3>

    <!-- Productos Disponibles -->
    <div v-if="unlockedProducts.length > 0" class="products-list">
      <div
        v-for="product in unlockedProducts"
        :key="product.id"
        class="product-item"
        :class="{ selected: currentProduct?.id === product.id }"
        @click="selectProduct(product)"
      >
        <div class="product-icon">{{ product.item.icon }}</div>
        <div class="product-info">
          <h4>{{ skillAction }} {{ t(product.i18nKey) }}</h4>
          <p class="level">{{ t('labels.level') }} {{ product.level }}</p>
          <p class="reward">{{ product.xpReward }} XP</p>
        </div>
        <div class="product-quantity">
          <span>x{{ product.quantity }}</span>
        </div>
      </div>
    </div>

    <!-- Productos Bloqueados -->
    <div v-if="lockedProducts.length > 0" class="locked-section">
      <h4>{{ t('ui.m_blocked') }}</h4>
      <div class="locked-products">
        <div
          v-for="product in lockedProducts"
          :key="product.id"
          class="product-item locked"
        >
          <div class="product-icon">🔒</div>
        <div class="product-info">
          <h4>{{ t(product.i18nKey) }}</h4>
          <p class="level">{{ t('labels.level') }} {{ product.level }}</p>
        </div>
        </div>
      </div>
    </div>

    <!-- Confirmación de Cambio de Producto -->
    <div v-if="showConfirmation" class="modal-overlay" @click="cancelSwitch">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ t('ui.m_confirm') }}</h3>
          <button class="close-btn" @click="cancelSwitch">✕</button>
        </div>
        <div class="modal-body">
          <p>{{ t('ui.m_change_product') }}</p>
          <p class="description">{{ t('ui.m_change_product_desc') }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-cancel" @click="cancelSwitch">
            {{ t('ui.m_cancel') }}
          </button>
          <button class="btn btn-accept" @click="confirmSwitch">
            {{ skillAction }} {{ pendingProduct?.item.icon }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-selector {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
}

.product-selector h3 {
  margin: 0 0 16px 0;
  color: var(--color-primary);
  font-size: 18px;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-darker);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.product-item:hover {
  border-color: var(--color-primary);
  background: rgba(255, 165, 0, 0.05);
}

.product-item.selected {
  background: rgba(255, 165, 0, 0.15);
  border-color: var(--color-primary);
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.3);
}

.product-item.locked {
  cursor: not-allowed;
  opacity: 0.6;
}

.product-icon {
  font-size: 24px;
  min-width: 32px;
  text-align: center;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-info h4 {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  word-break: break-word;
}

.level {
  margin: 2px 0 0 0;
  color: var(--text-muted);
  font-size: 12px;
}

.reward {
  margin: 2px 0 0 0;
  color: var(--color-success);
  font-size: 12px;
  font-weight: 500;
}

.product-quantity {
  text-align: right;
  color: var(--text-secondary);
  font-weight: 500;
}

.locked-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.locked-section h4 {
  margin: 0 0 8px 0;
  color: var(--text-muted);
  font-size: 14px;
}

.locked-products {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  background: var(--bg-card);
  border: 2px solid var(--color-primary);
  border-radius: 12px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 24px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--color-danger);
}

.modal-body {
  margin-bottom: 24px;
}

.modal-body p {
  margin: 0;
  color: var(--text-primary);
  font-size: 14px;
  line-height: 1.5;
}

.modal-body p.description {
  margin-top: 8px;
  color: var(--text-secondary);
  font-size: 12px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: var(--bg-darker);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  border-color: var(--color-danger);
  background: rgba(255, 85, 85, 0.1);
}

.btn-accept {
  background: var(--color-primary);
  color: var(--bg-dark);
  font-weight: 600;
}

.btn-accept:hover {
  background: var(--color-secondary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.3);
}
</style>
