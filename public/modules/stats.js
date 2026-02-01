/* ===================== STATS & CALCULATIONS ===================== */

import { STATS, SLOTS } from './constants.js';
import { player } from './player.js';

export function maxHp() { 
    return 20 + statTotal("Constitución") * 2; 
}

export function statTotal(stat) {
    let total = player.stats[stat];
    for(let s of SLOTS) {
        if(player.equipment[s]) total += player.equipment[s].stats[stat] || 0;
    }
    return total;
}

export function getStatBreakdown(stat) {
    let base = player.stats[stat];
    let bonus = 0;
    for(let s of SLOTS) {
        if(player.equipment[s]) {
            bonus += (player.equipment[s].stats[stat] || 0) + player.equipment[s].upgrade;
        }
    }
    return {base, bonus, total: base + bonus};
}

export function xpNeededForLevel(level) {
    // Fórmula incremental suave: 50 * level^1.2
    return Math.floor(50 * Math.pow(level, 1.2));
}

export function xpNeededToNextLevel() {
    return xpNeededForLevel(player.level);
}
