/**
 * toolsStore.ts - Gestión de herramientas de oficios
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Tool, ToolEquipped, ToolBonus } from '@/types/Tool'
import { Skill } from '@/types/Game'
import { TOOLS_BY_SKILL, TOOLS_MAP, ALL_TOOLS } from '@/data/toolsData'
import { useSkillsStore } from './skillsStore'

export const useToolsStore = defineStore('tools', () => {
  // Estado: herramientas equipadas (una por oficio)
  const equippedTools = ref<Record<Skill, ToolEquipped | null>>(
    {
      [Skill.MINERIA]: null,
      [Skill.TALA]: null,
      [Skill.FUNDICION]: null,
      [Skill.HERRERIA]: null,
      [Skill.PESCA]: null,
      [Skill.COCINA]: null,
      [Skill.AVENTURA]: null,
    } as Record<Skill, ToolEquipped | null>,
  )

  // Herramientas compradas pero no equipadas (extras)
  const inventoryTools = ref<Tool[]>([])

  /**
   * Computed: Herramientas disponibles para comprar
   * (Según nivel del jugador en ese oficio)
   */
  const availableTools = computed(() => {
    const skillsStore = useSkillsStore()
    const available: Tool[] = []

    ALL_TOOLS.forEach((tool) => {
      const skillState = skillsStore.skillStates[tool.skillId]
      if (skillState && skillState.level >= tool.requiredLevel) {
        available.push(tool)
      }
    })

    return available
  })

  /**
   * Computed: Herramientas por skill (solo las disponibles)
   */
  const toolsBySkill = computed(() => {
    const result: Record<Skill, Tool[]> = {
      [Skill.MINERIA]: [],
      [Skill.TALA]: [],
      [Skill.FUNDICION]: [],
      [Skill.HERRERIA]: [],
      [Skill.PESCA]: [],
      [Skill.COCINA]: [],
      [Skill.AVENTURA]: [],
    }

    const skillsStore = useSkillsStore()

    Object.entries(TOOLS_BY_SKILL).forEach(([skillKey, tools]) => {
      const skill = skillKey as Skill
      const skillState = skillsStore.skillStates[skill]

      if (skillState) {
        result[skill] = tools.filter((tool) => skillState.level >= tool.requiredLevel)
      }
    })

    return result
  })

  /**
   * Calcular bonificaciones de una herramienta equipada
   */
  const calculateToolBonus = (skillId: Skill): ToolBonus => {
    const equipped = equippedTools.value[skillId]
    if (!equipped) {
      return { speedBonus: 0, quantityBonus: 0, xpBonus: 0, rarityBonus: 0, discountBonus: 0 }
    }

    const bonus: ToolBonus = {
      speedBonus: 0,
      quantityBonus: 0,
      xpBonus: 0,
      rarityBonus: 0,
      discountBonus: 0,
    }

    equipped.effects.forEach((effect) => {
      switch (effect.type) {
        case 'speed':
          bonus.speedBonus = effect.value
          break
        case 'quantity':
          bonus.quantityBonus = effect.value
          break
        case 'xp':
          bonus.xpBonus = effect.value
          break
        case 'rarity':
          bonus.rarityBonus = effect.value
          break
        case 'discount':
          bonus.discountBonus = effect.value
          break
      }
    })

    return bonus
  }

  /**
   * Equipar herramienta (solo si es mejor que la actual)
   */
  const equipTool = (toolId: string, skillId: Skill): boolean => {
    const tool = TOOLS_MAP[toolId]
    if (!tool) return false

    const currentEquipped = equippedTools.value[skillId]

    // Si ya hay equipada y la nueva es peor, no equipar
    if (currentEquipped && tool.tier < currentEquipped.tier) {
      // Agregar al inventario de extras
      inventoryTools.value.push(tool)
      return false
    }

    // Desquipar anterior si existe
    if (currentEquipped) {
      inventoryTools.value.push(TOOLS_MAP[currentEquipped.toolId])
    }

    // Equipar nueva
    equippedTools.value[skillId] = {
      toolId: tool.id,
      skillId: tool.skillId,
      tier: tool.tier,
      equippedAt: Date.now(),
      effects: [...tool.effects],
    }

    return true
  }

  /**
   * Comprar herramienta desde el mercado
   */
  const buyTool = (toolId: string, skillId: Skill): boolean => {
    const tool = TOOLS_MAP[toolId]
    if (!tool) return false

    // Verificar si puede comprar (será validado en MarketView con playerStore)
    // Solo equipar
    return equipTool(toolId, skillId)
  }

  /**
   * Obtener herramienta equipada en un skill
   */
  const getEquippedTool = (skillId: Skill): Tool | null => {
    const equipped = equippedTools.value[skillId]
    if (!equipped) return null
    return TOOLS_MAP[equipped.toolId] || null
  }

  /**
   * Verificar si herramienta está disponible para comprar
   */
  const isToolAvailable = (toolId: string): boolean => {
    const skillsStore = useSkillsStore()
    const tool = TOOLS_MAP[toolId]
    if (!tool) return false

    const skillState = skillsStore.skillStates[tool.skillId]
    return skillState ? skillState.level >= tool.requiredLevel : false
  }

  /**
   * Obtener próxima herramienta a desbloquear para un skill
   */
  const getNextTool = (skillId: Skill): Tool | null => {
    const tools = TOOLS_BY_SKILL[skillId as Skill] || []
    const skillsStore = useSkillsStore()
    const skillState = skillsStore.skillStates[skillId]

    if (!skillState) return null

    // Encontrar la primera que NO esté disponible aún
    for (const tool of tools) {
      if (skillState.level < tool.requiredLevel) {
        return tool
      }
    }

    return null
  }

  /**
   * Cargar estado desde localStorage
   */
  const loadFromStorage = () => {
    const saved = localStorage.getItem('tools_equipped')
    if (saved) {
      try {
        equippedTools.value = JSON.parse(saved)
      } catch (e) {
        console.error('Error loading tools from storage:', e)
      }
    }

    const savedInventory = localStorage.getItem('tools_inventory')
    if (savedInventory) {
      try {
        inventoryTools.value = JSON.parse(savedInventory)
      } catch (e) {
        console.error('Error loading tool inventory from storage:', e)
      }
    }
  }

  /**
   * Guardar estado a localStorage
   */
  const saveToStorage = () => {
    localStorage.setItem('tools_equipped', JSON.stringify(equippedTools.value))
    localStorage.setItem('tools_inventory', JSON.stringify(inventoryTools.value))
  }

  return {
    // Estado
    equippedTools,
    inventoryTools,

    // Computed
    availableTools,
    toolsBySkill,

    // Métodos
    equipTool,
    buyTool,
    calculateToolBonus,
    getEquippedTool,
    isToolAvailable,
    getNextTool,
    loadFromStorage,
    saveToStorage,
  }
})
