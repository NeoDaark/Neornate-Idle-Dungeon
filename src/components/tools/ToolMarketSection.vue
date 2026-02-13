<template>
  <div class="tools-market-section">
    <h2 class="section-title">
      {{ t('tools.title') }}
    </h2>

    <!-- Lista compacta de herramientas -->
    <div v-if="visibleTools.length > 0" class="tools-list">
      <ToolCard
        v-for="tool in visibleTools"
        :key="tool.id"
        :tool="tool"
        :is-compact="true"
        @buy="handleBuyTool"
      />
    </div>

    <div v-else class="no-tools">
      <p>{{ t('tools.noAvailable') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Skill } from '@/types/Game'
import { useToolsStore } from '@/stores/toolsStore'
import { usePlayerStore } from '@/stores/playerStore'
import { useSkillsStore } from '@/stores/skillsStore'
import { TOOLS_MAP, ALL_TOOLS } from '@/data/toolsData'
import { useI18n } from '@/composables/useI18n'
import ToolCard from './ToolCard.vue'

const { t } = useI18n()
const toolsStore = useToolsStore()
const playerStore = usePlayerStore()
const skillsStore = useSkillsStore()

// Filtrar herramientas: disponibles + 1 tier por encima de lo disponible (bloqueadas)
const visibleTools = computed(() => {
  const tools: typeof ALL_TOOLS = []
  
  // Agrupar por skill
  const toolsBySkill = new Map<Skill, typeof ALL_TOOLS>()
  ALL_TOOLS.forEach(tool => {
    if (!toolsBySkill.has(tool.skillId)) {
      toolsBySkill.set(tool.skillId, [])
    }
    toolsBySkill.get(tool.skillId)!.push(tool)
  })

  // Para cada skill, obtener: disponibles + 1 tier bloqueado
  toolsBySkill.forEach((skillTools, skill) => {
    const playerLevel = skillsStore.skillStates[skill]?.level || 0
    
    // Obtener tier máximo disponible
    const maxAvailableTier = Math.max(
      ...skillTools
        .filter(t => t.requiredLevel <= playerLevel)
        .map(t => t.tier),
      0
    )

    // Agregar herramientas disponibles (no equipadas)
    skillTools.forEach(tool => {
      if (tool.requiredLevel <= playerLevel) {
        // No mostrar si ya está equipada
        const isEquipped = toolsStore.equippedTools[skill]?.toolId === tool.id
        if (!isEquipped) {
          tools.push(tool)
        }
      }
    })

    // Agregar la herramienta bloqueada de 1 tier por encima (máximo)
    const nextTierTool = skillTools.find(t => t.tier === maxAvailableTier + 1)
    if (nextTierTool) {
      tools.push(nextTierTool)
    }
  })

  // Ordenar: disponibles primero, después bloqueadas
  return tools.sort((a, b) => {
    const aAvailable = a.requiredLevel <= (skillsStore.skillStates[a.skillId]?.level || 0)
    const bAvailable = b.requiredLevel <= (skillsStore.skillStates[b.skillId]?.level || 0)
    
    if (aAvailable !== bAvailable) {
      return aAvailable ? -1 : 1
    }
    
    // Dentro del mismo estado, ordenar por skill y tier
    if (a.skillId !== b.skillId) {
      return a.skillId.localeCompare(b.skillId)
    }
    
    return a.tier - b.tier
  })
})

const handleBuyTool = (toolId: string) => {
  const tool = TOOLS_MAP[toolId]
  if (!tool) return

  // Validar que tiene suficiente oro
  if (playerStore.player.gold < tool.price) {
    alert(t('errors.notEnoughGold'))
    return
  }

  // Restar oro
  playerStore.removeGold(tool.price)

  // Equipar herramienta
  toolsStore.equipTool(toolId, tool.skillId)

  // Guardar cambios
  playerStore.saveToStorage()
  toolsStore.saveToStorage()

  alert(t('tools.boughtSuccess'))
}
</script>

<style scoped>
.tools-market-section {
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.section-title {
  color: var(--color-primary);
  margin: 0 0 16px;
  font-size: 18px;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.no-tools {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-muted);
}

.no-tools p {
  margin: 0;
}
</style>
