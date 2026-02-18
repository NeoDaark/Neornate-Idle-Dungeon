import type { ToolEffectValue } from '@/types/Tool'
import { Skill } from '@/types/Game'

/**
 * Obtiene el nombre genérico del producto según el skill
 * @param skillId - ID del skill
 * @returns Nombre del recurso que produce el skill (e.g., "mineral", "madera", "lingote")
 */
export function getSkillProductName(skillId: Skill): string {
  const productNames: Record<Skill, string> = {
    [Skill.MINERIA]: 'mineral',
    [Skill.TALA]: 'madera',
    [Skill.FUNDICION]: 'lingote',
    [Skill.QUEMADO]: 'carbón',
    [Skill.HERRERIA]: 'arma',
    [Skill.PESCA]: 'pescado',
    [Skill.COCINA]: 'comida',
    [Skill.AVENTURA]: 'botín',
  }
  return productNames[skillId] || 'recurso'
}

/**
 * Renderiza un efecto traducido reemplazando placeholders con valores reales
 * Ejemplo: 'effects.speed' → '-{VALUE}s al ciclo' → '-0.5s al ciclo'
 *
 * Para efectos de quantity con {ITEM}, reemplaza con el nombre del recurso del skill
 *
 * @param effect - Efecto con type y value
 * @param i18nText - Texto traducido con placeholders {VALUE}, {ITEM}
 * @param itemName - Nombre del recurso (opcional, para efectos de quantity)
 * @returns Texto formateado con valores reales
 */
export function formatEffect(
  effect: ToolEffectValue,
  i18nText: string,
  itemName: string = ''
): string {
  let text = i18nText

  // Reemplazar {VALUE} con el valor del efecto
  text = text.replace('{VALUE}', String(effect.value))

  // Reemplazar {ITEM} con el nombre del ítem
  // Si no hay nombre, remover el placeholder dejando solo el número
  if (itemName) {
    text = text.replace('{ITEM}', itemName)
  } else {
    // Remover {ITEM} si no hay nombre (e.g., "+1 {ITEM}" → "+1")
    text = text.replace(' {ITEM}', '').replace('{ITEM}', '')
  }

  return text
}

/**
 * Formatea el dinero a máximo 2 decimales
 * Ejemplo: 1193.679999999998 → 1193.68
 *
 * @param amount - Cantidad de dinero
 * @returns Dinero formateado a 2 decimales
 */
export function formatGold(amount: number): string {
  return parseFloat(amount.toFixed(2)).toLocaleString('es-ES', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Formatea dinero como número (sin formato regional)
 * @param amount - Cantidad de dinero
 * @returns Número con máximo 2 decimales
 */
export function formatGoldSimple(amount: number): number {
  return parseFloat(amount.toFixed(2))
}
