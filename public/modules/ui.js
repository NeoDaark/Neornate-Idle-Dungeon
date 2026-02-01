/* ===================== UI RENDERING ===================== */

import { player, countdown, currentDungeonLog } from './player.js';
import { STATS, STAT_SHORT, SLOTS } from './constants.js';
import { maxHp, statTotal, getStatBreakdown, xpNeededToNextLevel } from './stats.js';

export function renderPlayerInfo() {
    if(!player) return;
    
    const pName = document.getElementById("pName");
    const hp = document.getElementById("hp");
    const maxHpEl = document.getElementById("maxHp");
    const lvl = document.getElementById("lvl");
    const xp = document.getElementById("xp");
    const xpNeeded = document.getElementById("xpNeeded");
    const currentJob = document.getElementById("currentJob");
    const playerMoney = document.getElementById("playerMoney");
    const playerMaterials = document.getElementById("playerMaterials");
    
    if(pName) pName.textContent = player.name;
    if(hp) hp.textContent = player.hp;
    if(maxHpEl) maxHpEl.textContent = maxHp();
    if(lvl) lvl.textContent = player.level;
    if(xp) xp.textContent = player.xp;
    if(xpNeeded) xpNeeded.textContent = xpNeededToNextLevel();
    if(currentJob) currentJob.textContent = player.currentJob || "Ninguno";
    if(playerMoney) playerMoney.textContent = player.money || 0;
    if(playerMaterials) playerMaterials.textContent = player.materials || 0;
}

export function renderStats() {
    if(!player) return;
    
    const statsDiv = document.getElementById("stats");
    if(!statsDiv) return;
    
    statsDiv.innerHTML =
        `<div style="font-family: monospace; font-size:13px;">` +
        STATS.map((s, idx)=>{
            const breakdown = getStatBreakdown(s);
            const short = STAT_SHORT[idx];
            const baseHTML = breakdown.bonus > 0 ? `<span class="stat-base">${String(breakdown.base).padStart(2)}</span>` : `<span class="stat-base">${String(breakdown.total).padStart(2)}</span>`;
            const bonusHTML = breakdown.bonus > 0 ? `<span style="color:#55ff55;">+${String(breakdown.bonus).padStart(2)}</span>` : '';
            const equalHTML = breakdown.bonus > 0 ? `<span style="color:#aaa;">=</span>` : '';
            const totalHTML = breakdown.bonus > 0 ? `<b style="color:#55aaff;">${String(breakdown.total).padStart(2)}</b>` : '';
            return `<div style="display:flex; gap:5px; align-items:center; margin-bottom:2px;">
                <span style="width:30px;">${short}</span>
                <span style="width:20px; text-align:right;">${baseHTML}</span>
                <span style="width:30px; text-align:right;">${bonusHTML}</span>
                <span style="width:10px; text-align:center;">${equalHTML}</span>
                <span style="width:20px; text-align:right;">${totalHTML}</span>
            </div>`;
        }).join("") +
        `</div>`;
}

export function renderEquipment() {
    if(!player) return;
    
    const equipmentDiv = document.getElementById("equipment");
    if(!equipmentDiv) return;
    
    let html = `<div>`;
    
    SLOTS.forEach(slot => {
        const eq = player.equipment[slot];
        if(eq) {
            // Obtener sprite aleatorio del archivo de items
            const itemSpriteRow = Math.floor(Math.random() * 10);
            const itemSpriteCol = Math.floor(Math.random() * 10);
            const spriteX = itemSpriteCol * 16;
            const spriteY = itemSpriteRow * 16;
            
            html += `<div class="equipment-slot">
                <img class="equipment-sprite" src="oryx/oryx_16bit_fantasy_items_trans.png" 
                     style="object-position: -${spriteX}px -${spriteY}px; object-fit: none; width:32px; height:32px;">
                <div class="equipment-info">
                    <div class="equipment-name">${eq.name}</div>
                    <div class="equipment-stats">
                        Ranura: <b>${slot}</b>`;
            if(eq.upgrade > 0) html += ` | Mejorado: <b style="color:#ffa500;">+${eq.upgrade}</b>`;
            html += `</div>
                </div>
                <button onclick="upgradeEquipped('${slot}')" style="padding:6px 10px; font-size:11px;">🔧</button>
            </div>`;
        } else {
            html += `<div class="equipment-slot" style="opacity:0.5; border-style:dashed;">
                <div style="width:32px; height:32px; background:#333; border-radius:2px;"></div>
                <div class="equipment-info">
                    <div style="color:#666;">Ranura vacía: <b>${slot}</b></div>
                </div>
            </div>`;
        }
    });
    
    html += `</div>`;
    equipmentDiv.innerHTML = html;
}

export function renderInventory() {
    if(!player) return;
    
    const inventoryDiv = document.getElementById("inventory");
    if(!inventoryDiv) return;
    
    let html = `<div>`;
    
    if(!player.inventory || player.inventory.length === 0) {
        html += `<div style="text-align:center; color:#666; padding:20px;">
            El inventario está vacío
        </div>`;
    } else {
        // Agrupar productos por tipo
        const grouped = {};
        player.inventory.forEach(item => {
            if(!grouped[item.name]) {
                grouped[item.name] = { ...item, quantity: 0 };
            }
            grouped[item.name].quantity = (grouped[item.name].quantity || 0) + (item.quantity || 1);
        });
        
        Object.entries(grouped).forEach(([name, item]) => {
            const iconMap = {
                "Mineral": "⛏️",
                "Pez": "🎣",
                "Estofado": "🍳",
                "Sopa": "🍳",
                "Filete": "🍳",
                "Poción": "🧪",
                "Espada": "⚔️",
                "Daga": "🗡️",
                "Hacha": "🪓",
                "Cristal": "💎"
            };
            
            let icon = "📦";
            for(let key in iconMap) {
                if(item.name.includes(key)) {
                    icon = iconMap[key];
                    break;
                }
            }
            
            html += `<div style="background:#1a1a1a; border:1px solid #333; border-radius:4px; padding:10px; margin-bottom:8px;">
                <div style="display:flex; gap:10px; align-items:center; justify-content:space-between;">
                    <div style="display:flex; gap:10px; align-items:center; flex:1;">
                        <div style="font-size:24px;">${icon}</div>
                        <div style="flex:1;">
                            <b style="color:#ffa500;">${item.name}</b>
                            <div style="font-size:11px; color:#888; margin-top:2px;">
                                ${item.healing ? `❤️ Sanación: +${item.healing}` : ''}
                                ${item.bonus ? `✨ ${item.bonus}` : ''}
                            </div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:16px; font-weight:bold; color:#55ff55;">x${item.quantity}</div>
                        <div style="font-size:11px; color:#888;">💰 ${item.quantity * (item.sellPrice || 50)}</div>
                    </div>
                </div>
            </div>`;
        });
    }
    
    html += `</div>`;
    inventoryDiv.innerHTML = html;
}

export function renderLog() {
    if(!currentDungeonLog) return;
    const logDiv = document.getElementById("log");
    if(!logDiv) return;
    
    logDiv.innerHTML = currentDungeonLog.map(entry => 
        `<div style="color:${entry.color};">${entry.text}</div>`
    ).join("");
    logDiv.scrollTop = logDiv.scrollHeight;
}

export function renderDungeons() {
    const dungeonList = document.getElementById("dungeonList");
    if(!dungeonList) return;
    
    let html = `<div>`;
    
    for(let i = 1; i <= player.completedDungeons + 1; i++) {
        const dungeonNames = JSON.parse(localStorage.getItem("dungeonNames")) || {};
        const dungeonName = dungeonNames[i] || `Mazmorra ${i}`;
        const isCurrentDungeon = i === player.dungeon;
        const isCompleted = i <= player.completedDungeons;
        
        let status = "";
        if(isCurrentDungeon) status = "🔴 Actual";
        else if(isCompleted) status = "✅ Completada";
        else status = "🔒 Bloqueada";
        
        html += `<div class="item" style="padding:8px; margin:5px 0; border:1px solid #444; border-radius:3px;">
            <b>${dungeonName}</b><br>
            <span style="color:#aaa; font-size:12px;">${status}</span>
        </div>`;
    }
    
    html += `</div>`;
    dungeonList.innerHTML = html;
}

export function renderJobs() {
    const jobsList = document.getElementById("jobsList");
    if(!jobsList) return;
    
    // Importar jobs dinámicamente para acceder a currentJob y jobProgress
    import('./jobs.js').then(jobsModule => {
        const SKILLS = jobsModule.SKILLS;
        const currentJob = jobsModule.currentJob;
        const jobProgress = jobsModule.jobProgress;
        const getSkillLevel = jobsModule.getSkillLevel;
        const hasRequiredMaterials = jobsModule.hasRequiredMaterials;
        const expandedJobs = window.expandedJobs || {}; // Obtener estado de expandidos
        
        let html = `<div>`;
        
        // Mostrar trabajo actual si existe
        const jobDisplay = document.getElementById("currentJobDisplay");
        if(currentJob && jobDisplay) {
            jobDisplay.style.display = "block";
            const skill = SKILLS[currentJob];
            const duration = skill.duration;
            const percent = ((duration - jobProgress) / duration) * 100;
            
            document.getElementById("currentJobName").textContent = skill.name;
            document.getElementById("jobProgressBar").style.width = percent + "%";
            document.getElementById("jobTimeLeft").textContent = `${Math.ceil(jobProgress)}s`;
        } else if(jobDisplay) {
            jobDisplay.style.display = "none";
        }
        
        // Listar oficios disponibles
        Object.entries(SKILLS).forEach(([key, skill]) => {
            const skillLevel = getSkillLevel(key);
            const isActive = key === currentJob;
            const isExpanded = expandedJobs[key] || false;
            
            // Determinar productos a mostrar (con categorías o sin)
            let productsToShow = [];
            let hasCategories = skill.categories && Object.keys(skill.categories).length > 0;
            
            if(hasCategories) {
                // Para oficios con categorías (como Herrería), concatenar todos los productos
                Object.values(skill.categories).forEach(category => {
                    productsToShow = productsToShow.concat(category.products);
                });
            } else {
                productsToShow = skill.products || [];
            }
            
            // Encontrar el producto disponible más alto
            const availableProducts = productsToShow.filter(p => skillLevel >= p.level);
            const nextProduct = availableProducts.length > 0 
                ? availableProducts[availableProducts.length - 1] 
                : productsToShow[0];
            
            const nextLevel = productsToShow.find(p => p.level > skillLevel);
            const progressText = nextLevel ? `Próx: Lvl ${nextLevel.level} - ${nextLevel.name}` : "Máximo nivel";
            
            html += `<div style="background:${isActive ? '#2a2a2a' : '#1a1a1a'}; border:${isActive ? '2px solid #ffa500' : '1px solid #333'}; border-radius:4px; padding:10px;">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px; cursor:pointer;" onclick="toggleJobExpanded('${key}')">
                    <div style="flex:1;">
                        <b style="font-size:14px;">${skill.name}</b>
                        <div style="font-size:11px; color:#aaa; margin-top:2px;">Nivel: <b style="color:#ffa500;">${Math.floor(skillLevel)}</b></div>
                        <div style="font-size:12px; color:#aaa; margin-top:3px;">${skill.description}</div>
                        <div style="font-size:11px; color:#88ff88; margin-top:3px;">${progressText}</div>
                    </div>
                    <div style="text-align:right; font-size:11px; color:#aaa;">
                        ⏱️ ${skill.duration}s<br>
                        📦 ${nextProduct.name}
                    </div>
                </div>
                <div style="display:${isExpanded ? 'block' : 'none'}; background:#0e0e0e; border-top:1px solid #333; padding:10px; margin-top:10px;">
                    <div style="margin-bottom:10px;">
                        <b style="color:#ffa500;">${hasCategories ? 'Categorías de Fabricación' : 'Productos Disponibles'}:</b>
                    </div>`;
            
            if(hasCategories) {
                // Mostrar categorías con sus productos
                Object.entries(skill.categories).forEach(([catKey, category]) => {
                    html += `<div style="margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:10px;">
                        <div style="background:#1a1a1a; border:1px solid #555; border-radius:3px; padding:8px; margin-bottom:8px;">
                            <b style="color:#88ff88; font-size:12px;">${category.emoji} ${category.name}</b>
                        </div>`;
                    
                    // Mostrar productos de esta categoría (máximo 3 más recientes disponibles)
                    const catAvailable = category.products.filter(p => skillLevel >= p.level);
                    catAvailable.slice(-3).reverse().forEach((product, idx) => {
                        const isNewest = idx === 0;
                        const hasMaterials = hasRequiredMaterials(product);
                        const materialStatus = product.input ? (hasMaterials ? '✅' : '❌') : '';
                        html += `<div style="background:${isNewest ? '#1a1a1a' : '#0a0a0a'}; border:1px solid ${isNewest ? '#ffa500' : '#333'}; border-radius:3px; padding:8px; margin-bottom:6px; opacity:${hasMaterials || !product.input ? '1' : '0.6'};">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                                <b style="color:${isNewest ? '#ffa500' : '#aaa'};">${product.name} ${materialStatus}</b>
                                <span style="font-size:10px; color:#888;">Nivel ${product.level}</span>
                            </div>
                            <div style="font-size:10px; color:#55ff55; margin-bottom:6px;">
                                ✨ +${product.xp} XP | 📦 x${product.quantity} | 🔨 ${product.inputQty}x ${product.input} | 💰 $${skill.sellPrice(skillLevel)} c/u
                            </div>
                            <button onclick="startJobWithProduct('${key}', '${product.name}')" ${isActive || !hasMaterials ? 'disabled' : ''} style="width:100%; padding:4px; font-size:10px; background:${hasMaterials || !product.input ? '#1a4a1a' : '#4a1a1a'}; color:${hasMaterials || !product.input ? '#55ff55' : '#ff5555'}; border:1px solid ${hasMaterials || !product.input ? '#55ff55' : '#ff5555'}; border-radius:2px; cursor:pointer;">
                                ${!hasMaterials && product.input ? '❌ Sin materiales' : '▶️ Farmear'}
                            </button>
                        </div>`;
                    });
                    
                    html += `</div>`;
                });
            } else {
                // Mostrar productos normales (para oficios sin categorías)
                availableProducts.slice(-3).reverse().forEach((product, idx) => {
                    const isNewest = idx === 0;
                    const hasMaterials = hasRequiredMaterials(product);
                    const materialStatus = product.input ? (hasMaterials ? '✅' : '❌') : '';
                    html += `<div style="background:${isNewest ? '#1a1a1a' : '#0a0a0a'}; border:1px solid ${isNewest ? '#ffa500' : '#333'}; border-radius:3px; padding:8px; margin-bottom:6px; opacity:${hasMaterials || !product.input ? '1' : '0.6'};">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                            <b style="color:${isNewest ? '#ffa500' : '#aaa'};">${product.name} ${materialStatus}</b>
                            <span style="font-size:10px; color:#888;">Nivel ${product.level}</span>
                        </div>
                        <div style="font-size:10px; color:#55ff55; margin-bottom:6px;">
                            ✨ +${product.xp} XP | 📦 x${product.quantity}
                            ${product.input ? ` | � ${product.inputQty}x ${product.input}` : ''}
                            | �💰 $${skill.sellPrice(skillLevel)} c/u
                            ${product.healing ? ` | ❤️ +${product.healing}` : ''}
                            ${product.bonus ? ` | ${product.bonus}` : ''}
                        </div>
                        <button onclick="startJobWithProduct('${key}', '${product.name}')" ${isActive || (!hasMaterials && product.input) ? 'disabled' : ''} style="width:100%; padding:4px; font-size:10px; background:${(hasMaterials || !product.input) ? '#1a4a1a' : '#4a1a1a'}; color:${(hasMaterials || !product.input) ? '#55ff55' : '#ff5555'}; border:1px solid ${(hasMaterials || !product.input) ? '#55ff55' : '#ff5555'}; border-radius:2px; cursor:pointer;">
                            ${(!hasMaterials && product.input) ? '❌ Sin materiales' : '▶️ Farmear'}
                        </button>
                    </div>`;
                });
            }
            
            html += `</div>
                <div style="margin-top:8px; display:flex; gap:5px;">
                    <button onclick="toggleJobExpanded('${key}')" style="flex:1; padding:6px; font-size:11px; background:#333; cursor:pointer;">
                        ${isExpanded ? '📂 Contraer' : '📂 Expandir'}
                    </button>
                    <button onclick="startJobWithProduct('${key}', '${nextProduct.name}')" ${isActive ? 'disabled' : ''} style="flex:1; padding:6px; font-size:11px; ${isActive ? 'opacity:0.5; cursor:not-allowed;' : 'cursor:pointer; background:#1a4a1a; color:#55ff55; border:1px solid #55ff55;'}">
                        ${isActive ? '⏳ En progreso...' : '▶️ Iniciar'}
                    </button>
                </div>
            </div>`;
        });
        
        html += `</div>`;
        jobsList.innerHTML = html;
    });
}

export function render() {
    if(!player) return;
    renderPlayerInfo();
    renderStats();
    renderEquipment();
    renderInventory();
    renderLog();
    renderDungeons();
    renderJobs();
}
