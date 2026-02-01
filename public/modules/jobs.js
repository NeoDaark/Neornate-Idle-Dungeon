/* ===================== JOBS/SKILLS SYSTEM ===================== */

import { player, save } from './player.js';
import { log } from './logger.js';
import { checkLevelUp } from './progression.js';
import { generateLoot } from './equipment.js';
import { random } from './player.js';

// OFICIOS - Basados en Melvor Idle
export const SKILLS = {
    mineria: {
        name: "⛏️ Minería",
        description: "Extraer minerales preciosos",
        type: "resource",
        duration: 40,
        products: [
            { name: "Mineral de Cobre", level: 1, quantity: 1, xp: 15 },
            { name: "Mineral de Estaño", level: 5, quantity: 1, xp: 20 },
            { name: "Mineral de Hierro", level: 10, quantity: 1, xp: 30 },
            { name: "Mineral de Plata", level: 20, quantity: 1, xp: 50 },
            { name: "Mineral de Oro", level: 30, quantity: 1, xp: 80 },
            { name: "Diamante", level: 40, quantity: 1, xp: 120 }
        ],
        sellPrice: (level) => Math.floor(level * 10 + 5)
    },
    
    herreria: {
        name: "🔨 Herrería",
        description: "Forjar armas y armaduras",
        type: "crafting",
        duration: 50,
        requirements: "mineria",
        categories: {
            dagas: {
                name: "Dagas",
                emoji: "🗡️",
                products: [
                    { name: "Daga de Cobre", level: 5, input: "Mineral de Cobre", inputQty: 1, quantity: 1, xp: 25 },
                    { name: "Daga de Estaño", level: 12, input: "Mineral de Estaño", inputQty: 1, quantity: 1, xp: 35 },
                    { name: "Daga de Hierro", level: 18, input: "Mineral de Hierro", inputQty: 1, quantity: 1, xp: 50 },
                    { name: "Daga de Plata", level: 28, input: "Mineral de Plata", inputQty: 1, quantity: 1, xp: 75 },
                    { name: "Daga de Oro", level: 38, input: "Mineral de Oro", inputQty: 1, quantity: 1, xp: 100 }
                ]
            },
            espadas: {
                name: "Espadas",
                emoji: "⚔️",
                products: [
                    { name: "Espada de Cobre", level: 10, input: "Mineral de Cobre", inputQty: 2, quantity: 1, xp: 40 },
                    { name: "Espada de Estaño", level: 15, input: "Mineral de Estaño", inputQty: 2, quantity: 1, xp: 55 },
                    { name: "Espada de Hierro", level: 22, input: "Mineral de Hierro", inputQty: 2, quantity: 1, xp: 70 },
                    { name: "Espada de Plata", level: 32, input: "Mineral de Plata", inputQty: 2, quantity: 1, xp: 95 },
                    { name: "Espada de Oro", level: 42, input: "Mineral de Oro", inputQty: 2, quantity: 1, xp: 130 }
                ]
            },
            hachas: {
                name: "Hachas",
                emoji: "🪓",
                products: [
                    { name: "Hacha de Cobre", level: 8, input: "Mineral de Cobre", inputQty: 2, quantity: 1, xp: 35 },
                    { name: "Hacha de Estaño", level: 16, input: "Mineral de Estaño", inputQty: 2, quantity: 1, xp: 50 },
                    { name: "Hacha de Hierro", level: 25, input: "Mineral de Hierro", inputQty: 3, quantity: 1, xp: 75 },
                    { name: "Hacha de Plata", level: 35, input: "Mineral de Plata", inputQty: 2, quantity: 1, xp: 100 },
                    { name: "Hacha de Oro", level: 45, input: "Mineral de Oro", inputQty: 2, quantity: 1, xp: 140 }
                ]
            },
            martillos: {
                name: "Martillos",
                emoji: "🔨",
                products: [
                    { name: "Martillo de Cobre", level: 12, input: "Mineral de Cobre", inputQty: 3, quantity: 1, xp: 45 },
                    { name: "Martillo de Estaño", level: 20, input: "Mineral de Estaño", inputQty: 3, quantity: 1, xp: 60 },
                    { name: "Martillo de Hierro", level: 28, input: "Mineral de Hierro", inputQty: 3, quantity: 1, xp: 80 },
                    { name: "Martillo de Plata", level: 38, input: "Mineral de Plata", inputQty: 2, quantity: 1, xp: 110 },
                    { name: "Martillo de Oro", level: 48, input: "Mineral de Oro", inputQty: 2, quantity: 1, xp: 150 }
                ]
            }
        },
        products: [], // Mantener array vacío, se llena dinámicamente
        sellPrice: (level) => Math.floor(level * 30 + 50)
    },
    
    pesca: {
        name: "🎣 Pesca",
        description: "Pescar en lagos y ríos mágicos",
        type: "resource",
        duration: 35,
        products: [
            { name: "Pez Común", level: 1, quantity: 2, xp: 10 },
            { name: "Pez de Agua Fría", level: 10, quantity: 2, xp: 25 },
            { name: "Pez Dorado", level: 20, quantity: 1, xp: 40 },
            { name: "Pez Mágico", level: 35, quantity: 1, xp: 80 }
        ],
        sellPrice: (level) => Math.floor(level * 15 + 10)
    },
    
    cocina: {
        name: "🍳 Cocina",
        description: "Cocinar comidas nutritivas",
        type: "crafting",
        duration: 30,
        requirements: "pesca",
        products: [
            { name: "Estofado de Pez", level: 5, input: "Pez Común", inputQty: 1, quantity: 1, xp: 20, healing: 25 },
            { name: "Sopa de Pez Frío", level: 15, input: "Pez de Agua Fría", inputQty: 1, quantity: 1, xp: 40, healing: 50 },
            { name: "Filete Dorado", level: 25, input: "Pez Dorado", inputQty: 1, quantity: 1, xp: 60, healing: 75 },
            { name: "Sopa de Pez Mágico", level: 35, input: "Pez Mágico", inputQty: 1, quantity: 1, xp: 100, healing: 120 }
        ],
        sellPrice: (level) => Math.floor(level * 20 + 15)
    },
    
    alquimia: {
        name: "🧪 Alquimia",
        description: "Crear pociones mágicas",
        type: "crafting",
        duration: 45,
        products: [
            { name: "Poción de Fuerza", level: 10, input: "Mineral de Cobre", inputQty: 2, quantity: 1, xp: 30, bonus: "Fuerza +1" },
            { name: "Poción de Destreza", level: 15, input: "Mineral de Estaño", inputQty: 2, quantity: 1, xp: 40, bonus: "Destreza +1" },
            { name: "Poción de Inteligencia", level: 20, input: "Mineral de Hierro", inputQty: 2, quantity: 1, xp: 50, bonus: "Inteligencia +1" },
            { name: "Poción de Vida", level: 25, input: "Mineral de Plata", inputQty: 1, quantity: 1, xp: 60, healing: 100 }
        ],
        sellPrice: (level) => Math.floor(level * 25 + 20)
    },
    
    aventura: {
        name: "⚔️ Aventura",
        description: "Luchar contra monstruos",
        type: "combat",
        duration: 60,
        products: [
            { name: "Cristal de Bestia", level: 1, quantity: 1, xp: 100, rare: 0.4 }
        ],
        sellPrice: () => 100
    }
};

export let currentJob = null;
export let jobProgress = 0;
export let jobTimer = null;
export let playerSkills = {};

export function setCurrentJob(job) {
    currentJob = job;
}

export function setJobProgress(progress) {
    jobProgress = progress;
}

export function setJobTimer(timer) {
    jobTimer = timer;
}

export function initSkills() {
    if(!playerSkills || Object.keys(playerSkills).length === 0) {
        Object.keys(SKILLS).forEach(skill => {
            playerSkills[skill] = 1;
        });
    }
}

export function getSkillLevel(skill) {
    return playerSkills[skill] || 1;
}

export function hasRequiredMaterials(product) {
    // Verificar si el jugador tiene los materiales necesarios para crafting
    if(!product.input) return true; // Si no tiene input, no requiere materiales
    
    const requiredQty = product.inputQty || 1;
    const hasItem = player.inventory?.find(item => item.name === product.input);
    
    if(!hasItem) return false;
    if(hasItem.quantity < requiredQty) return false;
    
    return true;
}

export function consumeMaterials(product) {
    // Consumir los materiales del inventario
    if(!product.input) return; // Si no tiene input, no consumir nada
    
    const requiredQty = product.inputQty || 1;
    const itemIndex = player.inventory?.findIndex(item => item.name === product.input);
    
    if(itemIndex !== undefined && itemIndex !== -1) {
        player.inventory[itemIndex].quantity -= requiredQty;
        if(player.inventory[itemIndex].quantity <= 0) {
            player.inventory.splice(itemIndex, 1);
        }
    }
}

export function startSkill(skillKey, productName = null) {
    const skill = SKILLS[skillKey];
    if(!skill) return;
    
    // Verificar si el jugador tiene el nivel requerido en el oficio
    const skillLevel = getSkillLevel(skillKey);
    
    if(currentJob) {
        log(`⚠️ Ya estás haciendo un oficio`, "info");
        return;
    }
    
    // Si es crafting, verificar si tiene materiales
    if(skill.type === "crafting") {
        let allProducts = [];
        if(skill.categories) {
            Object.values(skill.categories).forEach(cat => {
                allProducts = allProducts.concat(cat.products);
            });
        } else {
            allProducts = skill.products || [];
        }
        
        // Encontrar el producto (el más nuevo disponible o el especificado)
        let selectedProduct = null;
        if(productName) {
            selectedProduct = allProducts.find(p => p.name === productName && skillLevel >= p.level);
        }
        
        if(!selectedProduct) {
            const availableProducts = allProducts.filter(p => skillLevel >= p.level);
            selectedProduct = availableProducts.length > 0 ? availableProducts[availableProducts.length - 1] : null;
        }
        
        if(!selectedProduct) {
            log(`❌ No tienes nivel suficiente en ${skill.name}`, "info");
            return;
        }
        
        // Verificar materiales
        if(!hasRequiredMaterials(selectedProduct)) {
            log(`❌ No tienes suficientes materiales: ${selectedProduct.inputQty}x ${selectedProduct.input}`, "info");
            return;
        }
        
        // Guardar qué producto se está haciendo para consumir después
        currentJob = skillKey;
        jobProgress = skill.duration;
        skill._currentProduct = selectedProduct; // Guardar producto actual
        
        // Consumir materiales inmediatamente
        consumeMaterials(selectedProduct);
        log(`${skill.name} iniciado: fabricando ${selectedProduct.name}...`, "event");
    } else {
        currentJob = skillKey;
        jobProgress = skill.duration;
        log(`${skill.name} iniciado...`, "event");
    }
    
    // Crear intervalo que cuenta regresivamente
    const timer = setInterval(() => {
        jobProgress--;
        
        if(jobProgress <= 0) {
            clearInterval(timer);
            completeSkill(skillKey);
        }
    }, 1000);
    
    jobTimer = timer;
}

export function completeSkill(skillKey) {
    const skill = SKILLS[skillKey];
    if(!skill) return;
    
    initSkills();
    const skillLevel = getSkillLevel(skillKey);
    
    // Seleccionar producto aleatorio según nivel
    const availableProducts = skill.products.filter(p => skillLevel >= p.level);
    if(availableProducts.length === 0) {
        log(`❌ No tienes nivel suficiente en ${skill.name}`, "info");
        currentJob = null;
        jobProgress = 0;
        return;
    }
    
    const product = availableProducts[availableProducts.length - 1];
    
    // Generar cantidad (algunos productos son raros)
    let quantity = product.quantity;
    if(product.rare && random(1, 100) > (product.rare * 100)) {
        quantity = 0;
    }
    
    // Aplicar XP del oficio (no del jugador)
    playerSkills[skillKey] = skillLevel + (product.xp / 100);
    
    // Obtener dinero por vender el producto
    const money = quantity * skill.sellPrice(skillLevel);
    player.money = (player.money || 0) + money;
    
    // Agregar producto al inventario si es un item
    if(product.healing) {
        player.inventory.push({
            id: Date.now() + "_" + random(0, 9999),
            name: product.name,
            healing: product.healing,
            quantity: quantity
        });
    }
    
    log(`✅ ${skill.name} completado!`, "success");
    log(`📦 x${quantity} ${product.name}`, "loot");
    log(`💰 +${money} Dinero`, "loot");
    log(`✨ ${skill.name} XP: +${product.xp}`, "xp");
    log(`📊 Nivel ${skill.name}: ${Math.floor(playerSkills[skillKey])}`, "event");
    
    currentJob = null;
    jobProgress = 0;
    
    save();
}

export function cancelJob() {
    if(jobTimer) {
        clearInterval(jobTimer);
        jobTimer = null;
    }
    
    log(`❌ Oficio cancelado`, "info");
    currentJob = null;
    jobProgress = 0;
    
    save();
}
