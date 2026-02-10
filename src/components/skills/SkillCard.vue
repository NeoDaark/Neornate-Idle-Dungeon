<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import type { SkillState } from '@/types/Skill'
import { SKILL_CONFIGS, Tier } from '@/types/Game'

interface Props {
  skillState: SkillState
  isActive?: boolean
  onClick?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
})

const { t } = useI18n()

const skillConfig = computed(() => {
  return SKILL_CONFIGS[props.skillState.skill]
})

const displayName = computed(() => {
  return t(`skills.${skillConfig.value.name}.name`)
})

const skillAction = computed(() => {
  return t(`skills.${skillConfig.value.name}.action`)
})

const tierIndex = computed((): number => {
  const tiers = Object.values(Tier)
  return tiers.indexOf(props.skillState.tier)
})

const xpNeededForNextLevel = computed((): number => {
  const tierBonus = (tierIndex.value + 1) * 300
  return 100 + props.skillState.level * 50 + tierBonus
})

const xpProgress = computed((): number => {
  return Math.min(100, Math.round((props.skillState.experience / xpNeededForNextLevel.value) * 100))
})
</script>

<template>
  <div class="skill-card" :class="{ active: isActive }" @click="onClick">
    <!-- Header -->
    <div class="skill-header">
      <span class="emoji">{{ skillConfig.emoji }}</span>
      <div class="info">
        <h3>{{ displayName }}</h3>
        <p class="level">{{ t('labels.level') }} {{ skillState.level }}</p>
      </div>
    </div>

    <!-- XP Progress -->
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: xpProgress + '%' }"></div>
      </div>
      <p class="xp-text">{{ skillState.experience }} / {{ xpNeededForNextLevel }} XP</p>
    </div>

    <!-- Status -->
    <div class="status" :class="{ active: isActive }">
      <span v-if="isActive && skillState.currentProduct">
        ⏳ {{ t('labels.active') }} - {{ skillAction }} {{ t(skillState.currentProduct.i18nKey) }}
      </span>
      <span v-else-if="isActive">
        ⏳ {{ t('labels.active') }}
      </span>
      <span v-else>
        ⏹️ {{ t('labels.inactive') }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.skill-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 165, 0, 0.2);
}

.skill-card.active {
  background: rgba(255, 165, 0, 0.1);
  border-color: var(--color-primary);
}

.skill-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.emoji {
  font-size: 32px;
  min-width: 40px;
}

.info h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 18px;
}

.level {
  margin: 4px 0 0 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.progress-section {
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--bg-darker);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-secondary), var(--color-primary));
  transition: width 0.3s ease;
}

.xp-text {
  margin: 0;
  color: var(--text-secondary);
  font-size: 12px;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  background: var(--bg-darker);
  color: var(--text-muted);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: rgba(85, 255, 85, 0.2);
  color: var(--color-success);
}
</style>
