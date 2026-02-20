/**
 * spriteResolver.ts - Utilidades para resolver rutas de sprites
 * 
 * Convierte IDs de sprites en URLs correctas para uso en componentes Vue.
 * NOTA: Preferir usar IconSprite.vue o spriteMap.ts en su lugar.
 */

/**
 * Obtener la URL correcta para un sprite de árbol
 * @param spriteId ID del sprite (e.g., 'tree_pino')
 * @returns URL del sprite para usar en <img :src="...">
 */
export function getTreeSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return new URL(`../../assets/sprites/custom/trees/${spriteId}.png`, import.meta.url).href
}

/**
 * Obtener la URL correcta para un sprite de tronco/madera
 * @param spriteId ID del sprite (e.g., 'log_pino')
 * @returns URL del sprite para usar en <img :src="...">
 */
export function getLogSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return new URL(`../../assets/sprites/custom/loggs/${spriteId}.png`, import.meta.url).href
}

/**
 * Obtener la URL correcta para un sprite de mineral
 * @param spriteId ID del sprite (e.g., 'ore_copper')
 * @returns URL del sprite para usar en <img :src="...">
 */
export function getMineralSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return new URL(`../../assets/sprites/custom/ores/${spriteId}.png`, import.meta.url).href
}

/**
 * Obtener la URL correcta para un sprite de lingote
 * @param spriteId ID del sprite (e.g., 'ingot_copper')
 * @returns URL del sprite para usar en <img :src="...">
 */
export function getIngotSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return new URL(`../../assets/sprites/custom/ingots/${spriteId}.png`, import.meta.url).href
}

/**
 * Resolver el icono de un item (sprite o emoji fallback)
 * Si tiene spriteId, retorna la ruta; si no, retorna el emoji del item
 * 
 * @deprecated Preferir usar IconSprite.vue en su lugar
 */
export function resolveItemIcon(spriteId: string | undefined, fallbackEmoji: string): string {
  return spriteId ? getLogSpriteUrl(spriteId) : fallbackEmoji
}

/**
 * Resolver el icono de un árbol (sprite o emoji fallback)
 * 
 * @deprecated Preferir usar IconSprite.vue en su lugar
 */
export function resolveTreeIcon(spriteId: string | undefined, fallbackEmoji: string): string {
  return spriteId ? getTreeSpriteUrl(spriteId) : fallbackEmoji
}
