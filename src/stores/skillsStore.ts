import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SkillState, SkillProduct, CycleResult } from '@/types/Skill'
import { Skill, Tier } from '@/types/Game'
import { SKILL_PRODUCTS_MAP, WOODBURNING_DROP_TABLE, LOGGING_PRODUCTS } from '@/data/skillProducts'
import { useToolsStore } from '@/stores/toolsStore'

const TIER_ORDER = [Tier.T1, Tier.T2, Tier.T3, Tier.T4, Tier.T5, Tier.T6, Tier.T7]

/**
 * Inicializar estado de skill con productos
 */
const initializeSkillState = (skill: Skill): SkillState => {
  let skillProducts = SKILL_PRODUCTS_MAP[skill] || {}
  
  // ESPECIAL: Para Quemado, usar los productos de Tala (troncos)
  // porque Quemado quema troncos, no tiene productos propios
  if (skill === Skill.QUEMADO) {
    skillProducts = LOGGING_PRODUCTS
  }
  
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
    [Skill.QUEMADO]: initializeSkillState(Skill.QUEMADO),
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
   * IMPORTANTE: Solo 1 skill puede estar activo a la vez
   * Por eso desactivamos todos los demás automáticamente
   */
  const activateSkill = (skill: Skill, product: SkillProduct, cycleDurationMs: number = 3000) => {
    const state = skillStates.value[skill]
    
    // IMPORTANTE: Resetear cycleEndTime a 0 PRIMERO
    // Esto limpia cualquier ciclo anterior incompleto
    state.cycleEndTime = 0

    // Desactivar todos los otros skills (solo puede haber 1 activo)
    // IMPORTANTE: Limpiar cycleEndTime de TODOS los demás skills
    // (no solo los activos, porque podría haber uno pausado con cycleEndTime guardado)
    Object.entries(skillStates.value).forEach(([otherSkill, otherState]) => {
      if ((otherSkill as unknown as Skill) !== skill) {
        otherState.isActive = false
        otherState.currentProduct = undefined
        otherState.cycleEndTime = 0  // ← Limpiar SIEMPRE, no solo si isActive
        // console.log(`[Skills] Desactivando ${otherSkill} para activar ${skill}`)
      }
    })

    // Aplicar speedBonus de herramienta (restar segundos de duración)
    const toolsStore = useToolsStore()
    const toolBonus = toolsStore.calculateToolBonus(skill)
    let finalDurationMs = cycleDurationMs
    
    if (toolBonus.speedBonus !== 0) {
      // speedBonus es en segundos (negativo = más rápido)
      finalDurationMs = Math.max(500, cycleDurationMs - (toolBonus.speedBonus * 1000))
    }

    const now = Date.now()
    state.isActive = true
    state.currentProduct = product
    state.lastCycleTime = now
    state.cycleEndTime = now + finalDurationMs

    // 🔴 IMPORTANTE: Guardar lastActiveTime INMEDIATAMENTE cuando activas un skill
    // Esto asegura que si haces F5 antes del auto-save, el sistema offline
    // sigue detectando que estabas farmando
    localStorage.setItem('neornate_lastActiveTime', now.toString())
  }

  /**
   * Desactivar un skill
   * @param skill - Skill a desactivar
   * @param preserveCycleTime - Si true, preserva cycleEndTime (útil cuando se deactiva por materiales insuficientes)
   */
  const deactivateSkill = (skill: Skill, preserveCycleTime: boolean = false) => {
    const state = skillStates.value[skill]
    state.isActive = false
    
    // Solo limpiar currentProduct si NO preservamos cycleTime
    // Si preservamos cycleTime, necesitamos mantener currentProduct para cuando haya materiales
    if (!preserveCycleTime) {
      state.currentProduct = undefined
    }
    
    if (!preserveCycleTime) {
      state.cycleEndTime = 0
    }
  }

  /**
   * Completar un ciclo de skill
   * Retorna los resultados (XP y item generado)
   */
  const completeCycle = (skill: Skill, inventoryStore?: any, resetCycleEndTime: boolean = true): CycleResult | null => {
    const state = skillStates.value[skill]

    if (!state.currentProduct || state.cycleEndTime === 0) {
      return null
    }

    // ⚠️ IMPORTANTE: inventoryStore es obligatorio para procesar ciclos
    if (!inventoryStore) {
      console.error(`[Skill] completeCycle(${skill}): inventoryStore is UNDEFINED! No se puede procesar ciclo.`)
      return null
    }

    const product = state.currentProduct
    
    // Obtener bonus de herramienta equipada para este skill (ANTES de calcular XP)
    const toolsStore = useToolsStore()
    const toolBonus = toolsStore.calculateToolBonus(skill)
    
    // Calcular XP con bonus de herramienta
    let xpGained = product.xpReward
    if (toolBonus.xpBonus > 0) {
      xpGained = Math.floor(product.xpReward * (1 + toolBonus.xpBonus))
    }

    addExperience(skill, xpGained)

    // Consumir materiales si los requiere
    if (inventoryStore && product.requiredMaterials && product.requiredMaterials.length > 0) {
      // Validar que tenemos todos los materiales
      for (const material of product.requiredMaterials) {
        const available = inventoryStore.getItemQuantity(material.itemId)
        if (available < material.quantity) {
          console.warn(`[Skill] No hay suficientes materiales para ${product.id}: necesita ${material.quantity} de ${material.itemId}, tiene ${available}`)
          return null
        }
      }
      
      // Consumir todos los materiales
      for (const material of product.requiredMaterials) {
        const success = inventoryStore.removeItem(material.itemId, material.quantity)
        if (!success) {
          console.error(`[Skill] Error al consumir ${material.quantity} de ${material.itemId}`)
          return null
        }
      }
    }

    // Procesar Quemado PRIMERO: validar que hay tronco ANTES de hacer cambios
    // Esto evita consumir tronco si algo falla después
    if (skill === Skill.QUEMADO) {
      const currentProduct = state.currentProduct
      if (!currentProduct) {
        console.error(`[Skill] QUEMADO: currentProduct is undefined`)
        return null
      }
      
      // VALIDACIÓN: Verificar que hay tronco disponible
      const troncoDisponible = inventoryStore.getItemQuantity(currentProduct.item.id)
      if (troncoDisponible < 1) {
        console.warn(`[Skill] No hay suficientes troncos para quemar: necesita 1 de ${currentProduct.item.id}`)
        return null
      }
    }

    // Calcular cantidad con bonus de herramienta
    let finalQuantity = product.quantity
    
    // Aplicar bonus de cantidad (aditivo)
    if (toolBonus.quantityBonus > 0) {
      finalQuantity = product.quantity + Math.floor(toolBonus.quantityBonus)
    }

    // Agregar item al inventario si está disponible
    // NOTA: Quemado (Woodburning) no añade items aquí - lo maneja abajo
    if (inventoryStore && skill !== Skill.QUEMADO) {
      inventoryStore.addItem(product.item, finalQuantity)
      // TODO: Implementar rarityBonus (aumentar rarity de items generados)
      // TODO: Implementar discountBonus (descuentos en mercado)
    }

    // Procesar Quemado: consumir tronco AL FINAL del ciclo y generar drops
    // Se consume DESPUÉS de validar materiales y calcular drops
    if (skill === Skill.QUEMADO) {
      const currentProduct = state.currentProduct
      if (!currentProduct) {
        console.error(`[Skill] QUEMADO: currentProduct is undefined`)
        return null
      }
      
      // CONSUMIR el tronco (ya fue validado arriba)
      const success = inventoryStore.removeItem(currentProduct.item.id, 1)
      if (!success) {
        console.error(`[Skill] Error inesperado: no se pudo consumir tronco para quemar`)
        return null
      }
      
      // Log para verificar consumo (descomenta para debugging)
      // console.log(`[Skill] QUEMADO: Tronco consumido (${currentProduct.item.id}), inventario restante: ${inventoryStore.getItemQuantity(currentProduct.item.id)}`)

      // Generar drops por probabilidad
      const roll = Math.random()
      const carbonChance = WOODBURNING_DROP_TABLE.carbon.chance
      const ashChance = WOODBURNING_DROP_TABLE.ceniza.chance
      
      if (roll < carbonChance) {
        // Carbón (40%)
        inventoryStore.addItem(WOODBURNING_DROP_TABLE.carbon.item, WOODBURNING_DROP_TABLE.carbon.quantity)
      } else if (roll < carbonChance + ashChance) {
        // Ceniza (20%)
        inventoryStore.addItem(WOODBURNING_DROP_TABLE.ceniza.item, WOODBURNING_DROP_TABLE.ceniza.quantity)
      }
      // 40% probabilidad de no obtener nada
    }

    // Resetear ciclo solo si se especifica (para no resetear en farmeo offline)
    if (resetCycleEndTime) {
      state.cycleEndTime = 0
    }
    // NO actualizar lastCycleTime aquí - solo activateSkill lo debe hacer

    return {
      skill,
      xpGained,
      product: product.item,
      quantity: finalQuantity,
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
          currentProductId: state.currentProduct?.id || undefined, // ← Guardar solo el ID
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
            
            // IMPORTANTE: Siempre preservar cycleEndTime si existe
            // El procesamiento offline usará este valor para calcular ciclos completados
            // calculateOfflineProgress() es responsable de decidir si procesarlos o no
            const savedCycleEndTime = loadedData.cycleEndTime ?? 0
            
            if (savedCycleEndTime > 0) {
              // Preservar cycleEndTime tal como se guardó
              // Esto permite que calculateOfflineProgress calcule correctamente
              skillStates.value[skill].cycleEndTime = savedCycleEndTime
              // console.log(`[Skills] Skill ${skill}: cycleEndTime restaurado de localStorage (${savedCycleEndTime})`)
            } else {
              // No hay cycleEndTime guardado
              skillStates.value[skill].cycleEndTime = 0
            }
            
            if (loadedData.currentProductId) {
              // Buscar el producto en la lista cargada usando el ID guardado
              skillStates.value[skill].currentProduct = skillStates.value[skill].products.find(
                p => p.id === loadedData.currentProductId
              )
              if (!skillStates.value[skill].currentProduct) {
                console.warn(`[Skills] No se encontró producto con ID ${loadedData.currentProductId} para ${skill}`)
                // Fallback: Si hay cycleEndTime pero no encontramos el producto, usar el primero disponible
                if (savedCycleEndTime > 0 && skillStates.value[skill].products.length > 0) {
                  console.warn(`[Skills] Usando fallback: primer producto disponible para ${skill}`)
                  skillStates.value[skill].currentProduct = skillStates.value[skill].products[0]
                }
              }
            } else if (savedCycleEndTime > 0 && skillStates.value[skill].products.length > 0) {
              // Si hay cycleEndTime pero no hay currentProductId guardado, usar el primer producto
              console.warn(`[Skills] No hay currentProductId pero hay cycleEndTime para ${skill}, usando fallback`)
              skillStates.value[skill].currentProduct = skillStates.value[skill].products[0]
            }
          }
        })
      }
    } catch (error) {
      console.error('Error cargando skills:', error)
    }
  }

  /**
   * Resetear store a su estado inicial
   */
  const reset = () => {
    skillStates.value = {
      [Skill.MINERIA]: initializeSkillState(Skill.MINERIA),
      [Skill.TALA]: initializeSkillState(Skill.TALA),
      [Skill.FUNDICION]: initializeSkillState(Skill.FUNDICION),
      [Skill.QUEMADO]: initializeSkillState(Skill.QUEMADO),
      [Skill.HERRERIA]: initializeSkillState(Skill.HERRERIA),
      [Skill.PESCA]: initializeSkillState(Skill.PESCA),
      [Skill.COCINA]: initializeSkillState(Skill.COCINA),
      [Skill.AVENTURA]: initializeSkillState(Skill.AVENTURA),
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
    reset,
  }
})
