/* ===================== COMBAT SYSTEM ===================== */

import { player, save, random, setExploring, setCurrentDungeonLog } from './player.js';
import { log } from './logger.js';
import { statTotal, maxHp } from './stats.js';
import { generateLoot } from './equipment.js';
import { checkLevelUp } from './progression.js';
import { STATS } from './constants.js';

export function combat() {
    // El enemigo escala principalmente con la mazmorra y piso
    const baseEnemyPower = 10 + (player.dungeon * 5) + (player.floor * 2);
    
    let enemy = {
        name: `Enemigo piso ${player.floor}`,
        hp: baseEnemyPower * 2,
        stats: {}
    };
    
    STATS.forEach(s => {
        enemy.stats[s] = Math.max(1, Math.floor(baseEnemyPower * 0.8));
    });

    log(`⚔️ ¡Encuentras a ${enemy.name}!`, "event");

    let round = 0;
    while(player.hp > 0 && enemy.hp > 0 && round < 100) {
        round++;
        
        let playerDmg = Math.max(2, Math.floor(statTotal("Fuerza") * 1.2 + (player.equipment.arma?.stats.Fuerza || 0) - random(0,2)));
        let enemyDmg = Math.max(1, Math.floor(enemy.stats.Fuerza * 0.5 - random(0,2)));

        enemy.hp -= playerDmg;
        player.hp -= enemyDmg;

        log(`💚 ¡Infliges ${playerDmg} daño!`, "loot");
        log(`❤️ Recibes ${enemyDmg} daño`, "combat");

        if(player.hp <= 0) {
            death();
            return;
        }
        
        if(enemy.hp <= 0) {
            let expGained = (player.dungeon * 5) + random(5, 15);
            player.xp += expGained;
            
            // Recuperar 30% de la vida máxima después de cada victoria
            const hpRecovered = Math.floor(maxHp() * 0.3);
            player.hp = Math.min(maxHp(), player.hp + hpRecovered);
            
            log(`✅ ¡VICTORIA! Derrotas a ${enemy.name}`, "success");
            log(`⭐ +${expGained} XP`, "xp");
            log(`💚 +${hpRecovered} Vida`, "loot");
            
            checkLevelUp();
            
            if(random(1,100) > 60) {
                generateLoot();
            } else {
                log(`No hay botín esta vez...`, "info");
            }
            save();
            return;
        }
    }
    
    save();
}

export function statEvent() {
    const s = STATS[random(0,STATS.length-1)];
    player.stats[s]++;
    log(`✨ Fuente mística: +1 ${s}`, "event");
}

export function lootEvent() {
    generateLoot();
}

export function death() {
    log("☠️ Has muerto", "death");
    setExploring(false);
    
    player.hp = maxHp();
    
    const dungeonLogKey = `dungeonLog_${player.dungeon}`;
    localStorage.removeItem(dungeonLogKey);
    setCurrentDungeonLog([]);
    
    save();
}
