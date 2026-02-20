<template>
  <div class="tool-card" :class="{ 'is-available': isAvailable, 'is-equipped': isEquipped, 'is-compact': isCompact }">
    <!-- COMPACT MODE -->
    <template v-if="isCompact">
      <div class="tool-card-compact">
        <div class="compact-icon">
          <IconRenderer
            :iconId="SKILL_CONFIGS[props.tool.skillId].icon"
            :faIcon="SKILL_CONFIGS[props.tool.skillId].faIcon"
            size="sm"
          />
        </div>
        <div class="compact-info">
          <div class="compact-name-tier">
            <span class="compact-name">{{ toolName }}</span>
            <span class="compact-tier">{{ t(`tools.tier${tool.tier}`) }}</span>
          </div>
          <div v-if="tool.effects.length > 0" class="compact-effects">
            {{ formatEffectsList(tool.effects) }}
          </div>
          <div class="compact-price">
            <span>{{ formatGold(tool.price) }} 💰</span>
            <span v-if="!isAvailable" class="compact-locked-reason">
              {{ t('tools.requireLevel') }}: {{ tool.requiredLevel }} ({{ t('tools.currentLevel') }}: {{ playerLevel }})
            </span>
          </div>
        </div>
        <button
          class="compact-btn"
          :class="{
            'btn-buy': isAvailable && !isEquipped,
            'btn-equipped': isEquipped,
            'btn-locked': !isAvailable,
          }"
          @click="handleBuy"
          :disabled="!isAvailable || isEquipped || !hasEnoughGold"
        >
          <span v-if="isAvailable && !isEquipped">+</span>
          <span v-else-if="isEquipped">✓</span>
          <span v-else>🔒</span>
        </button>
      </div>
    </template>

    <!-- REGULAR MODE -->
    <template v-else>
      <div class="tool-header">
        <div class="tool-icon">
          <IconRenderer
            :iconId="SKILL_CONFIGS[props.tool.skillId].icon"
            :faIcon="SKILL_CONFIGS[props.tool.skillId].faIcon"
            size="lg"
          />
        </div>
        <div class="tool-info">
          <h3 class="tool-name">{{ toolName }}</h3>
          <p class="tool-tier">{{ t(`tools.tier${tool.tier}`) }}</p>
        </div>
      </div>

      <p class="tool-description">{{ toolDescription }}</p>

      <div class="tool-effects">
        <div v-for="effect in tool.effects" :key="`${tool.id}-${effect.type}`" class="effect">
          <span class="effect-type">{{ formatEffect(effect, t(effect.description), getSkillProductName(tool.skillId)) }}</span>
        </div>
      </div>

      <div class="tool-footer">
        <div class="tool-price">
          <span class="price-label">{{ t('ui.price') }}</span>
          <span class="price-value">{{ formatGold(tool.price) }} 💰</span>
        </div>

        <button
          v-if="isAvailable && !isEquipped"
          class="btn-buy"
          @click="handleBuy"
          :disabled="!hasEnoughGold"
        >
          {{ t('ui.buy') }}
        </button>
        <button v-else-if="isEquipped" class="btn-equipped" disabled>
          {{ t('tools.equipped') }}
        </button>
        <button v-else class="btn-locked" disabled>
          {{ t('ui.locked') }}
        </button>
      </div>

      <div v-if="!isAvailable" class="locked-info">
        <p>{{ t('tools.requireLevel') }}: {{ tool.requiredLevel }}</p>
        <p>{{ t('tools.currentLevel') }}: {{ playerLevel }}</p>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Tool } from '@/types/Tool'
import { useToolsStore } from '@/stores/toolsStore'
import { useSkillsStore } from '@/stores/skillsStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useI18n } from '@/composables/useI18n'
import { formatEffect, formatGold, getSkillProductName } from '@/utils/formatEffect'
import IconRenderer from '@/components/common/IconRenderer.vue'
import { SKILL_CONFIGS } from '@/types/Game'

interface Props {
  tool: Tool
  isCompact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCompact: false,
})
const emit = defineEmits<{
  buy: [toolId: string]
}>()

const { t } = useI18n()
const toolsStore = useToolsStore()
const skillsStore = useSkillsStore()
const playerStore = usePlayerStore()

const playerLevel = computed(() => skillsStore.skillStates[props.tool.skillId]?.level || 0)

const isAvailable = computed(() => toolsStore.isToolAvailable(props.tool.id))

const isEquipped = computed(
  () => toolsStore.equippedTools[props.tool.skillId]?.toolId === props.tool.id,
)

const hasEnoughGold = computed(() => playerStore.player.gold >= props.tool.price)

/**
 * Obtiene el nombre traducido del tool basándose en su skillId e id
 * Clave: tools.{skillId}.{toolId}
 */
const toolName = computed(() => {
  const skillMap: Record<string, string> = {
    'mineria': 'mineria',
    'tala': 'tala',
    'fundicion': 'fundicion',
    'quemado': 'quemado',
  }
  const skillKey = skillMap[props.tool.skillId] || props.tool.skillId
  const i18nKey = `tools.${skillKey}.${props.tool.id}`
  const translated = t(i18nKey)
  // Si la traducción falla (devuelve la clave), usar el nombre del tool
  return translated === i18nKey ? props.tool.name : translated
})

/**
 * Obtiene la descripción traducida del tool basándose en su skillId e id
 * Clave: tools.descriptions.{skillId}.{toolId}
 */
const toolDescription = computed(() => {
  const skillMap: Record<string, string> = {
    'mineria': 'mineria',
    'tala': 'tala',
    'fundicion': 'fundicion',
    'quemado': 'quemado',
  }
  const skillKey = skillMap[props.tool.skillId] || props.tool.skillId
  const i18nKey = `tools.descriptions.${skillKey}.${props.tool.id}`
  const translated = t(i18nKey)
  // Si la traducción falla, usar la descripción original del tool
  return translated === i18nKey ? props.tool.description : translated
})

/**
 * Formatea la lista de efectos traduciendo las claves i18n
 */
const formatEffectsList = (effects: typeof props.tool.effects): string => {
  const productName = getSkillProductName(props.tool.skillId)
  return effects
    .map(effect => {
      const i18nKey = effect.description
      const i18nText = t(i18nKey)
      return formatEffect(effect, i18nText, productName)
    })
    .join(' | ')
}

const handleBuy = () => {
  if (!hasEnoughGold.value) {
    console.warn('Not enough gold')
    return
  }

  emit('buy', props.tool.id)
}
</script>

<style scoped>
.tool-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
}

.tool-card.is-available {
  border-color: var(--color-primary);
}

.tool-card.is-equipped {
  border-color: var(--color-success);
  background: rgba(85, 255, 85, 0.05);
}

/* ===== COMPACT MODE ===== */
.tool-card.is-compact {
  padding: 8px 12px;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  min-height: 60px;
}

.tool-card-compact {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.compact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.compact-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.compact-name-tier {
  display: flex;
  align-items: center;
  gap: 8px;
}

.compact-name {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 14px;
}

.compact-tier {
  color: var(--text-secondary);
  font-size: 11px;
  background: var(--bg-darker);
  padding: 2px 6px;
  border-radius: 3px;
}

.compact-effects {
  color: var(--color-primary);
  font-size: 11px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-price {
  color: var(--text-muted);
  font-size: 12px;
}

.compact-locked-reason {
  color: var(--color-danger);
  font-size: 11px;
  display: block;
  margin-top: 2px;
}

.compact-btn {
  padding: 6px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  min-width: 50px;
  max-width: 100px;
  text-align: center;
}

.compact-btn.btn-buy {
  background: var(--color-primary);
  color: var(--bg-dark);
}

.compact-btn.btn-buy:hover:not(:disabled) {
  background: var(--color-secondary);
  transform: scale(1.05);
}

.compact-btn.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.compact-btn.btn-equipped {
  background: var(--color-success);
  color: var(--bg-dark);
  opacity: 0.7;
}

.compact-btn.btn-locked {
  background: var(--bg-darker);
  color: var(--text-muted);
  border-color: var(--border-color);
  cursor: not-allowed;
}

/* ===== REGULAR MODE ===== */
.tool-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tool-info {
  flex: 1;
}

.tool-name {
  margin: 0;
  color: var(--text-primary);
  font-size: 16px;
  font-weight: bold;
}

.tool-tier {
  margin: 4px 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.tool-description {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.4;
}

.tool-effects {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.effect {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.effect-type {
  color: var(--color-primary);
  font-weight: 500;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.tool-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-label {
  color: var(--text-muted);
  font-size: 12px;
}

.price-value {
  color: var(--color-primary);
  font-weight: bold;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  border: 1px solid transparent;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-buy {
  background: var(--color-primary);
  color: var(--bg-dark);
  flex: 1;
}

.btn-buy:hover:not(:disabled) {
  background: var(--color-secondary);
  transform: scale(1.05);
}

.btn-buy:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-equipped {
  background: var(--color-success);
  color: var(--bg-dark);
  flex: 1;
  opacity: 0.7;
}

.btn-locked {
  background: var(--bg-darker);
  color: var(--text-muted);
  border-color: var(--border-color);
  flex: 1;
  cursor: not-allowed;
}

.locked-info {
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  font-size: 12px;
}

.locked-info p {
  margin: 4px 0;
  color: var(--text-muted);
}
</style>
