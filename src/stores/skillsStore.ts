import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SkillState, SkillProduct, CycleResult } from '@/types/Skill'
import { Skill, Tier } from '@/types/Game'
import { SKILL_PRODUCTS_MAP } from '@/data/skillProducts'

const TIER_ORDER = [Tier.T1, Tier.T2, Tier.T3, Tier.T4, Tier.T5, Tier.T6, Tier.T7]

/**
 * Inicializar estado de skill con productos
 */
const initializeSkillState = (skill: Skill): SkillState => {
  const skillProducts = SKILL_PRODUCTS_MAP[skill] || {}
  const products = Object.values(skillProducts)
  
  return {
    skill,
    level: 1,
    experience: 0,
    totalExperience: 0,
    tier: Tier.T1,
    isActive: false,
    autoComplete: false,
    lastCycleTime: 0,
    cycleEndTime: 0,
    currentProduct: undefined,
    products,
  }
}

export const useSkillsStore = defineStore('skills', () => {
  // Estado: un SkillState por cada oficio
  const skillStates = ref<Record<Skill, SkillState>>({
    [Skill.MINERIA]: initializeSkillState(Skill.MINERIA),
    [Skill.TALA]: initializeSkillState(Skill.TALA),
    [Skill.FUNDICION]: initializeSkillState(Skill.FUNDICION),
    [Skill.HERRERIA]: initializeSkillState(Skill.HERRERIA),
    [Skill.PESCA]: initializeSkillState(Skill.PESCA),
    [Skill.COCINA]: initializeSkillState(Skill.COCINA),
    [Skill.AVENTURA]: initializeSkillState(Skill.AVENTURA),
  })

  /**
   * Computed: Calcular XP requerido para siguiente nivel
   * Fórmula: 100 + (nivel × 50) + (tier × 300)
   */
  const getNextLevelXP = (skill: Skill): number => {
    const state = skillStates.value[skill]
    const tierIndex = TIER_ORDER.indexOf(state.tier)
    const tierNumber = tierIndex + 1
    return 100 + state.level * 50 + tierNumber * 300
  }

  /**
   * Computed: Progreso de XP para un skill (porcentaje)
   */
  const getXPProgress = (skill: Skill): number => {
    const state = skillStates.value[skill]
    const required = getNextLevelXP(skill)
    return Math.round((state.experience / required) * 100)
  }

  /**
   * Computed: Todos los skills con su estado
   */
  const allSkills = computed(() => {
    return Object.values(skillStates.value)
  })

  /**
   * Computed: Skills activos (que están siendo ejecutados)
   */
  const activeSkills = computed(() => {
    return Object.values(skillStates.value).filter((s) => s.isActive)
  })

  /**
   * Obtener estado de un skill
   */
  const getSkillState = (skill: Skill): SkillState => {
    return skillStates.value[skill]
  }

  /**
   * Establecer productos disponibles para un skill
   */
  const setSkillProducts = (skill: Skill, products: SkillProduct[]) => {
    skillStates.value[skill].products = products
  }

  /**
   * Ganar XP en un skill
   */
  const addExperience = (skill: Skill, xpAmount: number) => {
    const state = skillStates.value[skill]
    state.experience += xpAmount
    state.totalExperience += xpAmount

    // Manejar level-ups automáticos
    while (state.experience >= getNextLevelXP(skill) && state.level < 120) {
      state.experience -= getNextLevelXP(skill)
      levelUp(skill)
    }

    // Sanity check para T7
    if (state.tier === Tier.T7 && state.level > 120) {
      state.level = 120
      state.experience = 0
    }
  }

  /**
   * Subir de nivel un skill
   */
  const levelUp = (skill: Skill) => {
    const state = skillStates.value[skill]
    if (state.level >= 120) return

    state.level += 1

    // Cambio de tier cada 20 niveles
    const tierIndex = Math.floor((state.level - 1) / 20)
    if (tierIndex < TIER_ORDER.length) {
      state.tier = TIER_ORDER[tierIndex]
    }
  }

  /**
   * Activar un skill (iniciar ciclo)
   */
  const activateSkill = (skill: Skill, product: SkillProduct, cycleDurationMs: number = 3000) => {
    const state = skillStates.value[skill]

    const now = Date.now()
    state.isActive = true
    state.currentProduct = product
    state.lastCycleTime = now
    state.cycleEndTime = now + cycleDurationMs
  }

  /**
   * Desactivar un skill
   */
  const deactivateSkill = (skill: Skill) => {
    const state = skillStates.value[skill]
    state.isActive = false
    state.currentProduct = undefined
    state.cycleEndTime = 0
  }

  /**
   * Completar un ciclo de skill
   * Retorna los resultados (XP y item generado)
   */
  const completeCycle = (skill: Skill, inventoryStore?: any): CycleResult | null => {
    const state = skillStates.value[skill]

    if (!state.currentProduct || state.cycleEndTime === 0) {
      return null
    }

    const product = state.currentProduct
    const xpGained = product.xpReward

    addExperience(skill, xpGained)

    // Agregar item al inventario si está disponible
    if (inventoryStore) {
      inventoryStore.addItem(product.item, product.quantity)
    }

    // Resetear ciclo - el componente decidirá si iniciar otro
    state.cycleEndTime = 0
    // NO actualizar lastCycleTime aquí - solo activateSkill lo debe hacer

    return {
      skill,
      xpGained,
      product: product.item,
      quantity: product.quantity,
      materialsConsumed: product.requiredMaterials || [],
      leveledUp: false, // TODO: detectar si hubo level-up
    }
  }

  /**
   * Alternar auto-complete en un skill
   */
  const toggleAutoComplete = (skill: Skill) => {
    const state = skillStates.value[skill]
    state.autoComplete = !state.autoComplete
  }

  /**
   * Guardar a localStorage (sin productos, ya que se cargan desde skillProducts.ts)
   */
  const saveToLocalStorage = () => {
    try {
      const toSave = Object.entries(skillStates.value).reduce((acc, [skill, state]) => {
        acc[skill] = {
          level: state.level,
          experience: state.experience,
          totalExperience: state.totalExperience,
          tier: state.tier,
          isActive: state.isActive,
          autoComplete: state.autoComplete,
          lastCycleTime: state.lastCycleTime,
          cycleEndTime: state.cycleEndTime,
          currentProduct: state.currentProduct,
        }
        return acc
      }, {} as any)
      localStorage.setItem('neornate_skills', JSON.stringify(toSave))
    } catch (error) {
      console.error('Error guardando skills:', error)
    }
  }

  /**
   * Cargar desde localStorage
   */
  const loadFromLocalStorage = () => {
    try {
      const saved = localStorage.getItem('neornate_skills')
      if (saved) {
        const loaded = JSON.parse(saved)
        
        // Fusionar con estados existentes preservando productos
        Object.keys(skillStates.value).forEach(skillKey => {
          const skill = skillKey as unknown as Skill
          if (loaded[skillKey]) {
            // Solo cargar los campos persistibles
            const loadedData = loaded[skillKey]
            skillStates.value[skill].level = loadedData.level ?? skillStates.value[skill].level
            skillStates.value[skill].experience = loadedData.experience ?? skillStates.value[skill].experience
            skillStates.value[skill].totalExperience = loadedData.totalExperience ?? skillStates.value[skill].totalExperience
            skillStates.value[skill].tier = loadedData.tier ?? skillStates.value[skill].tier
            skillStates.value[skill].isActive = loadedData.isActive ?? false
            skillStates.value[skill].lastCycleTime = loadedData.lastCycleTime ?? 0
            skillStates.value[skill].cycleEndTime = loadedData.cycleEndTime ?? 0
            if (loadedData.currentProduct) {
              // Buscar el producto en la lista cargada
              skillStates.value[skill].currentProduct = skillStates.value[skill].products.find(
                p => p.id === loadedData.currentProduct.id
              )
            }
          }
        })
      }
    } catch (error) {
      console.error('Error cargando skills:', error)
    }
  }

  return {
    // State
    skillStates,

    // Computed
    allSkills,
    activeSkills,

    // Actions
    getSkillState,
    getNextLevelXP,
    getXPProgress,
    setSkillProducts,
    addExperience,
    levelUp,
    activateSkill,
    deactivateSkill,
    completeCycle,
    toggleAutoComplete,
    saveToLocalStorage,
    loadFromLocalStorage,
  }
})
