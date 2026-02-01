/* ===================== PROGRESSION SYSTEM ===================== */

import { player, save } from './player.js';
import { log } from './logger.js';
import { STATS } from './constants.js';
import { xpNeededForLevel } from './stats.js';

export function checkLevelUp() {
    while(player.xp >= xpNeededForLevel(player.level)) {
        player.xp -= xpNeededForLevel(player.level);
        player.level++;
        
        STATS.forEach(s => {
            player.stats[s]++;
        });
        
        log(`🎉 ¡NIVEL ${player.level}! Todos los stats +1`, "rare");
    }
}
