<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Skill } from '@/types/Game'
import MiningSkill from '@/components/skills/MiningSkill.vue'
import LoggingSkill from '@/components/skills/LoggingSkill.vue'
import SmeltingSkill from '@/components/skills/SmeltingSkill.vue'
import QuemadoSkill from '@/components/skills/QuemadoSkill.vue'

const route = useRoute()

// Mapear string a enum Skill
const skillMap: Record<string, Skill> = {
  'mineria': Skill.MINERIA,
  'tala': Skill.TALA,
  'fundicion': Skill.FUNDICION,
  'herreria': Skill.HERRERIA,
  'pesca': Skill.PESCA,
  'cocina': Skill.COCINA,
  'aventura': Skill.AVENTURA,
  'quemado': Skill.QUEMADO,
}

const getSkillFromQuery = (): Skill => {
  const query = route.query.skill as string
  return skillMap[query] || Skill.MINERIA
}

const activeSkill = ref<Skill>(getSkillFromQuery())

// Actualizar cuando cambia la query
watch(
  () => route.query.skill,
  () => {
    activeSkill.value = getSkillFromQuery()
  }
)
</script>

<template>
  <div class="skills-view">
    <div class="skill-content">
      <MiningSkill v-if="activeSkill === Skill.MINERIA" />
      <LoggingSkill v-else-if="activeSkill === Skill.TALA" />
      <SmeltingSkill v-else-if="activeSkill === Skill.FUNDICION" />
      <QuemadoSkill v-else-if="activeSkill === Skill.QUEMADO" />
    </div>
  </div>
</template>

<style scoped>
.skills-view {
  margin-top: 25px;
  margin-bottom: 25px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.skill-content {
  flex: 1;
  overflow: visible;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
</style>
