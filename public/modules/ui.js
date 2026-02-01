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
    
    if(pName) pName.textContent = player.name;
    if(hp) hp.textContent = player.hp;
    if(maxHpEl) maxHpEl.textContent = maxHp();
    if(lvl) lvl.textContent = player.level;
    if(xp) xp.textContent = player.xp;
    if(xpNeeded) xpNeeded.textContent = xpNeededToNextLevel();
    if(currentJob) currentJob.textContent = player.currentJob || "Ninguno";
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
    
    if(player.inventory.length === 0) {
        html += `<div style="text-align:center; color:#666; padding:20px;">
            El inventario está vacío
        </div>`;
    } else {
        player.inventory.forEach((item, idx) => {
            // Obtener sprite aleatorio del archivo de items
            const itemSpriteRow = Math.floor(Math.random() * 10);
            const itemSpriteCol = Math.floor(Math.random() * 10);
            const spriteX = itemSpriteCol * 16;
            const spriteY = itemSpriteRow * 16;
            
            // Color según raridad
            const rarityColors = {
                "Común": "#aaa",
                "Raro": "#55ff55",
                "Épico": "#cc88ff",
                "Legendario": "#ffa500"
            };
            const rarityColor = rarityColors[item.rarity] || "#aaa";
            
            html += `<div style="background:#1a1a1a; border:1px solid #333; border-radius:4px; padding:10px; margin-bottom:8px;">
                <div style="display:flex; gap:10px; align-items:flex-start;">
                    <img style="object-position: -${spriteX}px -${spriteY}px; object-fit: none; width:32px; height:32px; image-rendering:pixelated; image-rendering:crisp-edges;" 
                         src="oryx/oryx_16bit_fantasy_items_trans.png">
                    <div style="flex:1;">
                        <b style="color:${rarityColor};">${item.name}</b>`;
            if(item.upgrade > 0) html += `<br><span style="color:#ffa500;">Mejorado: +${item.upgrade}</span>`;
            html += `<br><span style="font-size:11px; color:#888;">Ranura: ${item.slot}</span>
                    </div>
                </div>
                <div style="display:flex; gap:5px; margin-top:8px;">
                    <button onclick="toggleEquip(${idx})" style="flex:1; padding:6px; font-size:11px;">📦 Equipar</button>
                    <button onclick="compareItems(${idx})" style="flex:1; padding:6px; font-size:11px;">⚖️ Comparar</button>
                    <button onclick="dismantle(${idx})" style="flex:1; padding:6px; font-size:11px;">♻️ Desmantelar</button>
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

export function render() {
    if(!player) return;
    renderPlayerInfo();
    renderStats();
    renderEquipment();
    renderInventory();
    renderLog();
    renderDungeons();
}
