<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '@/composables/useI18n'
import { Skill, SKILL_CONFIGS } from '@/types/Game'
import MiningSkill from '@/components/skills/MiningSkill.vue'
import LoggingSkill from '@/components/skills/LoggingSkill.vue'

const { t } = useI18n()

const activeSkill = ref<Skill>(Skill.MINERIA)

const availableSkills = [
  Skill.MINERIA,
  Skill.TALA,
  // Skill.FUNDICION,
  // Skill.HERRERIA,
  // Skill.PESCA,
  // Skill.COCINA,
  // Skill.AVENTURA,
]
</script>

<template>
  <div class="skills-view">
    <!-- Skill Selector -->
    <div class="skills-selector">
      <h1>{{ t('ui.menu.skills') }}</h1>
      <div class="skills-tabs">
        <button
          v-for="skill in availableSkills"
          :key="skill"
          class="skill-tab"
          :class="{ active: activeSkill === skill }"
          @click="activeSkill = skill"
        >
          {{ SKILL_CONFIGS[skill].emoji }} {{ t(`skills.${SKILL_CONFIGS[skill].name}.name`) }}
        </button>
      </div>
    </div>

    <!-- Skill Components -->
    <div class="skill-content">
      <MiningSkill v-if="activeSkill === Skill.MINERIA" />
      <LoggingSkill v-else-if="activeSkill === Skill.TALA" />
    </div>
  </div>
</template>

<style scoped>
.skills-view {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.skills-selector {
  background: var(--bg-card);
  border-bottom: 2px solid var(--color-primary);
  padding: 16px 24px;
  flex-shrink: 0;
}

.skills-selector h1 {
  margin: 0 0 12px 0;
  color: var(--color-primary);
  font-size: 24px;
}

.skills-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.skill-tab {
  padding: 8px 16px;
  background: var(--bg-darker);
  border: 2px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.skill-tab:hover {
  border-color: var(--color-primary);
  color: var(--text-primary);
}

.skill-tab.active {
  background: rgba(255, 165, 0, 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.skill-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
</style>
