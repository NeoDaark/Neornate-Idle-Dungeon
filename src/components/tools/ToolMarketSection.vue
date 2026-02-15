<template>
  <div class="tools-market-section">
    <h2 class="section-title">
      {{ t('tools.title') }}
    </h2>

    <!-- Si ALL tools están compradas (todos los skills completados) -->
    <div v-if="allToolsPurchased" class="all-tools-completed">
      <p class="completed-message">✅ {{ t('tools.allPurchased') || '¡Ya has comprado todas las herramientas!' }}</p>
    </div>

    <!-- Si hay herramientas disponibles para comprar -->
    <div v-else-if="nextToolsBySkill.length > 0" class="tools-container">
      <!-- TODAS LAS HERRAMIENTAS EN GRID COMPACTO -->
      <div class="tools-grid">
        <ToolCard
          v-for="skillTools in nextToolsBySkill"
          :key="skillTools.tool.id"
          :tool="skillTools.tool"
          :is-compact="true"
          @buy="handleBuyTool"
        />
      </div>
    </div>

    <!-- Si NO hay herramientas disponibles pero tampoco todos completados -->
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
import { TOOLS_MAP, ALL_TOOLS, TOOLS_BY_SKILL } from '@/data/toolsData'
import { useI18n } from '@/composables/useI18n'
import ToolCard from './ToolCard.vue'

const { t } = useI18n()
const toolsStore = useToolsStore()
const playerStore = usePlayerStore()
const skillsStore = useSkillsStore()

interface SkillToolsGroup {
  skill: Skill
  tool: typeof ALL_TOOLS[0]
  blockReasons: string[]
}

interface SkillCompleted {
  skill: Skill
  toolCount: number
}

/**
 * Calcular IDs de herramientas compradas (considerando que si T2 está equipada, T1 también fue comprada)
 */
const purchasedToolIds = computed((): Set<string> => {
  const ids = new Set<string>()

  // 1. Agregar herramientas del inventario
  toolsStore.inventoryTools.forEach(tool => {
    ids.add(tool.id)
  })

  // 2. Agregar herramientas equipadas Y todas las anteriores del mismo skill
  Object.entries(toolsStore.equippedTools).forEach(([skillId, equipped]) => {
    if (equipped) {
      // Agregar la equipada
      ids.add(equipped.toolId)
      
      // Agregar TODAS las herramientas del mismo skill con tier menor
      ALL_TOOLS.forEach(tool => {
        if (tool.skillId === skillId && tool.tier < equipped.tier) {
          ids.add(tool.id)
        }
      })
    }
  })

  return ids
})

/**
 * Obtener la siguiente herramienta SIN COMPRAR para CADA SKILL
 */
const nextToolsBySkill = computed((): SkillToolsGroup[] => {
  const groups: SkillToolsGroup[] = []

  // Para cada skill
  Object.entries(TOOLS_BY_SKILL).forEach(([skillKey, skillTools]) => {
    const skillId = skillKey as Skill

    // Obtener herramientas sin comprar, ordenadas por tier
    const unpurchasedTools = skillTools
      .filter(tool => !purchasedToolIds.value.has(tool.id))
      .sort((a, b) => a.tier - b.tier)

    // Si no hay sin comprar en este skill, omitir
    if (unpurchasedTools.length === 0) {
      return
    }

    // Tomar la PRIMERA sin comprar
    const nextTool = unpurchasedTools[0]
    const playerLevel = skillsStore.skillStates[skillId]?.level || 0
    const playerGold = playerStore.player.gold

    // Calcular razones de bloqueo
    const blockReasons: string[] = []

    if (playerLevel < nextTool.requiredLevel) {
      const levelNeeded = nextTool.requiredLevel - playerLevel
      blockReasons.push(
        `${t('tools.requireLevel') || 'Requiere nivel'} ${nextTool.requiredLevel} ` +
        `(tienes ${playerLevel}, necesitas ${levelNeeded} más)`
      )
    }

    if (playerGold < nextTool.price) {
      const goldNeeded = nextTool.price - playerGold
      blockReasons.push(
        `${t('ui.price') || 'Precio'} ${nextTool.price} 💰 ` +
        `(tienes ${playerGold}, necesitas ${goldNeeded} más)`
      )
    }

    groups.push({
      skill: skillId,
      tool: nextTool,
      blockReasons
    })
  })

  return groups
})

/**
 * Obtener skills donde TODAS las herramientas fueron compradas
 */
const completedSkills = computed((): SkillCompleted[] => {
  const completed: SkillCompleted[] = []

  Object.entries(TOOLS_BY_SKILL).forEach(([skillKey, skillTools]) => {
    const skillId = skillKey as Skill
    
    // Contar cuántas herramientas de este skill están compradas
    const purchasedCount = skillTools.filter(tool => 
      purchasedToolIds.value.has(tool.id)
    ).length
    
    // Si todas las herramientas del skill están compradas
    if (purchasedCount === skillTools.length && skillTools.length > 0) {
      completed.push({
        skill: skillId,
        toolCount: skillTools.length
      })
    }
  })

  return completed
})

/**
 * Verificar si TODAS las herramientas de TODOS los skills fueron compradas
 */
const allToolsPurchased = computed((): boolean => {
  return completedSkills.value.length === Object.keys(TOOLS_BY_SKILL).length
})

const handleBuyTool = (toolId: string) => {
  const tool = TOOLS_MAP[toolId]
  if (!tool) return

  // Validar oro
  if (playerStore.player.gold < tool.price) {
    alert(t('errors.notEnoughGold'))
    return
  }

  // Validar nivel
  const playerLevel = skillsStore.skillStates[tool.skillId]?.level || 0
  if (playerLevel < tool.requiredLevel) {
    alert(`${t('tools.requireLevel')}: ${tool.requiredLevel}`)
    return
  }

  // Comprar
  playerStore.removeGold(tool.price)
  toolsStore.markToolAsPurchased(toolId, tool.skillId)

  // Guardar
  playerStore.saveToStorage()
  toolsStore.saveToStorage()
}
</script>

<style scoped>
.tools-market-section {
  padding: 20px 0;
  border-top: 1px solid var(--border-color);
}

.section-title {
  color: var(--color-primary);
  margin: 0 0 20px;
  font-size: 18px;
  font-weight: 600;
}

.tools-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
}

/* GRUPO POR SKILL - REMOVIDO: Ahora todo es grid compacto */

/* HERRAMIENTA PRINCIPAL */
.main-tool {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.main-tool-title {
  color: var(--color-primary);
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

/* RAZONES POR LAS QUE NO SE PUEDE COMPRAR */
.buy-blocked-reasons {
  padding: 12px;
  background: rgba(255, 85, 85, 0.1);
  border-left: 3px solid var(--color-danger);
  border-radius: 4px;
}

.reasons-title {
  color: var(--color-danger);
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 600;
}

.reasons-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reason-item {
  color: var(--text-secondary);
  font-size: 12px;
  margin: 0;
  padding-left: 16px;
  position: relative;
}

.reason-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-danger);
}

/* PRÓXIMAS HERRAMIENTAS */
.upcoming-tools {
  padding: 12px;
  background: rgba(85, 170, 255, 0.05);
  border-left: 3px solid var(--color-primary);
  border-radius: 4px;
}

.upcoming-title {
  color: var(--color-primary);
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.9;
}

.upcoming-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upcoming-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.upcoming-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.upcoming-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.upcoming-name {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 500;
}

.upcoming-level {
  color: var(--text-secondary);
  font-size: 11px;
}

/* SIN HERRAMIENTAS */
.no-tools {
  text-align: center;
  padding: 40px 20px;
  background: rgba(85, 255, 85, 0.05);
  border: 1px solid rgba(85, 255, 85, 0.2);
  border-radius: 8px;
  color: var(--text-muted);
}

.no-tools p {
  margin: 0;
  font-size: 14px;
}

.no-tools p:first-child {
  color: var(--color-success);
  font-weight: 600;
  font-size: 16px;
}

.no-tools-subtitle {
  margin-top: 8px !important;
  font-size: 12px;
  color: var(--text-secondary);
}

/* TODOS LOS TOOLS COMPLETADOS */
.all-tools-completed {
  text-align: center;
  padding: 40px 20px;
  background: rgba(85, 255, 85, 0.1);
  border: 1px solid var(--color-success);
  border-radius: 8px;
}

.completed-message {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-success);
}
</style>

