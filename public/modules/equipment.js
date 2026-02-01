/* ===================== EQUIPMENT SYSTEM ===================== */

import { SLOTS, STATS, RARITIES, PREFIX, SUFFIX } from './constants.js';
import { player, save, random } from './player.js';
import { log } from './logger.js';

export function toggleEquip(idx) {
    const item = player.inventory[idx];
    if(player.equipment[item.slot]?.id === item.id) player.equipment[item.slot] = null;
    else player.equipment[item.slot] = item;
    save();
}

export function dismantle(idx) {
    const item = player.inventory[idx];
    if(player.equipment[item.slot]?.id === item.id) return;
    
    const materialsRecovered = Math.floor((item.upgrade || 0) * 3);
    player.materials += materialsRecovered;
    player.materials += 1;
    
    if(materialsRecovered > 0) {
        log(`♻️ Desmantelado: +${materialsRecovered + 1} materiales (incluye ${materialsRecovered} de ${item.upgrade * 4} usados)`, "loot");
    } else {
        log(`♻️ Desmantelado: +1 material`, "loot");
    }
    
    player.inventory.splice(idx, 1);
    save();
}

export function upgradeEquipped(slot) {
    const eq = player.equipment[slot];
    if(!eq) return;
    if(player.materials < 4) return alert("No tienes suficientes materiales para mejorar.");

    eq.upgrade++;
    player.materials -= 4;
    log(`🔧 ${eq.name} ha sido mejorado +1`, "event");
    save();
}

export function compareItems(idx) {
    const item = player.inventory[idx];
    const equipped = player.equipment[item.slot];
    
    let comparison = `<div style="border-bottom:1px solid #555; padding-bottom:8px; margin-bottom:8px;">`;
    comparison += `<b style="color:#ffa500;">⚔️ COMPARACIÓN DE ${item.slot.toUpperCase()}</b><br><br>`;
    
    comparison += `<div style="display:flex; gap:20px; margin-bottom:10px;">`;
    comparison += `<div style="flex:1;">`;
    comparison += `<b style="color:#55ff55;">📈 Equipado:</b><br>`;
    comparison += `${equipped.name}`;
    comparison += `</div>`;
    
    comparison += `<div style="flex:1;">`;
    comparison += `<b style="color:#55aaff;">🆚 Candidato:</b><br>`;
    comparison += `${item.name}`;
    comparison += `</div>`;
    comparison += `</div>`;
    comparison += `</div>`;
    
    comparison += `<b>Estadísticas (sin mejoras):</b><br>`;
    comparison += `<div style="font-size:12px; line-height:1.6;">`;
    STATS.forEach(s => {
        const eqStat = equipped.stats[s] || 0;
        const itemStat = item.stats[s] || 0;
        const diff = itemStat - eqStat;
        const symbol = diff > 0 ? "📈" : diff < 0 ? "📉" : "→";
        const color = diff > 0 ? "#55ff55" : diff < 0 ? "#ff5555" : "#aaa";
        comparison += `<div style="color:${color};">${s}: ${eqStat} ${symbol} ${itemStat} <b>(${diff > 0 ? '+' : ''}${diff})</b></div>`;
    });
    comparison += `</div>`;
    
    if(equipped.upgrade > 0) {
        comparison += `<div style="border-top:1px solid #555; margin-top:10px; padding-top:10px; font-size:12px; color:#aaa;">`;
        comparison += `<b style="color:#ff9900;">⚠️ Nota:</b> El objeto equipado está mejorado <b style="color:#ffa500;">+${equipped.upgrade}</b><br>`;
        comparison += `Esto añade <b>+${equipped.upgrade}</b> a todos los stats.`;
        comparison += `</div>`;
    }
    
    document.getElementById("popupName").textContent = "Comparación de Equipo";
    document.getElementById("popupDesc").innerHTML = comparison;
    document.getElementById("itemPopup").classList.add("visible");
}

export function generateLoot() {
    let roll = random(1,100);
    let rarity;
    if(roll <= 70 - player.dungeon*5) rarity = RARITIES[0];
    else if(roll <= 90 - player.dungeon*3) rarity = RARITIES[1];
    else if(roll <= 98 - player.dungeon) rarity = RARITIES[2];
    else rarity = RARITIES[3];

    const slot = SLOTS[random(0,SLOTS.length-1)];
    const item = {
        id: Date.now() + "_" + random(0,9999),
        slot,
        rarity:rarity.name,
        upgrade:0,
        stats:Object.fromEntries(STATS.map(s=>[s, Math.floor(random(0,2)*rarity.mult)]))
    };
    item.name = `${PREFIX[random(0,PREFIX.length-1)]} ${slot} ${SUFFIX[random(0,SUFFIX.length-1)]} (${rarity.name})`;
    player.inventory.push(item);
    log(`🎁 Obtienes ${item.name}`, rarity.name==="Legendario"?"rare":"loot");
}
