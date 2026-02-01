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
    
    let html = `<div style="margin-bottom:10px;">`;
    
    SLOTS.forEach(slot => {
        const eq = player.equipment[slot];
        if(eq) {
            html += `<div class="item" style="border-bottom:1px solid #333; padding:5px 0;">
                <b>${slot}:</b> ${eq.name}`;
            if(eq.upgrade > 0) html += ` <span style="color:#ffa500;">+${eq.upgrade}</span>`;
            html += `</div>`;
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
    player.inventory.forEach((item, idx) => {
        html += `<div class="item">
            <b>${item.name}</b>`;
        if(item.upgrade > 0) html += ` <span style="color:#ffa500;">+${item.upgrade}</span>`;
        html += `
            <button onclick="toggleEquip(${idx})">Equipar</button>
            <button onclick="compareItems(${idx})">Comparar</button>
            <button onclick="dismantle(${idx})">Desmantelar</button>
        </div>`;
    });
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
