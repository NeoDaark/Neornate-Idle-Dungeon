/**
 * spriteResolver.ts - Utilidades para resolver rutas de sprites
 * 
 * Convierte IDs de sprites en rutas de archivo o URLs
 */

/**
 * Obtener la ruta de un sprite de árbol
 * @param spriteId ID del sprite (e.g., 'tree_pino')
 * @returns URL importable del sprite
 */
export function getTreeSpritePath(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return `/src/assets/sprites/custom/trees/${spriteId}.png`
}

/**
 * Obtener la ruta de un sprite de tronco/madera
 * @param spriteId ID del sprite (e.g., 'log_pino')
 * @returns URL importable del sprite
 */
export function getLogSpritePath(spriteId: string | undefined): string {
  if (!spriteId) return ''
  return `/src/assets/sprites/custom/loggs/${spriteId}.png`
}

/**
 * Obtener el atributo 'src' correcto para un árbol
 * Úsalo en componentes Vue para <img :src="...">
 */
export function getTreeSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  // Para uso en desarrollo con Vite
  return new URL(`/src/assets/sprites/custom/trees/${spriteId}.png`, import.meta.url).href
}

/**
 * Obtener el atributo 'src' correcto para un tronco/madera
 * Úsalo en componentes Vue para <img :src="...">
 */
export function getLogSpriteUrl(spriteId: string | undefined): string {
  if (!spriteId) return ''
  // Para uso en desarrollo con Vite
  return new URL(`/src/assets/sprites/custom/loggs/${spriteId}.png`, import.meta.url).href
}

/**
 * Resolver el icono de un item (sprite o emoji fallback)
 * Si tiene spriteId, retorna la ruta; si no, retorna el emoji del item
 */
export function resolveItemIcon(spriteId: string | undefined, fallbackEmoji: string): string {
  return spriteId ? getLogSpriteUrl(spriteId) : fallbackEmoji
}

/**
 * Resolver el icono de un árbol (sprite o emoji fallback)
 */
export function resolveTreeIcon(spriteId: string | undefined, fallbackEmoji: string): string {
  return spriteId ? getTreeSpriteUrl(spriteId) : fallbackEmoji
}
