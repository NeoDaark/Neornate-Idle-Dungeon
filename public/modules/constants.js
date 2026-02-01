/* ===================== CONSTANTS ===================== */

export const STATS = ["Fuerza","Destreza","Constitución","Inteligencia","Sabiduría","Carisma"];
export const STAT_SHORT = ["FUE", "DES", "CON", "INT", "SAB", "CAR"];
export const SLOTS = ["arma","armadura","offhand","anillo1","anillo2","amuleto"];

export const RARITIES = [
    {name:"Común", chance:70, mult:1},
    {name:"Raro", chance:20, mult:1.5},
    {name:"Épico", chance:8, mult:2},
    {name:"Legendario", chance:2, mult:3}
];

export const PREFIX = ["Oxidado","Antiguo","Bendito","Maldito"];
export const SUFFIX = ["del Titán","del Sabio","del Ladrón","del Vacío"];

export const DUNGEON_NAMES = [
    "Catacumbas Olvidadas","Fortaleza de Hielo","Templo de las Sombras","Mina Abandonada",
    "Torre Maldita","Cavernas Cristalinas","Refugio de Titanes","Dimensión Rota",
    "Ruinas Ancestrales","Prisión Eterna","Bosque Prohibido","Castillo Sumergido",
    "Volcán Dormido","Biblioteca Perdida","Puerta del Caos","Santuario Oscuro"
];

export const EXPLORE_INTERVAL = 30;

// Clases Base
export const BASE_CLASSES = {
    warrior: { name: "Warrior", stats: { Fuerza: 3, Constitución: 2 } },
    thief: { name: "Thief", stats: { Destreza: 3, Inteligencia: 1 } },
    mage: { name: "Mage", stats: { Inteligencia: 3, Sabiduría: 2 } }
};

// Tiers
export const TIERS = {
    1: {
        classes: { warrior: "Warrior", thief: "Thief", mage: "Mage" },
        costToNext: 0,
        statBonus: 0
    },
    2: {
        classes: { warrior: "Knight", thief: "Assassin", mage: "Sorcerer" },
        costToNext: 100,
        statBonus: 0.1
    },
    3: {
        classes: { warrior: "Paladin", thief: "ShadowMaster", mage: "Archmage" },
        costToNext: 250,
        statBonus: 0.2
    },
    4: {
        costToNext: 500,
        statBonus: 0.3
    },
    5: {
        costToNext: 1000,
        statBonus: 0.4
    }
};


