/**
 * spriteMap.ts - Mapeos centralizados de itemId -> spriteId
 * 
 * Evita duplicar datos en el inventario y proporciona una fuente única de verdad
 * para resolver qué sprite mostrar para cada item.
 */

// LOGGING: Maderas (loggs)
// Mapea IDs de productos (madera-*) a sus sprites
export const LOG_SPRITE_MAP: Record<string, string> = {
  'madera-pino': 'log_pino',
  'madera-abedul': 'log_abedul',
  'madera-abeto': 'log_abeto',
  'madera-nogal': 'log_nogal',
  'madera-caoba': 'log_caoba',
  'madera-ebano': 'log_ebano',
  'madera-teca': 'log_teca',
  'madera-cedro': 'log_cedro',
  'madera-maldito': 'log_maldito',
  'madera-mistico': 'log_mistico',
  'madera-sagrado': 'log_sagrado',
  'madera-primordial': 'log_primordial',
  'madera-dimensional': 'log_dimensional',
  'madera-dragonico': 'log_dragonico',
}

// MINING: Minerales (ores)
export const MINERAL_SPRITE_MAP: Record<string, string> = {
  'carbon': 'ore_coal',
  'cobre': 'ore_copper',
  'hierro': 'ore_iron',
  'plata': 'ore_silver',
  'tungsteno': 'ore_tungsten',
  'oro': 'ore_gold',
  'platino': 'ore_platinum',
  'obsidiana': 'ore_obsidian',
  'cobalto': 'ore_cobalt',
  'mithril': 'ore_mythril',
  'oricalco': 'ore_orichalcum',
  'adamantita': 'ore_adamantite',
  'titanio': 'ore_titanium',
  'draconita': 'ore_dragonite',
}

// SMELTING: Lingotes (ingots)
export const INGOT_SPRITE_MAP: Record<string, string> = {
  'cobre_ingot': 'ingot_copper',
  'hierro_ingot': 'ingot_iron',
  'plata_ingot': 'ingot_silver',
  'tungsteno_ingot': 'ingot_tungsten',
  'oro_ingot': 'ingot_gold',
  'platino_ingot': 'ingot_platinum',
  'obsidiana_ingot': 'ingot_obsidian',
  'cobalto_ingot': 'ingot_cobalt',
  'mithril_ingot': 'ingot_mythril',
  'oricalco_ingot': 'ingot_orichalcum',
  'adamantita_ingot': 'ingot_adamantite',
  'titanio_ingot': 'ingot_titanium',
  'draconita_ingot': 'ingot_dragonite',
}

// WOODBURNING: Carbón (coal) - especial porque viene de madera
export const COAL_SPRITE_MAP: Record<string, string> = {
  'carbon_prod': 'ore_coal', // Carbón producido por Quemado
}

// WOODBURNING: Ceniza (ash)
export const ASH_SPRITE_MAP: Record<string, string> = {
  'ceniza': 'log_ceniza', // Ceniza producida por Quemado
}
